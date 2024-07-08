import express from "express";
import * as authorBooksController from "../controllers/authorBooksController";

const router = express.Router();

// GET /api/v1/query/authors/:id/books
router.get("/authors/:id/books", authorBooksController.getBooksByAuthorId);

// GET /api/v1/query/books/author/:id
router.get("/books/author/:id", authorBooksController.getBooksByAuthorIdAlt);

export default router;
