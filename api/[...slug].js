// Ruta "catch-all" de la API del Gantt e-Tech.
// Vercel despliega este archivo como una función serverless que recibe
// cualquier petición a /api/*. En vez de fiarnos de que Vercel nos pase la
// ruta ya trocito a trocito en req.query.slug (en producción no lo estaba
// haciendo de forma fiable para rutas de un solo tramo, p. ej. /api/data),
// la sacamos nosotros mismos de la URL real de la petición.
"use strict";

const repo = require("../lib/repo");

module.exports = async function handler(req, res) {
  const parsedUrl = new URL(req.url, "http://internal");
  const slug = parsedUrl.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const query = Object.fromEntries(parsedUrl.searchParams.entries());
  const method = req.method || "GET";

  try {
    // GET /api/seed?token=... — siembra los datos reales de la Fase 1 UNA VEZ.
    // Protegido por la variable de entorno SEED_TOKEN para que nadie más pueda
    // llamarla por accidente. No hace nada si ya hay tableros, salvo &force=1.
    if (slug[0] === "seed" && slug.length === 1 && (method === "GET" || method === "POST")) {
      const expected = process.env.SEED_TOKEN;
      if (!expected) {
        return json(res, 500, { error: "Falta configurar la variable de entorno SEED_TOKEN en Vercel." });
      }
      if (query.token !== expected) {
        return json(res, 403, { error: "Token incorrecto." });
      }
      const result = await repo.seedIfEmpty({ force: query.force === "1" });
      return json(res, 200, result);
    }

    // GET /api/data — foto completa (tableros + tareas + miembros)
    if (slug[0] === "data" && slug.length === 1 && method === "GET") {
      const data = await repo.getFullData();
      return json(res, 200, data);
    }

    // POST /api/boards — asistente "Configurar desde cero"
    if (slug[0] === "boards" && slug.length === 1 && method === "POST") {
      const body = await readBody(req);
      const department = String(body.department || "").trim();
      const drafts = Array.isArray(body.boards) ? body.boards : [];
      if (!department) return json(res, 400, { error: "Falta el departamento." });
      if (!drafts.length) return json(res, 400, { error: "Falta al menos un subapartado." });
      const createdSlugs = await repo.createBoardsFromWizard(department, drafts);
      if (!createdSlugs.length) return json(res, 400, { error: "Ningún subapartado tenía nombre." });
      const data = await repo.getFullData();
      return json(res, 201, { createdSlugs, data });
    }

    // POST /api/grupos/:id/tasks — crear tarea nueva dentro de un apartado
    if (slug[0] === "grupos" && slug.length === 3 && slug[2] === "tasks" && method === "POST") {
      const grupoId = Number(slug[1]);
      if (!Number.isInteger(grupoId)) return json(res, 400, { error: "Apartado inválido." });
      const body = await readBody(req);
      const task = await repo.createTask(grupoId, body.title);
      return json(res, 201, task);
    }

    // PUT /api/tasks/:id — guardar cambios de una tarea
    if (slug[0] === "tasks" && slug.length === 2 && method === "PUT") {
      const id = Number(slug[1]);
      if (!Number.isInteger(id)) return json(res, 400, { error: "Tarea inválida." });
      const body = await readBody(req);
      const task = await repo.updateTask(id, body);
      if (!task) return json(res, 404, { error: "Tarea no encontrada." });
      return json(res, 200, task);
    }

    // DELETE /api/tasks/:id
    if (slug[0] === "tasks" && slug.length === 2 && method === "DELETE") {
      const id = Number(slug[1]);
      if (!Number.isInteger(id)) return json(res, 400, { error: "Tarea inválida." });
      const ok = await repo.deleteTask(id);
      if (!ok) return json(res, 404, { error: "Tarea no encontrada." });
      return json(res, 200, { ok: true });
    }

    // POST /api/members — nuevo miembro del equipo
    if (slug[0] === "members" && slug.length === 1 && method === "POST") {
      const body = await readBody(req);
      const member = await repo.createMember(body);
      return json(res, 201, member);
    }

    // PUT /api/members/:id
    if (slug[0] === "members" && slug.length === 2 && method === "PUT") {
      const id = Number(slug[1]);
      if (!Number.isInteger(id)) return json(res, 400, { error: "Miembro inválido." });
      const body = await readBody(req);
      const member = await repo.updateMember(id, body);
      if (!member) return json(res, 404, { error: "Miembro no encontrado." });
      return json(res, 200, member);
    }

    // DELETE /api/members/:id
    if (slug[0] === "members" && slug.length === 2 && method === "DELETE") {
      const id = Number(slug[1]);
      if (!Number.isInteger(id)) return json(res, 400, { error: "Miembro inválido." });
      const ok = await repo.deleteMember(id);
      if (!ok) return json(res, 404, { error: "Miembro no encontrado." });
      return json(res, 200, { ok: true });
    }

    return json(res, 404, { error: "Ruta de API no encontrada: " + method + " /api/" + slug.join("/") });
  } catch (err) {
    console.error(err);
    return json(res, 500, { error: err.message || "Error interno del servidor." });
  }
};

function json(res, status, body) {
  res.status(status).setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

// Vercel ya parsea el body JSON en req.body para funciones Node normales,
// pero por si llega sin parsear (p. ej. en el servidor local de pruebas) se
// lee el stream a mano como respaldo.
async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  return await new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(new Error("JSON inválido en el cuerpo de la petición."));
      }
    });
    req.on("error", reject);
  });
}
