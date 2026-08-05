import { Pool } from "pg";
import "dotenv/config";
import { faker } from "@faker-js/faker";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

async function seedCourses(count = 100): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values: any[] = [];
  const placeholders: string[] = [];

  for (let i = 0; i < count; i++) {
    const base = i * 9;
    placeholders.push(
      `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9})`
    );

    // Generate base price
    const basePrice = parseFloat(faker.commerce.price({ min: 10, max: 200 }));

    // 20% of courses have a previous price (meaning they're on sale)
    let previousPrice = null;
    let discountedPrice = null;

    if (i % 5 === 0) {
      // 20% chance
      // Previous price is higher than current price
      previousPrice = parseFloat((basePrice * (1 + faker.number.float({ min: 0.1, max: 0.5 }))).toFixed(2));
      // Discounted price is the same as current price (what you pay now)
      discountedPrice = basePrice;
    }

    values.push(
      faker.commerce.productName(), // title
      `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/400/400`, // image (no blur)
      faker.lorem.sentence(), // short_description
      basePrice, // price (current price)
      previousPrice, // previous_price (original price, null if not on sale)
      discountedPrice, // discounted_price (same as price when on sale)
      faker.number.int({ min: 10, max: 500 }), // wishlist
      faker.number.int({ min: 1, max: 500 }), // cart
      faker.number.int({ min: 80000, max: 105000 }) // learners_enrolled
    );
  }

  await pool.query("DROP TABLE IF EXISTS course CASCADE");
  await pool.query(`
    CREATE TABLE course (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      short_description TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      previous_price DECIMAL(10,2),
      discounted_price DECIMAL(10,2),
      wishlist INT NOT NULL,
      cart INT NOT NULL,
      learners_enrolled INT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const query = `
    INSERT INTO course (title, image, short_description, price, previous_price, discounted_price, wishlist, cart, learners_enrolled)
    VALUES ${placeholders.join(",")}
  `;

  await pool.query(query, values);
  console.log(`✅ ${count} courses seeded`);
}

(async () => {
  try {
    await seedCourses(100);
    await pool.end();
  } catch (err) {
    console.error(err);
    await pool.end();
  }
})();
