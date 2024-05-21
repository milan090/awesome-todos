import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../models/user.model";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    // create user
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const { hashedPassword: _h, ...user } = await createUser(
      email,
      hashedPassword
    );
    return res.status(201).json(user);
  }
  return res.status(400).json({ message: "User already exists" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    // Return as such to not give away if the user exists to hackers
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.session.userId = user.id;
  return res.status(200).json({
    id: user.id,
    email: user.email,
  });
};

export const logout = async (req: Request, res: Response) => {
  return req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.clearCookie("sid");
    return res.status(200).json({ message: "Logged out" });
  });
};
