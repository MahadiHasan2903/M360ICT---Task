import { Request, Response } from "express";
import { createUser, getUserByEmail, validatePassword } from "../models/auth";
import jwt from "jsonwebtoken";

// User registration
export async function registrationController(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    // Check if password meets minimum length requirement
    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        message: "Password should be at least 6 characters long",
        data: {},
      });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
        data: {},
      });
    }

    const user = await createUser({
      name,
      email,
      password,
    });

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      data: {},
    });
  }
}

//User login
export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "User Not found", data: {} });
    }
    if (!(await validatePassword(email, password))) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials", data: {} });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    console.log(token);
    res.json({
      status: true,
      message: "Login successful",
      data: { id: user.id, name: user.name, role: user.role, token: token },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Internal server error", data: {} });
  }
}

//User logout
export function logoutController(req: Request, res: Response) {
  res.json({ status: true, message: "Logged out successfully", data: {} });
}
