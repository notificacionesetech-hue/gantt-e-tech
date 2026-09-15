// Conexión a Postgres (Neon) para el proyecto Gantt e-Tech.
// Base de datos totalmente propia de este proyecto, sin relación con Track-e.
//
// Vercel + la integración de Neon crean automáticamente una variable de
// entorno con la cadena de conexión, pero el nombre exacto puede variar
// (DATABASE_URL, POSTGRES_URL, ...). Se prueban en orden hasta encontrar una.
"use strict";

const { Pool } = require("pg");

function resolveConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    ""
  );
}

function resolveSsl(connectionString) {
  try {
    const host = new URL(connectionString).hostname;
    if (host === "localhost" || host === "127.0.0.1") return false;
  } catch (e) {
    /* si no se puede parsear, se asume que hace falta SSL (caso Neon) */
  }
  return { rejectUnauthorized: false };
}

let pool = null;
function getPool() {
  if (!pool) {
    const connectionString = resolveConnectionString();
    if (!connectionString) {
      throw new Error(
        "No se encontró ninguna variable de entorno de conexión a la base de datos " +
          "(DATABASE_URL / POSTGRES_URL). Revisa que la base de datos de Neon esté " +
          "conectada a este proyecto de Vercel."
      );
    }
    pool = new Pool({
      connectionString,
      ssl: resolveSsl(connectionString),
      max: 5,
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}

async function query(text, params) {
  const client = await getPool().connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

// Ejecuta varias queries en una sola transacción (todo o nada).
async function withTransaction(fn) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { query, withTransaction, getPool };
