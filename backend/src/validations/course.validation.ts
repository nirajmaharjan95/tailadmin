import { z } from "zod";
import { COURSE_TAGS } from "../types/course.types.js";

const courseTagsValues = Object.values(COURSE_TAGS) as [string, ...string[]];

export const courseSchema = z.object(
    {
        courseTitle: z.string().min(1, "Course title is required").max(200),
        courseDescription: z.string().max(2000).optional(),
        coursePrice: z.number().min(0, "Course price must be a positive number"),
        courseDiscountPrice: z.number().min(0, "Course discount price must be a positive number").optional(),
        coursePreviousPrice: z.number().min(0, "Course previous price must be a positive number").optional(),
        courseImage: z.string().url("Invalid URL format").optional(),
        courseEnrolledLearners: z.number().min(0, "Number of enrolled learners must be a positive number").optional(),
        courseTags: z.enum(courseTagsValues).optional(),
    }
);

export type CourseInput = z.infer<typeof courseSchema>;
