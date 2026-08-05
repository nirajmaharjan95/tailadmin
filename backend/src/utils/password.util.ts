import bcrypt from "bcryptjs";

// Cost factor 12 keeps hashing slow enough to resist brute force while
// remaining fast enough for interactive login.
const SALT_ROUNDS = 12;

export const hashPassword = (plainPassword: string): Promise<string> =>
  bcrypt.hash(plainPassword, SALT_ROUNDS);

export const verifyPassword = (
  plainPassword: string,
  passwordHash: string
): Promise<boolean> => bcrypt.compare(plainPassword, passwordHash);
