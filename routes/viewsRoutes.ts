import express from "express";
import * as viewsController from "../controllers/viewsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// GET /authors-with-books
router.get(
  "/authors-with-books",
  authMiddleware(["admin"]),
  viewsController.getAllAuthorsWithBooks
);

// GET /authors/:id/with-books
router.get(
  "/authors/:id/with-books",
  authMiddleware(["admin"]),
  viewsController.getAuthorWithBooks
);

// GET /books/:id/with-author
router.get(
  "/books/:id/with-author",
  authMiddleware(["admin"]),

  viewsController.getBookWithAuthor
);

export default router;
