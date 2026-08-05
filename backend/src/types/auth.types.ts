export type UserRole = "user" | "admin";

export type UserStatus = "ACTIVE" | "DISABLED" | "LOCKED";

// Raw row from the users table
export interface UserRecord {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

// User shape safe to return through the API (never includes password_hash)
export interface PublicUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

// Verified JWT claims attached to authenticated requests
export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
  jti: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

// Identity derived from a verified access token (req.user)
export interface AuthenticatedUser {
  id: number;
  role: UserRole;
}

// Raw row from the refresh_tokens table
export interface RefreshTokenRecord {
  jti: string;
  user_id: number;
  token_hash: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}
