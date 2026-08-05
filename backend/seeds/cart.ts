import { faker } from "@faker-js/faker";
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

async function seedCartItems(count = 25): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id         SERIAL PRIMARY KEY,
      user_id    TEXT NOT NULL,
      course_id  INT NOT NULL REFERENCES course(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, course_id)
    )
  `);

  const { rows: courses } = await pool.query("SELECT id FROM course ORDER BY id");
  if (courses.length === 0) {
    console.log("⚠️  No courses found. Run `npm run seed:course` first.");
    return;
  }

  const values: string[] = [];
  const placeholders: string[] = [];

  for (let i = 0; i < count; i++) {
    const base = i * 2;
    placeholders.push(`($${base + 1}, $${base + 2})`);

    const course = faker.helpers.arrayElement(courses);
    values.push(
      `user_${faker.string.alphanumeric(16)}`,
      course.id
    );
  }

  const query = `
    INSERT INTO cart_items (user_id, course_id)
    VALUES ${placeholders.join(",")}
    ON CONFLICT (user_id, course_id) DO NOTHING
  `;
  await pool.query(query, values);
  console.log(`✅ ${count} cart items seeded`);
}

(async () => {
  try {
    await seedCartItems();
    await pool.end();
  } catch (err) {
    console.error(err);
    await pool.end();
  }
})();
