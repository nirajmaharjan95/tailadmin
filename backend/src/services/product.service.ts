import pool from "../config/db.js";
import { Product, ProductInput } from "../models/product.model.js";

export const getAllProducts = async (
  limit = 10,
  offset = 0,
  search = ""
): Promise<{ data: Product[]; total: number }> => {
  const pattern = `%${search}%`;
  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT * FROM product
       WHERE name ILIKE $3 OR category ILIKE $3
       ORDER BY id DESC LIMIT $1 OFFSET $2`,
      [limit, offset, pattern]
    ),
    pool.query(`SELECT COUNT(*) FROM product WHERE name ILIKE $1 OR category ILIKE $1`, [pattern]),
  ]);
  return { data: dataResult.rows, total: Number(countResult.rows[0].count) };
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const result = await pool.query("SELECT * FROM product WHERE id = $1", [id]);
  return result.rows[0] ?? null;
};

export const createProduct = async (data: ProductInput): Promise<Product> => {
  const { name, category, price, stock, sku, image, status } = data;
  const result = await pool.query(
    `INSERT INTO product (name, category, price, stock, sku, image, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, category, price, stock, sku, image ?? null, status ?? "active"]
  );
  return result.rows[0];
};

export const updateProduct = async (id: number, data: ProductInput): Promise<Product | null> => {
  const { name, category, price, stock, sku, image, status } = data;
  const result = await pool.query(
    `UPDATE product SET name=$1, category=$2, price=$3, stock=$4, sku=$5, image=$6, status=$7
     WHERE id=$8 RETURNING *`,
    [name, category, price, stock, sku, image ?? null, status ?? "active", id]
  );
  return result.rows[0] ?? null;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM product WHERE id=$1 RETURNING *", [id]);
  return result.rows.length > 0;
};
