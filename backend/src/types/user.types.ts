import { UserRole, UserStatus } from "./auth.types.js";

// User shape returned by the admin user endpoints. Never includes password_hash.
export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}
