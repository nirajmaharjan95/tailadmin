import * as courseRepository from "../repositories/course.repository.js";
import { Course } from "../types/course.types.js";
import { CourseInput } from "../validations/course.validation.js";

const SORT_OPTIONS: Record<string, { column: string; direction: "ASC" | "DESC" }> = {
  name: {
    column: "title",
    direction: "ASC",
  },
  date: {
    column: "created_at",
    direction: "DESC",
  },
  popularity: {
    column: "learners_enrolled",
    direction: "DESC",
  },
};

export const getAllCourses = async (
  limit: number,
  offset: number,
  sort = "title",
  search = ""
): Promise<{ data: Course[]; total: number }> => {
  const sortOption = SORT_OPTIONS[sort] ?? SORT_OPTIONS.name;
  const pattern = `%${search}%`;
  const [dataResult, totalResult] = await Promise.all([
    courseRepository.findAll(limit, offset, sortOption.column, sortOption.direction, pattern),
    courseRepository.countAll(pattern),
  ]);

  return {
    data: dataResult.rows,
    total: totalResult,
  };
};

export const getCourseById = (id: number): Promise<Course | null> => courseRepository.findById(id);

export const createCourse = (data: CourseInput): Promise<Course> => courseRepository.insert(data);

export const updateCourse = (id: number, data: CourseInput): Promise<Course | null> =>
  courseRepository.update(id, data);

export const deleteCourse = (id: number): Promise<boolean> => courseRepository.remove(id);
