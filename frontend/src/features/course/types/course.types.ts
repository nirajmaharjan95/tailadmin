export interface CoursePayload {
  courseTitle: string;
  courseDescription?: string;
  coursePrice: number;
  courseDiscountPrice?: number;
  coursePreviousPrice?: number;
  courseImage?: string;
  courseEnrolledLearners?: number;
  courseTags?: string;
}

export interface ICourse {
  id?: number;
  title: string;
  image?: string;
  short_description?: string;
  price: number | string;
  previous_price?: number | string | null;
  discounted_price?: number | string | null;
  wishlist?: number;
  cart?: number;
  learners_enrolled?: number;
  created_at?: string;
  updated_at?: string;
}
