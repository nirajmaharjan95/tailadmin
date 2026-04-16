import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import userSchema from "../models/user.model.js";
import { createUser, getUserByEmail } from "../services/user.service.js";

const register = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.issues });
    }

    const { first_name, last_name, email, password } = parsed.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Save to database
    const user = await createUser({ first_name, last_name, email, password_hash });

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    console.error("Registration error:", error);

    const pgError = error as { code?: string };
    if (pgError.code === "23505") {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
};

export { register };
