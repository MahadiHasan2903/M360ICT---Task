import express from "express";
import * as authorsController from "../controllers/authorsController";
import { validateAuthor } from "../middlewares/validators";

const router = express.Router();

router.get("/", authorsController.getAllAuthors);
router.get("/:id", authorsController.getAuthorById);
router.post("/", validateAuthor, authorsController.createAuthor);
router.put("/:id", validateAuthor, authorsController.updateAuthor);
router.delete("/:id", authorsController.deleteAuthor);

export default router;
