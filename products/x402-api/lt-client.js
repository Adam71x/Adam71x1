// Minimal localtunnel client that reaches localtunnel.me through the HTTPS_PROXY via CONNECT.
// localtunnel needs no account: GET https://localtunnel.me/?new returns a public URL + TCP port.
const net = require("net");
const https = require("https");
const LOCAL = Number(process.env.LOCAL_PORT || 4021);
const SUB = process.env.SUBDOMAIN || "";
const proxy = new URL(process.env.HTTPS_PROXY);

function connectVia(host, port) {
  return new Promise((resolve, reject) => {
    const s = net.connect(Number(proxy.port), proxy.hostname, () => {
      s.write(`CONNECT ${host}:${port} HTTP/1.1\r\nHost: ${host}:${port}\r\n\r\n`);
    });
    let buf = "";
    const onData = (d) => {
      buf += d.toString("latin1");
      const i = buf.indexOf("\r\n\r\n");
      if (i < 0) return;
      s.removeListener("data", onData);
      if (!/^HTTP\/1\.[01] 200/.test(buf)) return reject(new Error(buf.split("\r\n")[0]));
      resolve(s);
    };
    s.on("data", onData);
    s.on("error", reject);
  });
}

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const { execFileSync } = require("child_process");
    try { resolve(JSON.parse(execFileSync("curl", ["-s", "-m", "15", url]).toString())); } catch (e) { reject(e); }
  });
}

async function worker(info) {
  for (;;) {
    try {
      const remote = await connectVia("localtunnel.me", info.port);
      await new Promise((done) => {
        const local = net.connect(LOCAL, "127.0.0.1");
        remote.pipe(local).pipe(remote);
        const end = () => { remote.destroy(); local.destroy(); done(); };
        remote.on("close", end); local.on("close", end);
        remote.on("error", end); local.on("error", end);
      });
    } catch (e) {
      console.error("worker error", e.message);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

(async () => {
  const info = await getJSON(SUB ? `https://localtunnel.me/${SUB}` : "https://localtunnel.me/?new");
  console.log(JSON.stringify(info));
  for (let i = 0; i < (info.max_conn_count || 1); i++) worker(info);
})();
