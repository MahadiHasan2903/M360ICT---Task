import { Request, Response } from "express";
import db from "../config/db";
import { Book } from "../models/book";
import { ErrorResponse, SuccessResponse } from "../types/response.types";
import { validationResult } from "express-validator";

// GET /books
export const getAllBooks = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit as string) || 10; // Default to 10 books per page
  const filter = (req.query.filter as string) || ""; // Get filter query parameter or default to empty string

  const offset = (page - 1) * limit;
  let totalCountQuery, booksQuery;

  try {
    // Construct the base query
    let baseQuery = "SELECT * FROM books";

    // Construct the count query without filters
    totalCountQuery = await db.query(
      "SELECT COUNT(*) as total_count FROM books"
    );
    const totalCount = parseInt(totalCountQuery.rows[0].total_count, 10);

    // Check if filter parameter is provided
    if (filter) {
      baseQuery += ` WHERE LOWER(title) LIKE LOWER($1)`;
      booksQuery = await db.query(
        `${baseQuery} ORDER BY id LIMIT $2 OFFSET $3`,
        [`%${filter}%`, limit, offset]
      );
    } else {
      booksQuery = await db.query(
        `${baseQuery} ORDER BY id LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
    }

    const books = booksQuery.rows;

    const response = {
      message: "Books retrieved successfully",
      success: true,
      data: books,
      pagination: {
        total: totalCount,
        page: page,
        pages: Math.ceil(totalCount / limit),
      },
    };

    res.json(response);
  } catch (error: any) {
    const err = { success: false, message: error.message };
    res.status(500).json(err);
  }
};

// GET /books/:id
export const getBookById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const book = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    if (book.rows.length > 0) {
      const response: SuccessResponse<Book> = {
        message: "Book retrieved successfully",
        success: true,
        data: book.rows[0],
      };
      res.json(response);
    } else {
      res.status(404).json({ success: false, message: "Book not found" });
    }
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};

// POST /books
export const createBook = async (req: Request, res: Response) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, description, published_date, author_id } = req.body;
  const newBook: Book = { title, description, published_date, author_id };

  try {
    const result = await db.query(
      "INSERT INTO books(title, description, published_date, author_id) VALUES($1, $2, $3, $4) RETURNING *",
      [title, description, published_date, author_id]
    );
    const response: SuccessResponse<Book> = {
      message: "Book created successfully",
      success: true,
      data: result.rows[0],
    };
    res.status(201).json(response);
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};

// PUT /books/:id
export const updateBook = async (req: Request, res: Response) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const id = parseInt(req.params.id);
  const { title, description, published_date, author_id } = req.body;
  const updatedBook: Book = { title, description, published_date, author_id };

  try {
    const result = await db.query(
      "UPDATE books SET title = $1, description = $2, published_date = $3, author_id = $4 WHERE id = $5 RETURNING *",
      [title, description, published_date, author_id, id]
    );
    if (result.rows.length > 0) {
      const response: SuccessResponse<Book> = {
        message: "Book updated successfully",
        success: true,
        data: result.rows[0],
      };
      res.json(response);
    } else {
      res.status(404).json({ success: false, message: "Book not found" });
    }
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};

// DELETE /books/:id
export const deleteBook = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const result = await db.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length > 0) {
      const response: SuccessResponse<any> = {
        message: "Book deleted successfully",
        success: true,
        data: {},
      };
      res.json(response);
    } else {
      res.status(404).json({ success: false, message: "Book not found" });
    }
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};
