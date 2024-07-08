import { Request, Response } from "express";
import db from "../config/db";
import { Book } from "../models/book";
import { ErrorResponse, SuccessResponse } from "../types/response.types";

// GET /authors/:id/books
export const getBooksByAuthorId = async (req: Request, res: Response) => {
  console.log("Triggered");
  const authorId = parseInt(req.params.id);
  try {
    const queryResult = await db.query(
      "SELECT * FROM books WHERE author_id = $1",
      [authorId]
    );
    const books: Book[] = queryResult.rows;

    const response: SuccessResponse<Book[]> = {
      message: `Books written by author with ID ${authorId} retrieved successfully`,
      success: true,
      data: books,
    };

    res.json(response);
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};

// GET /books/author/:id
export const getBooksByAuthorIdAlt = async (req: Request, res: Response) => {
  const authorId = parseInt(req.params.id);
  try {
    const queryResult = await db.query(
      "SELECT * FROM books WHERE author_id = $1",
      [authorId]
    );
    const books: Book[] = queryResult.rows;

    const response: SuccessResponse<Book[]> = {
      message: `Books by author with ID ${authorId} retrieved successfully`,
      success: true,
      data: books,
    };

    res.json(response);
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};
