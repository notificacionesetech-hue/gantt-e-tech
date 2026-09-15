-- Gantt e-Tech · Fase 2 — esquema de base de datos
-- Proyecto totalmente independiente de Track-e (base de datos propia).
-- Ejecutar una sola vez en el editor SQL de Neon (o con psql) antes del primer deploy.

CREATE TABLE IF NOT EXISTS members (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL DEFAULT '',
  department  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS boards (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  label       TEXT NOT NULL,
  department  TEXT NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_boards_department ON boards(department);

CREATE TABLE IF NOT EXISTS proyectos (
  id          SERIAL PRIMARY KEY,
  board_id    INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_proyectos_board ON proyectos(board_id);

CREATE TABLE IF NOT EXISTS grupos (
  id          SERIAL PRIMARY KEY,
  proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_grupos_proyecto ON grupos(proyecto_id);

CREATE TABLE IF NOT EXISTS tasks (
  id            SERIAL PRIMARY KEY,
  grupo_id      INTEGER NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  start_date    DATE,
  end_date      DATE,
  dur           INTEGER NOT NULL DEFAULT 0,
  info          TEXT NOT NULL DEFAULT '',
  invitados     TEXT NOT NULL DEFAULT '',
  responsable   TEXT NOT NULL DEFAULT '',
  asistente     TEXT NOT NULL DEFAULT '',
  complete      INTEGER NOT NULL DEFAULT 0,
  requiere_doc  BOOLEAN NOT NULL DEFAULT false,
  doc_completa  BOOLEAN NOT NULL DEFAULT false,
  is_doc        BOOLEAN NOT NULL DEFAULT false,
  cal_synced    BOOLEAN NOT NULL DEFAULT false,
  completed_at  DATE,
  position      INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tasks_grupo ON tasks(grupo_id);
