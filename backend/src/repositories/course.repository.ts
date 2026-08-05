import pool from "../config/db.js";
import { Course } from "../types/course.types.js";
import { CourseInput } from "../validations/course.validation.js";

export const findAll = (
  limit: number,
  offset: number,
  sortColumn: string,
  sortDirection: "ASC" | "DESC",
  pattern: string
) =>
  pool.query(
    `SELECT * FROM course WHERE title ILIKE $3 ORDER BY ${sortColumn} ${sortDirection}, id DESC LIMIT $1 OFFSET $2`,
    [limit, offset, pattern]
  );

export const countAll = async (pattern: string): Promise<number> => {
  const result = await pool.query(`SELECT COUNT(*)::int AS count FROM course WHERE title ILIKE $1`, [pattern]);
  return Number(result.rows[0]?.count ?? 0);
};

export const countAllRows = async (): Promise<number> => {
  const result = await pool.query(`SELECT COUNT(*)::int AS count FROM course`);
  return Number(result.rows[0]?.count ?? 0);
};

export const findById = async (id: number): Promise<Course | null> => {
  const result = await pool.query("SELECT * FROM course WHERE id = $1", [id]);
  return result.rows[0] ?? null;
};

export const insert = async (data: CourseInput): Promise<Course> => {
  const {
    courseTitle,
    courseDescription,
    coursePrice,
    courseDiscountPrice,
    coursePreviousPrice,
    courseImage,
    courseEnrolledLearners,
    courseTags,
  } = data;
  const result = await pool.query(
    `INSERT INTO course (course_title, course_description, course_price, course_discount_price, course_previous_price, course_image, course_enrolled_learners, course_tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      courseTitle,
      courseDescription ?? null,
      coursePrice,
      courseDiscountPrice ?? null,
      coursePreviousPrice ?? null,
      courseImage ?? null,
      courseEnrolledLearners ?? 0,
      courseTags ?? null,
    ]
  );
  return result.rows[0];
};

export const update = async (id: number, data: CourseInput): Promise<Course | null> => {
  const {
    courseTitle,
    courseDescription,
    coursePrice,
    courseDiscountPrice,
    coursePreviousPrice,
    courseImage,
    courseEnrolledLearners,
    courseTags,
  } = data;
  const result = await pool.query(
    `UPDATE course
         SET course_title=$1, course_description=$2, course_price=$3, course_discount_price=$4, course_previous_price=$5, course_image=$6, course_enrolled_learners=$7, course_tags=$8, updated_at=NOW()
         WHERE id=$9 RETURNING *`,
    [
      courseTitle,
      courseDescription ?? null,
      coursePrice,
      courseDiscountPrice ?? null,
      coursePreviousPrice ?? null,
      courseImage ?? null,
      courseEnrolledLearners ?? 0,
      courseTags ?? null,
      id,
    ]
  );
  return result.rows[0] ?? null;
};

export const remove = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM course WHERE id=$1 RETURNING *", [id]);
  return result.rows.length > 0;
};
