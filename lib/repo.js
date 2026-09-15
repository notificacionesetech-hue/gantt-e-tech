// Capa de acceso a datos para el Gantt e-Tech (Fase 2).
// Traduce entre las filas de Postgres y la misma forma de objetos que ya
// usaba la vista previa de la Fase 1 (BOARDS / MEMBERS en memoria), para que
// el frontend cambie lo mínimo posible al pasar a base de datos real.
"use strict";

const { query, withTransaction } = require("./db");

function slugify(s) {
  return (
    String(s || "")
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "nuevo"
  );
}

function mapTaskRow(row) {
  return {
    _id: String(row.id),
    grupoId: row.grupo_id,
    title: row.title,
    start: row.start_date ? isoDate(row.start_date) : null,
    end: row.end_date ? isoDate(row.end_date) : null,
    dur: row.dur,
    info: row.info || "",
    invitados: row.invitados
      ? row.invitados
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    responsable: row.responsable || "",
    asistente: row.asistente || "",
    complete: row.complete,
    requiereDoc: row.requiere_doc,
    docCompleta: row.doc_completa,
    isDoc: row.is_doc,
    calSynced: row.cal_synced,
    completedAt: row.completed_at ? isoDate(row.completed_at) : null,
  };
}

// pg devuelve las columnas DATE como objetos Date (medianoche UTC) o como
// string según el driver/versión; esto normaliza siempre a 'YYYY-MM-DD'.
function isoDate(v) {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).slice(0, 10);
}

async function getFullData() {
  const [boardsRes, proyectosRes, gruposRes, tasksRes, membersRes] = await Promise.all([
    query("SELECT id, slug, label, department FROM boards ORDER BY position, id"),
    query("SELECT id, board_id, name FROM proyectos ORDER BY position, id"),
    query("SELECT id, proyecto_id, name FROM grupos ORDER BY position, id"),
    query(
      "SELECT id, grupo_id, title, start_date, end_date, dur, info, invitados, responsable, asistente, complete, requiere_doc, doc_completa, is_doc, cal_synced, completed_at FROM tasks ORDER BY position, id"
    ),
    query("SELECT id, name, email, department FROM members ORDER BY id"),
  ]);

  const tasksByGrupo = new Map();
  for (const row of tasksRes.rows) {
    const list = tasksByGrupo.get(row.grupo_id) || [];
    list.push(mapTaskRow(row));
    tasksByGrupo.set(row.grupo_id, list);
  }

  const gruposByProyecto = new Map();
  for (const g of gruposRes.rows) {
    const list = gruposByProyecto.get(g.proyecto_id) || [];
    list.push({ id: g.id, name: g.name, tasks: tasksByGrupo.get(g.id) || [] });
    gruposByProyecto.set(g.proyecto_id, list);
  }

  const proyectosByBoard = new Map();
  for (const p of proyectosRes.rows) {
    const list = proyectosByBoard.get(p.board_id) || [];
    list.push({ id: p.id, name: p.name, grupos: gruposByProyecto.get(p.id) || [] });
    proyectosByBoard.set(p.board_id, list);
  }

  const boards = boardsRes.rows.map((b) => ({
    id: b.id,
    slug: b.slug,
    label: b.label,
    department: b.department,
    proyectos: proyectosByBoard.get(b.id) || [],
  }));

  const members = membersRes.rows.map((m) => ({
    id: String(m.id),
    name: m.name,
    email: m.email || "",
    department: m.department,
  }));

  return { boards, members };
}

// Crea N subapartados (boards) nuevos para un departamento, cada uno con su
// proyecto contenedor y sus apartados anidados (grupos), sin tareas todavía.
// Replica exactamente lo que hacía el asistente "Configurar desde cero" en
// memoria en la Fase 1, ahora persistido.
async function createBoardsFromWizard(department, boardDrafts) {
  return withTransaction(async (client) => {
    const createdSlugs = [];
    const existing = await client.query("SELECT slug FROM boards");
    const taken = new Set(existing.rows.map((r) => r.slug));

    for (const draft of boardDrafts) {
      const name = String(draft.name || "").trim();
      if (!name) continue;
      let slug = slugify(name);
      let base = slug;
      let n = 2;
      while (taken.has(slug)) {
        slug = base + "-" + n;
        n++;
      }
      taken.add(slug);

      const boardRes = await client.query(
        "INSERT INTO boards (slug, label, department) VALUES ($1, $2, $3) RETURNING id, slug",
        [slug, name.toUpperCase(), department]
      );
      const boardId = boardRes.rows[0].id;

      const proyectoRes = await client.query(
        "INSERT INTO proyectos (board_id, name, position) VALUES ($1, $2, 0) RETURNING id",
        [boardId, name]
      );
      const proyectoId = proyectoRes.rows[0].id;

      const subs = draft.subs && draft.subs.length ? draft.subs : ["General"];
      for (let i = 0; i < subs.length; i++) {
        await client.query(
          "INSERT INTO grupos (proyecto_id, name, position) VALUES ($1, $2, $3)",
          [proyectoId, subs[i], i]
        );
      }

      createdSlugs.push(slug);
    }

    return createdSlugs;
  });
}

async function createTask(grupoId, title) {
  const res = await query(
    `INSERT INTO tasks (grupo_id, title, complete, position)
     VALUES ($1, $2, 0, (SELECT COALESCE(MAX(position), -1) + 1 FROM tasks WHERE grupo_id = $1))
     RETURNING id, grupo_id, title, start_date, end_date, dur, info, invitados, responsable, asistente, complete, requiere_doc, doc_completa, is_doc, cal_synced, completed_at`,
    [grupoId, title || "Nueva tarea"]
  );
  return mapTaskRow(res.rows[0]);
}

