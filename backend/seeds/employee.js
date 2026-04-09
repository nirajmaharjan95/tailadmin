import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config'; 
import { faker } from '@faker-js/faker';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const positions = [
  'Software Engineer',
  'QA Engineer',
  'Product Manager',
  'HR Manager',
  'Accountant',
  'Sales Executive',
  'UX Designer',
  'DevOps Engineer',
  'Marketing Manager',
  'Finance Analyst',
  'Customer Support',
  'Business Analyst',
  'Data Scientist',
  'Product Designer',
  'Technical Lead'
];

const offices = [
  'New York', 'London', 'Tokyo', 'Sydney', 'Berlin', 'Paris', 'Toronto', 'San Francisco',
  'Dubai', 'Singapore', 'Amsterdam', 'Chicago', 'Hong Kong', 'Seoul', 'Madrid', 'Rome',
  'Los Angeles', 'Vancouver', 'Bangkok', 'Shanghai', 'Melbourne', 'Dublin', 'Stockholm',
  'Zurich', 'Barcelona', 'Vienna', 'Mumbai', 'Cape Town', 'Buenos Aires', 'Lisbon'
];

async function seedEmployees(count = 100) {
  const values = [];
  const placeholders = [];

  for (let i = 0; i < count; i++) {
    const baseIndex = i * 8;

    placeholders.push(
      `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, 
        $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8}) `
    );

    values.push(
      faker.person.firstName(),
      faker.person.lastName(),
      faker.helpers.arrayElement(positions),
      faker.helpers.arrayElement(offices),
      faker.number.int({ min: 21, max: 60 }),
      faker.date.past({ years: 10 }),
      faker.number.int({ min: 30000, max: 150000 }),
      '984' + faker.string.numeric(7)
    );
  }

// Remove old data
await pool.query('TRUNCATE TABLE employee RESTART IDENTITY CASCADE');

// Insert new data
const query = `
  INSERT INTO employee 
  (first_name, last_name, position, office, age, start_date, salary, phone)
  VALUES ${placeholders.join(',')}
`;
  await pool.query(query, values);
  console.log(`✅ ${count} employees seeded`);
}

(async () => {
  try {
    await seedEmployees(100); // change count here
    await pool.end();
  } catch (err) {
    console.error(err);
    await pool.end();
  }
})();