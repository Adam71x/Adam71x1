# Vista `vista deploy` bug hunt: reproduction findings

Target issue: https://github.com/Mantitup-Org/vista/issues/62 (opened 2026-09-20; labels `bug`, `help wanted`, `bounty`, where the bounty label reads "Paid or credited bug/feature hunt"). Companion issue: #61.

Environment: Linux, Node from the sandbox, `create-vista-app@0.3.6`, `@vistagenic/vista@0.3.6` (npm `time.modified` 2026-09-20T18:48Z). Run on 2026-09-24 at about 14:06 UTC.

Steps (exactly as the issue gives them):
```sh
npx create-vista-app@latest deploy-bounty-app --yes --skip-install
cd deploy-bounty-app && npm install && npm run build     # build OK, 1 page prerendered
npx vista deploy --target <t> --dry-run --force           # t = cloudflare|vercel|netlify|render|docker; all exit 0
```
Not checked: the live site https://vistajs.pages.dev. The sandbox's egress proxy blocks that host, so no live HTTP status codes were collected.

---

## F1. Render: `startCommand` does not match the standalone server (confirmed, matches a failure mode listed in the issue)
`dist/deploy/adapters/render.js:20` emits:
```yaml
startCommand: npm run start      # -> "vista start"
```
The docker target in the same version emits `CMD ["node", ".vista/standalone/server.js"]`, and the same dry-run lists `.vista/standalone/server.js` as the Render artifact. The generated start command doesn't match the documented standalone entrypoint.
**Suggested fix:** emit `startCommand: node .vista/standalone/server.js`, and change the "Next steps" hint at `render.js:48` to match.

## F2. Cloudflare static `_redirects` includes an identity rewrite (reproduced; matches the "identity `.rsc` rule" failure mode)
With `deploy: { target: 'cloudflare', output: 'static' }`, `.vista/deploy/cloudflare/_redirects` contains:
```
/rsc /rsc/index.rsc 200
/rsc/ /rsc/index.rsc 200
/rsc/*.rsc /rsc/:splat.rsc 200     <- rewrites /rsc/X.rsc to itself
/rsc/* /rsc/:splat.rsc 200
```
It comes from `writeStaticRscRedirects()` in `dist/deploy/utils.js:137-146`. Line 3 maps a path to itself. Line 4 then catches `/rsc/X.rsc` a second time and would append another `.rsc` if line 3 were ever skipped. On Pages, a 200 rewrite to the same path is a no-op at best and a loop or HTML fallback at worst. That fits the symptom the issue describes: Flight fetches come back as HTML.
**Suggested fix:** delete line 3. Physical `rsc/*.rsc` files are served as static assets before rewrites. Keep only `/rsc`, `/rsc/`, and a non-`.rsc` catch-all. On Pages you can't exclude a suffix, so either list rewrites for each route (the prerender manifest has the list) or have the client always request `/rsc/<route>.rsc` directly so it needs no rewrite.
*Needs live confirmation on Pages. I couldn't reach Cloudflare from the sandbox.*

## F3. Netlify: `node_bundler = "none"` is not a documented Netlify value (likely config error)
`dist/deploy/adapters/netlify.js:38` writes:
```toml
[functions]
  node_bundler = "none"
```
Netlify documents `esbuild` and `zisi` (plus `nft` internally) for `node_bundler`. An unknown value may fail config validation or be silently ignored. If it's ignored, the default bundler runs, and it may not pick up the `.vista/standalone/server.js` that `ssr.js` loads with a dynamic `require(path.join(...))`. `included_files` is set, which helps. Please confirm against current Netlify docs before filing.
**Suggested fix:** `node_bundler = "zisi"` (or `esbuild` together with `external_node_modules`), and keep `included_files`.

## F4. Cloudflare default (non-static) target always emits the Containers path (reproduced; listed failure mode)
With the default config (`target: 'auto'`, no `output`), `--target cloudflare` writes `wrangler.toml` with `[[containers]]`, a Durable Object binding, a `[[migrations]]` block, *and* a root `Dockerfile`. Nothing asks whether the user wanted static Pages or explains the choice. Also:
- `wrangler.toml` has no `[assets]` binding, so every `_vista/static/*` request goes through the Durable Object and container.
- `worker.js` hardcodes container port `3003`.
- Running `--dry-run --force` for several targets one after another leaves conflicting platform files at the project root (`Dockerfile`, `wrangler.toml`, `vercel.json`, `netlify.toml`, `render.yaml`, `.dockerignore`). `--dry-run` is documented as "Build + emit + validate only", so emitting files is intended. Still, a warning about stale files from other targets would help.

## F5. Runtime version pins to Node 20 (worth checking)
- Vercel `.vc-config.json`: `"runtime": "nodejs20.x"`
- Dockerfile: `FROM node:20-alpine`, in both stages.
Node 20 reached end of life in April 2026. Check whether Vercel still accepts `nodejs20.x` for new deployments. Consider `nodejs22.x` / `node:22-alpine`.

## What passed
- Vercel: `index.func` contains `.vista/standalone/server.js` and `node_modules`. The "missing standalone server.js" failure mode did **not** reproduce on 0.3.6.
- Docker: `CMD` matches `node .vista/standalone/server.js`.
- Netlify: `netlify/functions/.vista/standalone` exists, so the `included_files` glob matches.
