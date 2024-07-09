import { Pool } from "pg";
import bcrypt from "bcrypt";
import pool from "../config/db";

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: string;
}

/**
 * Creates a new user with a hashed password and stores it in the database.
 * @param user - The user object containing name, email, password, and role.
 * @returns The created user object.
 */
export async function createUser(user: User): Promise<User> {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const { name, email } = user;
  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );
  return result.rows[0];
}

/**
 * Retrieves a user from the database by their email.
 * @param email - The email of the user to retrieve.
 * @returns The user object if found, otherwise null.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0] || null;
}

/**
 * Validates the provided password against the stored hashed password for a given email.
 * @param email - The email of the user.
 * @param password - The plaintext password to validate.
 * @returns True if the password is valid, otherwise false.
 */
export async function validatePassword(
  email: string,
  password: string
): Promise<boolean> {
  const user = await getUserByEmail(email);
  if (!user) return false;
  return await bcrypt.compare(password, user.password);
}
