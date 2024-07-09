import express from "express";
import * as viewsController from "../controllers/viewsController";
import { authenticateTokenAndRole } from "../middlewares/authentication";

const router = express.Router();

// GET /authors-with-books
router.get(
  "/authors-with-books",
  authenticateTokenAndRole(["admin"]),
  viewsController.getAllAuthorsWithBooks
);

// GET /authors/:id/with-books
router.get(
  "/authors/:id/with-books",
  authenticateTokenAndRole(["admin"]),
  viewsController.getAuthorWithBooks
);

// GET /books/:id/with-author
router.get(
  "/books/:id/with-author",
  authenticateTokenAndRole(["admin"]),

  viewsController.getBookWithAuthor
);

export default router;
