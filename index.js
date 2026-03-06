import { createBareServer } from "@tomphttp/bare-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import express from "express";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const bare = createBareServer("/bare/");
const app  = express();

// sw.js with Service-Worker-Allowed header
app.get("/sw.js", (req, res) => {
  res.setHeader("Service-Worker-Allowed", "/");
  res.sendFile(join(__dirname, "public", "sw.js"));
});

// UV static files
app.use("/uv/", express.static(uvPath));

// Frontend static files
app.use(express.static(join(__dirname, "public")));

// Fallback to index.html
app.use((req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// Vercel-compatible default export — a plain function(req, res)
export default function handler(req, res) {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
}
