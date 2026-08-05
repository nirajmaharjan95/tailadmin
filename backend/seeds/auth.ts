import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Creates/upgrades the authentication schema: the users table (kept
// compatible with existing rows) and the refresh_tokens table used for
// rotation and revocation.
async function seedAuthSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      first_name    VARCHAR(100) NOT NULL,
      last_name     VARCHAR(100) NOT NULL,
      email         VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role          VARCHAR(20) NOT NULL DEFAULT 'user',
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Account status (spec §33) — added separately so pre-existing users
  // tables are upgraded in place.
  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      jti        UUID PRIMARY KEY,
      user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash VARCHAR(64) NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id
    ON refresh_tokens(user_id)
  `);

  console.log("✅ Auth schema ready (users, refresh_tokens)");
}

(async () => {
  try {
    await seedAuthSchema();
    await pool.end();
  } catch (err) {
    console.error(err);
    await pool.end();
    process.exitCode = 1;
  }
})();
