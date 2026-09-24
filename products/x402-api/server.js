// x402 pay-per-call README grader. Buyer pays $0.02 USDC on Base (eip155:8453).
// No private key here: the server only publishes payTo; the PayAI facilitator
// verifies the buyer's signed EIP-3009 authorization and submits it on-chain.
const express = require("express");
const { paymentMiddleware, x402ResourceServer } = require("@x402/express");
const { ExactEvmScheme } = require("@x402/evm/exact/server");
const { HTTPFacilitatorClient } = require("@x402/core/server");
const { declareDiscoveryExtension, bazaarResourceServerExtension } = require("@x402/extensions/bazaar");
const { gradeReadme } = require("./grader");

const PAY_TO = "0xA973f9F3D582189D5941e09cB4d198ca1e8E99cA";
const NETWORK = "eip155:8453"; // Base mainnet
const FACILITATOR = process.env.FACILITATOR_URL || "https://facilitator.payai.network";
const PORT = Number(process.env.PORT || 4021);

const facilitator = new HTTPFacilitatorClient({ url: FACILITATOR });
const server = new x402ResourceServer(facilitator)
  .register(NETWORK, new ExactEvmScheme())
  .registerExtension(bazaarResourceServerExtension);

const app = express();
app.use(express.json({ limit: "200kb" }));
app.use(express.text({ type: ["text/*"], limit: "200kb" }));

app.get("/", (_req, res) =>
  res.json({
    service: "README Grader (x402)",
    endpoint: "POST /grade  body: {\"markdown\": \"...\"}",
    price: "$0.02 USDC on Base per call",
    payTo: PAY_TO,
    protocol: "x402 v2",
  }),
);

app.use(
  paymentMiddleware(
    {
      "POST /grade": {
        accepts: { scheme: "exact", price: "$0.02", network: NETWORK, payTo: PAY_TO },
        description:
          "Grade a Markdown README 0-100 across 12 concrete checks (title, install, usage, code examples, license, badges, links, structure...) with a specific fix for each failed check.",
        mimeType: "application/json",
        extensions: {
          ...declareDiscoveryExtension({
            bodyType: "json",
            input: { markdown: "# my-lib\n\nA tiny library.\n\n## Install\n\n```\nnpm i my-lib\n```" },
            inputSchema: {
              type: "object",
              properties: { markdown: { type: "string", description: "README contents in Markdown" } },
              required: ["markdown"],
            },
            output: {
              example: { score: 62, grade: "Needs work", words: 120, headings: 3, codeBlocks: 1, checks: [] },
            },
          }),
        },
      },
    },
    server,
  ),
);

app.post("/grade", (req, res) => {
  const md = typeof req.body === "string" ? req.body : req.body && req.body.markdown;
  if (typeof md !== "string") return res.status(400).json({ error: "send {\"markdown\": \"...\"}" });
  res.json(gradeReadme(md));
});

app.listen(PORT, () => console.log(`x402 README grader on :${PORT}, payTo ${PAY_TO}, facilitator ${FACILITATOR}`));
