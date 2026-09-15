# Gantt e-Tech — Fase 2

Backend real (Postgres + funciones serverless de Vercel) para el Gantt del equipo. Proyecto
totalmente independiente de Track-e: base de datos propia, repo propio, deploy propio.

## Estructura

```
public/index.html   → la web (mismo diseño que la Fase 1, ahora conectado a la API)
api/[...slug].js     → toda la API (una sola función serverless, enruta por la URL)
lib/db.js            → conexión a Postgres
lib/repo.js          → todas las operaciones sobre la base de datos
lib/seed-data.js      → los datos reales de tu Sheet (tableros + miembros)
lib/schema.sql        → las tablas que hay que crear una vez
scripts/seed.js        → alternativa por terminal a GET /api/seed (no la necesitas si sigues estos pasos)
```

## Puesta en marcha (una sola vez)

1. **Sube estos archivos a un repo nuevo en GitHub** (por ejemplo `gantt-etech`), manteniendo
   la estructura de carpetas tal cual. No subas la carpeta `node_modules` si la tuvieras — Vercel
   instala las dependencias solo (`pg`, listada en `package.json`).

2. **Crea el proyecto en Vercel** importando ese repo ("Add New" → "Project").

3. **Conecta la base de datos de Neon que ya creaste** a este proyecto: en el dashboard de
   Vercel → Storage → tu base de datos → "Connect Project" → elige este proyecto. Esto añade
   automáticamente la variable de entorno con la conexión (`DATABASE_URL` o similar).

4. **Añade una variable de entorno más**, en Settings → Environment Variables del proyecto:
   - `SEED_TOKEN` = cualquier cadena larga que te inventes (por ejemplo `gantt-etech-2026-xyz`).
   Sirve para poder cargar los datos reales una vez, sin necesitar terminal.

5. **Vuelve a desplegar** (Deployments → el último → "Redeploy") para que recoja las nuevas
   variables de entorno.

6. **Crea las tablas**: abre el editor SQL de Neon (desde el dashboard de Vercel → Storage → tu
   base de datos → "Open in Neon Console" → SQL Editor, o directamente en neon.tech) y pega y
   ejecuta el contenido completo de `lib/schema.sql`.

7. **Carga los datos reales** (los 4 tableros con tus tareas, y el directorio de 11 miembros):
   abre en el navegador
   ```
   https://TU-PROYECTO.vercel.app/api/seed?token=EL_SEED_TOKEN_QUE_PUSISTE
   ```
   Debería responder algo como `{"seeded":true,"boards":4,"members":11,"tasks":126}`. Si lo
   abres una segunda vez por error no pasa nada: responde `{"seeded":false,...}` sin duplicar
   nada.

8. **Abre la web** (`https://TU-PROYECTO.vercel.app/`) y comprueba que ves tus tableros reales.
   A partir de aquí, todo lo que edites, crees o borres se guarda de verdad para todo el equipo.

## Si algo no carga

La propia página, si no consigue hablar con la base de datos, te lo dice en pantalla en vez de
quedarse en blanco (revisa que el paso 3 y el paso 6 estén hechos). Los errores de la función de
API se pueden ver en Vercel → tu proyecto → pestaña "Logs".

## Actualizar el código más adelante

Cuando haya que cambiar algo, se sube el archivo cambiado al mismo repo de GitHub (o se
reemplaza por la web de GitHub) y Vercel vuelve a desplegar solo.


