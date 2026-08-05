import { del, get, post, put } from "../../../api/client";
import { CoursePayload, ICourse } from "../types/course.types";

export const getCourses = (params?: {
  limit?: number;
  offset?: number;
  search?: string;
  sort?: string;
}) => get<{ data: ICourse[]; total: number }>("/courses", params);

export const createCourse = (body: CoursePayload) => {
  return post<ICourse>("/courses", body);
};

export const updateCourse = (id: number, body: CoursePayload) => {
  return put<ICourse>(`/courses/${id}`, body);
};

export const deleteCourse = (id: number) => {
  return del<ICourse>(`/courses/${id}`);
};
