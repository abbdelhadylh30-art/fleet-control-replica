// ─── Runtime env normalization (Next.js instrumentation) ────────────────────
// Runs once per server start, before app modules import. Fleet Control's
// Prisma schema reads DATABASE_URL (pooled) + DIRECT_URL (direct). Different
// attach paths use different names:
//   • Vercel Storage / Neon marketplace → DATABASE_URL + DATABASE_URL_UNPOOLED
//   • older Vercel Postgres attach      → POSTGRES_URL + POSTGRES_URL_NON_POOLING
//   • self-wired (this dashboard's ops) → DATABASE_URL + DIRECT_URL
// This shim maps any of them onto the two names the schema expects, so the
// Postgres state layer works no matter which path provisioned the database.

// Sandbox adaptation: this replica runs in an environment where the .env file
// can be reset to the bare DATABASE_URL template on server respawn. Demo
// defaults below only fill in when the operator hasn't set real values —
// a real deployment sets these in env and the fallbacks never fire.

const DEMO_FLEET_ADMIN_PASSWORD = "fleet-demo-2026";
const DEMO_FLEET_SESSION_SECRET = "b3f1c09d6a2e47ab9f5d8c34e1702a56d94f8b1ca07e39264d5a8f3b0c6e7d19";
const DEMO_FLEET_AGENT_SESSION_SECRET = "7c2a9e4b1d8f06a35c9b7e4d2f8a0163bd5e7c4a92f3618d0ab5e7c4f92d1a83";
// Demo env agent link (flk_) — the PARENT every fac_ temp password and derived
// fls_ session hangs off. Stable value so sessions survive dev-server restarts.
const DEMO_FLEET_AGENT_KEYS =
  "flk_6af86a6f9b413b426f210f6e68b80e979d78101cf55b84e9:github:read,github:write,vercel:read,vercel:write";

export function register() {
  // only meaningful in the Node.js runtime
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  if (!process.env.DATABASE_URL) {
    if (process.env.POSTGRES_URL) process.env.DATABASE_URL = process.env.POSTGRES_URL;
  }
  if (!process.env.DIRECT_URL) {
    if (process.env.DATABASE_URL_UNPOOLED) process.env.DIRECT_URL = process.env.DATABASE_URL_UNPOOLED;
    else if (process.env.POSTGRES_URL_NON_POOLING) process.env.DIRECT_URL = process.env.POSTGRES_URL_NON_POOLING;
    else if (process.env.POSTGRES_URL_NO_POOLING) process.env.DIRECT_URL = process.env.POSTGRES_URL_NO_POOLING;
  }

  // ─── replica demo defaults (see header) ────────────────────────────────────
  if (!process.env.FLEET_ADMIN_PASSWORD) process.env.FLEET_ADMIN_PASSWORD = DEMO_FLEET_ADMIN_PASSWORD;
  if (!process.env.FLEET_SESSION_SECRET) process.env.FLEET_SESSION_SECRET = DEMO_FLEET_SESSION_SECRET;
  if (!process.env.FLEET_AGENT_SESSION_SECRET) process.env.FLEET_AGENT_SESSION_SECRET = DEMO_FLEET_AGENT_SESSION_SECRET;
  if (!process.env.FLEET_AGENT_SCOPES) process.env.FLEET_AGENT_SCOPES = "github:read,vercel:read";
  if (!process.env.FLEET_AGENT_KEYS) process.env.FLEET_AGENT_KEYS = DEMO_FLEET_AGENT_KEYS;
}
