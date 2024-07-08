import { body } from "express-validator";

// Validation middleware for name and birthdate fields
export const validateAuthor = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("birthdate").isDate().withMessage("Invalid birthdate format"),
];

// Validation middleware for book creation or update
export const validateBook = [
  body("title").notEmpty().withMessage("Title cannot be empty"),
  body("published_date").isDate().withMessage("Invalid published date format"),
  body("author_id").isInt({ min: 1 }).withMessage("Invalid author ID"),
];
