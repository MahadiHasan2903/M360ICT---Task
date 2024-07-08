import express from "express";
import * as booksController from "../controllers/booksController";
import { validateBook } from "../middlewares/validators";

const router = express.Router();

router.get("/", booksController.getAllBooks);
router.get("/:id", booksController.getBookById);
router.post("/", validateBook, booksController.createBook);
router.put("/:id", validateBook, booksController.updateBook);
router.delete("/:id", booksController.deleteBook);

export default router;
