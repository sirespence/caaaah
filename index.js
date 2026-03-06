import { createServer } from "node:http";
import { createBareServer } from "@tomphttp/bare-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import express from "express";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const bare = createBareServer("/bare/");
const app  = express();

// Serve custom sw.js from root with Service-Worker-Allowed: /
app.get("/sw.js", (req, res) => {
  res.setHeader("Service-Worker-Allowed", "/");
  res.sendFile(join(__dirname, "public", "sw.js"));
});

// Serve UV static files
app.use("/uv/", express.static(uvPath));

// Serve our frontend from /public
app.use(express.static(join(__dirname, "public")));

// Fallback to index.html
app.use((req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

const server = createServer();

server.on("request", (req, res) => {
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

export default app;
