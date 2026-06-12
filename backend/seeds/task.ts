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

const statuses = ["To Do", "In Progress", "Completed"] as const;
const tags = ["Marketing", "Template", "Development"] as const;

async function seedTasks(count = 50): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS task CASCADE`);

  await pool.query(`
    CREATE TABLE task (
      id          SERIAL PRIMARY KEY,
      task_title  VARCHAR(200)  NOT NULL,
      due_date    DATE          NOT NULL,
      status      VARCHAR(20)   NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Completed')),
      tags        VARCHAR(50)   NOT NULL,
      description TEXT,
      created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    )
  `);

  const values: string[] = [];
  const placeholders: string[] = [];

  for (let i = 0; i < count; i++) {
    const base = i * 5;
    placeholders.push(
      `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`
    );

    const taskTag = faker.helpers.arrayElement(tags);

    values.push(
      faker.hacker.phrase(),
      faker.date.soon({ days: 30 }).toISOString().split("T")[0],
      faker.helpers.arrayElement(statuses),
      taskTag,
      faker.lorem.sentence()
    );
  }

  const query = `
    INSERT INTO task (task_title, due_date, status, tags, description)
    VALUES ${placeholders.join(",")}
  `;
  await pool.query(query, values);
  console.log(`✅ ${count} tasks seeded`);
}

(async () => {
  try {
    await seedTasks(10);
    await pool.end();
  } catch (err) {
    console.error(err);
    await pool.end();
  }
})();
