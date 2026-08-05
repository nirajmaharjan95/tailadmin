// Shape returned by GET /api/cart (cart_items joined with course details).
export interface CartItem {
  id: number; // cart item id
  user_id: string; // authenticated user id (JWT sub)
  course_id: number;
  created_at: string;
  title: string;
  image: string | null;
  short_description: string | null;
  price: string;
  previous_price: string | null;
  discounted_price: string | null;
  learners_enrolled: number;
}

export interface CartListResponse {
  data: CartItem[];
  total: number;
}

// POST /api/cart returns the created row (201) or { message } when already present (200).
export interface AddCartResponse {
  id?: number;
  user_id?: string;
  course_id?: number;
  created_at?: string;
  message?: string;
}
