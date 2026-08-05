// Raw row from the cart_items table
export interface CartItem {
  id: number;
  user_id: string;
  course_id: number;
  created_at: string;
}

// Cart item joined with course details (shape returned by GET /api/cart)
export interface CartItemWithCourse extends CartItem {
  title: string;
  image: string | null;
  short_description: string | null;
  price: string; // DECIMAL comes back as a string from pg
  previous_price: string | null;
  discounted_price: string | null;
  learners_enrolled: number;
}
