import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all employees
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employee");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees." });
  }
});

// Get employee by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employee WHERE id = $1", [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: "Employee not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employee." });
  }
});

// Create employee
router.post("/", async (req, res) => {
  const { first_name, last_name, position, office, age, start_date, salary } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO employee (first_name, last_name, position, office, age, start_date, salary)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [first_name, last_name, position, office, age, start_date, salary]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Failed to create employee." });
  }
});

// Update employee
router.put("/:id", async (req, res) => {
  const { first_name, last_name, position, office, age, start_date, salary } = req.body;
  try {
    const result = await pool.query(
      `UPDATE employee SET first_name=$1, last_name=$2, position=$3, office=$4,
       age=$5, start_date=$6, salary=$7 WHERE id=$8 RETURNING *`,
      [first_name, last_name, position, office, age, start_date, salary, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Employee not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Failed to update employee." });
  }
});

// Delete employee
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM employee WHERE id=$1 RETURNING *", [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete employee." });
  }
});

export default router;
