import express from "express";
import { createServer } from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import wisp from "wisp-server-node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Static frontend
app.use(express.static(join(__dirname, "public")));

// UV + transport vendor files
app.use("/uv/",      express.static(uvPath));
app.use("/epoxy/",   express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

// Fallback to index.html
app.use((req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// HTTP server with required COOP/COEP headers for SharedArrayBuffer + SW
const server = createServer((req, res) => {
  res.setHeader("Cross-Origin-Opener-Policy",   "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  app(req, res);
});

// Wisp WebSocket transport
server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

const port = parseInt(process.env.PORT || "8080");
server.listen(port, "0.0.0.0", () => {
  console.log(`ATOM running → http://0.0.0.0:${port}`);
});
