import { createServer } from "node:http";
import { createBareServer } from "@tomphttp/bare-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import express from "express";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const bare = createBareServer("/bare/");
const app  = express();

// Serve custom sw.js with Service-Worker-Allowed header
app.get("/sw.js", (req, res) => {
  res.setHeader("Service-Worker-Allowed", "/");
  res.sendFile(join(__dirname, "public", "sw.js"));
});

// Serve UV static files
app.use("/uv/", express.static(uvPath));

// Serve frontend static files
app.use(express.static(join(__dirname, "public")));

// Fallback
app.use((req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// Main handler — bare server must intercept BEFORE express
const server = createServer((req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`ATOM running on port ${port}`);
});

export default server;
