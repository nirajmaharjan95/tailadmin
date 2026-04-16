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

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Toys",
  "Books",
  "Automotive",
  "Health & Beauty",
  "Food & Beverage",
  "Office Supplies",
];

const statuses = ["active", "inactive", "pending", "canceled", "delivered"];

async function seedProducts(count = 100): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS product (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(100) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      sku VARCHAR(50) NOT NULL UNIQUE,
      image VARCHAR(255),
      status VARCHAR(20) NOT NULL DEFAULT 'active'
    )
  `);

  await pool.query(`
    ALTER TABLE product
      ADD COLUMN IF NOT EXISTS image VARCHAR(255),
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active'
  `);

  await pool.query("TRUNCATE TABLE product RESTART IDENTITY CASCADE");

  const values: (string | number | null)[] = [];
  const placeholders: string[] = [];

  for (let i = 0; i < count; i++) {
    const base = i * 7;
    placeholders.push(
      `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`
    );
    values.push(
      faker.commerce.productName(),
      faker.helpers.arrayElement(categories),
      parseFloat(faker.commerce.price({ min: 5, max: 2000 })),
      faker.number.int({ min: 0, max: 500 }),
      faker.string.alphanumeric(8).toUpperCase(),
      faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
      faker.helpers.arrayElement(statuses)
    );
  }

  const query = `
    INSERT INTO product (name, category, price, stock, sku, image, status)
    VALUES ${placeholders.join(",")}
  `;
  await pool.query(query, values);
  console.log(`✅ ${count} products seeded`);
}

(async () => {
  try {
    await seedProducts(100);
    await pool.end();
  } catch (err) {
    console.error(err);
    await pool.end();
  }
})();
