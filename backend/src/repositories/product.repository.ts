import pool from "../config/db.js";
import { Product } from "../types/product.types.js";
import { ProductInput } from "../validations/product.validation.js";

export const findAll = (limit: number, offset: number, pattern: string) =>
  pool.query(
    `SELECT * FROM product
     WHERE name ILIKE $3 OR category ILIKE $3
     ORDER BY id DESC LIMIT $1 OFFSET $2`,
    [limit, offset, pattern]
  );

// Count all products matching the pattern (search term) for pagination purposes.
export const countAll = async (pattern: string): Promise<number> => {
  const result = await pool.query(`SELECT COUNT(*) FROM product WHERE name ILIKE $1 OR category ILIKE $1`, [pattern]);
  return Number(result.rows[0]?.count ?? 0);
};

export const countAllRows = async (): Promise<number> => {
  const result = await pool.query(`SELECT COUNT(*) FROM product`);
  return Number(result.rows[0]?.count ?? 0);
};

export const findById = async (id: number): Promise<Product | null> => {
  const result = await pool.query("SELECT * FROM product WHERE id = $1", [id]);
  return result.rows[0] ?? null;
};

export const insert = async (data: ProductInput): Promise<Product> => {
  const { name, category, price, stock, sku, image, status } = data;
  const result = await pool.query(
    `INSERT INTO product (name, category, price, stock, sku, image, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, category, price, stock, sku, image ?? null, status ?? "active"]
  );
  return result.rows[0];
};

export const update = async (id: number, data: ProductInput): Promise<Product | null> => {
  const { name, category, price, stock, sku, image, status } = data;
  const result = await pool.query(
    `UPDATE product SET name=$1, category=$2, price=$3, stock=$4, sku=$5, image=$6, status=$7
     WHERE id=$8 RETURNING *`,
    [name, category, price, stock, sku, image ?? null, status ?? "active", id]
  );
  return result.rows[0] ?? null;
};

export const remove = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM product WHERE id=$1 RETURNING *", [id]);
  return result.rows.length > 0;
};
