// Migra a la base de datos los datos reales de la Fase 1 (lib/seed-data.js:
// los 4 tableros GENERAL/M&I/ACCU/REFRI con sus tareas reales, y el
// directorio de miembros). Se ejecuta UNA VEZ, justo después de crear las
// tablas con lib/schema.sql.
//
// Uso:
//   DATABASE_URL="postgres://..." node scripts/seed.js
//
// Si las tablas ya tienen datos, no hace nada (para no duplicar) a menos que
// se pase --force, que primero borra todo el contenido de las 5 tablas.
//
// Alternativa sin terminal: la misma siembra está disponible como
// GET /api/seed?token=... una vez desplegado en Vercel (ver README.md).
"use strict";

const { getPool } = require("../lib/db");
const repo = require("../lib/repo");

async function main() {
  const force = process.argv.includes("--force");
  const result = await repo.seedIfEmpty({ force });
  if (!result.seeded) {
    console.log("Ya hay " + result.boards + " tableros en la base de datos. No se siembra de nuevo (usa --force para borrar y repetir).");
  } else {
    console.log("Hecho: " + result.boards + " tableros, " + result.members + " miembros, " + result.tasks + " tareas.");
  }
  await getPool().end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