async function updateTask(id, fields) {
  const start = fields.start || null;
  const end = fields.end || null;
  const dur = start && end ? daysBetween(start, end) : Number(fields.dur) || 0;
  const invitados = Array.isArray(fields.invitados) ? fields.invitados.join(", ") : String(fields.invitados || "");

  const res = await query(
    `UPDATE tasks SET
       title = $1, start_date = $2, end_date = $3, dur = $4, info = $5,
       invitados = $6, responsable = $7, asistente = $8, complete = $9,
       requiere_doc = $10, completed_at = $11, updated_at = now()
     WHERE id = $12
     RETURNING id, grupo_id, title, start_date, end_date, dur, info, invitados, responsable, asistente, complete, requiere_doc, doc_completa, is_doc, cal_synced, completed_at`,
    [
      fields.title,
      start,
      end,
      dur,
      fields.info || "",
      invitados,
      fields.responsable || "",
      fields.asistente || "",
      Number(fields.complete) || 0,
      !!fields.requiereDoc,
      fields.completedAt || null,
      id,
    ]
  );
  if (res.rows.length === 0) return null;
  return mapTaskRow(res.rows[0]);
}

async function deleteTask(id) {
  const res = await query("DELETE FROM tasks WHERE id = $1", [id]);
  return res.rowCount > 0;
}

async function createMember(fields) {
  const res = await query(
    "INSERT INTO members (name, email, department) VALUES ($1, $2, $3) RETURNING id, name, email, department",
    [fields.name || "", fields.email || "", fields.department || ""]
  );
  const m = res.rows[0];
  return { id: String(m.id), name: m.name, email: m.email, department: m.department };
}

async function updateMember(id, fields) {
  const res = await query(
    "UPDATE members SET name = $1, email = $2, department = $3 WHERE id = $4 RETURNING id, name, email, department",
    [fields.name || "", fields.email || "", fields.department || "", id]
  );
  if (res.rows.length === 0) return null;
  const m = res.rows[0];
  return { id: String(m.id), name: m.name, email: m.email, department: m.department };
}

async function deleteMember(id) {
  const res = await query("DELETE FROM members WHERE id = $1", [id]);
  return res.rowCount > 0;
}

function daysBetween(a, b) {
  return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);
}

// Siembra la base de datos con los datos reales de la Fase 1 (lib/seed-data.js).
// No hace nada si ya hay tableros, salvo que se pida force (borra todo primero).
// La usan tanto scripts/seed.js (línea de comandos) como GET /api/seed (para
// no depender de tener Node instalado localmente).
async function seedIfEmpty(opts) {
  const force = !!(opts && opts.force);
  const { BOARDS, MEMBERS } = require("./seed-data");

  return withTransaction(async (client) => {
    const existing = await client.query("SELECT COUNT(*)::int AS n FROM boards");
    if (existing.rows[0].n > 0 && !force) {
      return { seeded: false, reason: "already_has_data", boards: existing.rows[0].n };
    }
    if (force) {
      await client.query("TRUNCATE tasks, grupos, proyectos, boards, members RESTART IDENTITY CASCADE");
    }

    for (const m of MEMBERS) {
      await client.query("INSERT INTO members (name, email, department) VALUES ($1, '', $2)", [m.name, m.department]);
    }

    let boardPos = 0;
    let taskCount = 0;
    for (const board of BOARDS) {
      const boardRes = await client.query(
        "INSERT INTO boards (slug, label, department, position) VALUES ($1, $2, $3, $4) RETURNING id",
        [board.slug, board.label, board.department, boardPos++]
      );
      const boardId = boardRes.rows[0].id;

      let proyPos = 0;
      for (const proy of board.proyectos) {
        const proyRes = await client.query(
          "INSERT INTO proyectos (board_id, name, position) VALUES ($1, $2, $3) RETURNING id",
          [boardId, proy.name, proyPos++]
        );
        const proyectoId = proyRes.rows[0].id;

        let grupoPos = 0;
        for (const grupo of proy.grupos) {
          const grupoRes = await client.query(
            "INSERT INTO grupos (proyecto_id, name, position) VALUES ($1, $2, $3) RETURNING id",
            [proyectoId, grupo.name, grupoPos++]
          );
          const grupoId = grupoRes.rows[0].id;

          let taskPos = 0;
          for (const task of grupo.tasks) {
            const status = seedComputeStatus(task);
            const completedAt = status === "Completado" ? task.completedAt || task.end || null : null;
            await client.query(
              `INSERT INTO tasks (grupo_id, title, start_date, end_date, dur, info, invitados, responsable, asistente, complete, requiere_doc, doc_completa, is_doc, cal_synced, completed_at, position)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
              [
                grupoId, task.title, task.start, task.end, task.dur, task.info,
                task.invitados.join(", "), task.responsable, task.asistente, task.complete,
                task.requiereDoc, task.docCompleta, task.isDoc, task.calSynced, completedAt, taskPos++,
              ]
            );
            taskCount++;
          }
        }
      }
    }

    return { seeded: true, boards: BOARDS.length, members: MEMBERS.length, tasks: taskCount };
  });
}

function seedComputeStatus(task) {
  var pct = task.complete;
  if (pct === null || pct === undefined || pct <= 0) return "No empezado";
  if (pct >= 100) {
    if (task.requiereDoc && !task.docCompleta) return "Pendiente de doc";
    return "Completado";
  }
  return "En proceso";
}

module.exports = {
  getFullData,
  createBoardsFromWizard,
  createTask,
  updateTask,
  deleteTask,
  createMember,
  updateMember,
  deleteMember,
  seedIfEmpty,
};
