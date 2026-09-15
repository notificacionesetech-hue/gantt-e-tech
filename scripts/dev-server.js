// Servidor local SOLO para probar el proyecto antes de subirlo a Vercel.
// Imita lo mínimo del comportamiento de Vercel (estáticos de /public en "/",
// y /api/* enrutado al mismo handler catch-all) para no tener que instalar
// la CLI de Vercel en este entorno de pruebas.
// Uso: DATABASE_URL="postgres://..." node scripts/dev-server.js [puerto]
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const apiHandler = require("../api/[...slug].js");

const PORT = Number(process.argv[2]) || 8080;
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname.startsWith("/api/")) {
    const rest = url.pathname.replace(/^\/api\//, "").split("/").filter(Boolean);
    req.query = { slug: rest };
    url.searchParams.forEach((value, key) => { req.query[key] = value; });
    if (req.method !== "GET" && req.method !== "DELETE") {
      req.body = await readJsonBody(req);
    }
    res.status = (code) => { res.statusCode = code; return res; };
    return apiHandler(req, res);
  }

  let filePath = path.join(PUBLIC_DIR, url.pathname === "/" ? "index.html" : url.pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end("forbidden"); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end("not found: " + url.pathname); }
    res.writeHead(200, { "content-type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

function readJsonBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (e) { resolve({}); }
    });
  });
}

server.listen(PORT, () => console.log("dev server on http://127.0.0.1:" + PORT));
