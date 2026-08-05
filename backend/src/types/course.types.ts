import type { CourseInput } from "../validations/course.validation.js";

export const COURSE_TAGS = {
    WRITING: 'Writing',
    DESIGN: 'Design',
    DEVELOPMENT: 'Development',
    EDITOR_CHOICE: 'Editor Choice',
    TOP_TRAINER: 'Top Trainer',
}

export interface Course extends CourseInput {
    id: number;
    createdAt: string;
    updatedAt: string;
}
