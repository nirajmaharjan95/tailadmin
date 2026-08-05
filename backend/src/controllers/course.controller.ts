import { Request, Response } from "express";
import * as courseService from "../services/course.service.js";
import { courseSchema } from "../validations/course.validation.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// parse() → Throws an exception if validation fails.
// safeParse() → Never throws.Returns a result object.

export const getAll = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const sort = req.query.sort as string;
    const search = String(req.query.search || "");

    const result = await courseService.getAllCourses(limit, offset, sort, search);
    res.json({ data: result.data, total: result.total });
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const course = await courseService.getCourseById(Number(req.params.id));

    if (!course) {
      res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    console.error("Failed to fetch course by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const create = async (req: Request, res: Response) => {
  const parsed = courseSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues });
    return;
  }
  try {
    const course = await courseService.createCourse(parsed.data);
    res.status(201).json(course);
  } catch (error) {
    console.error("Failed to create Course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req: Request, res: Response) => {
  const parsed = courseSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues });
    return;
  }
  try {
    const course = await courseService.updateCourse(Number(req.params.id), parsed.data);
    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }
    res.json(course);
  } catch (error) {
    console.error("Failed to update Course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const deleted = await courseService.deleteCourse(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Course not found" });
      return;
    }
    res.json({ message: "Course deleted successfully." });
  } catch (error) {
    console.error("Failed to delete Course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
