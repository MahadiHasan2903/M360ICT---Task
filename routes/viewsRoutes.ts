import express from "express";
import * as viewsController from "../controllers/viewsController";

const router = express.Router();

// GET /authors-with-books
router.get("/authors-with-books", viewsController.getAllAuthorsWithBooks);

// GET /authors/:id/with-books
router.get("/authors/:id/with-books", viewsController.getAuthorWithBooks);

// GET /books/:id/with-author
router.get("/books/:id/with-author", viewsController.getBookWithAuthor);

export default router;
