import express from "express";
import * as authorBooksController from "../controllers/authorBooksController";
import { authenticateTokenAndRole } from "../middlewares/authentication";

const router = express.Router();

// GET /api/v1/query/authors/:id/books - Only allow access to users with "admin" role
router.get(
  "/authors/:id/books",
  authenticateTokenAndRole(["admin"]),
  authorBooksController.getBooksByAuthorId
);

// GET /api/v1/query/books/author/:id - Allow access to users with "user" or "admin" roles
router.get(
  "/books/author/:id",
  authenticateTokenAndRole(["user", "admin"]),
  authorBooksController.getBooksByAuthorIdAlt
);

export default router;
