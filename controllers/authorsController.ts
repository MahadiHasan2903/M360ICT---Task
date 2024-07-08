import { ErrorResponse, SuccessResponse } from "../types/response.types";
import { Request, Response } from "express";
import db from "../config/db";
import { Author } from "../models/author";
import { validationResult } from "express-validator";

// GET /authors
export const getAllAuthors = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit as string) || 10; // Default to 10 authors per page
  const filter = (req.query.filter as string) || ""; // Get filter query parameter or default to empty string

  const offset = (page - 1) * limit;
  let totalCountQuery, authorsQuery;

  try {
    // Construct the base query
    let baseQuery = "SELECT * FROM authors";

    // Construct the count query without filters
    totalCountQuery = await db.query(
      "SELECT COUNT(*) as total_count FROM authors"
    );
    const totalCount = parseInt(totalCountQuery.rows[0].total_count, 10);

    // Check if filter parameter is provided
    if (filter) {
      baseQuery += ` WHERE LOWER(name) LIKE LOWER($1)`;
      authorsQuery = await db.query(
        `${baseQuery} ORDER BY id LIMIT $2 OFFSET $3`,
        [`%${filter}%`, limit, offset]
      );
    } else {
      authorsQuery = await db.query(
        `${baseQuery} ORDER BY id LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
    }

    const authors = authorsQuery.rows;

    const response = {
      message: "Authors retrieved successfully",
      success: true,
      data: authors,
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

// GET /authors/:id
export const getAuthorById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const author = await db.query("SELECT * FROM authors WHERE id = $1", [id]);
    if (author.rows.length > 0) {
      const response: SuccessResponse<Author> = {
        message: "Author retrieved successfully",
        success: true,
        data: author.rows[0],
      };
      res.json(response);
    } else {
      res.status(404).json({ success: false, message: "Author not found" });
    }
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};

// POST /authors
export const createAuthor = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, bio, birthdate } = req.body;
  const newAuthor: Author = { name, bio, birthdate };

  try {
    const result = await db.query(
      "INSERT INTO authors(name, bio, birthdate) VALUES($1, $2, $3) RETURNING *",
      [name, bio, birthdate]
    );
    const response: SuccessResponse<Author> = {
      message: "Author created successfully",
      success: true,
      data: result.rows[0],
    };
    res.status(201).json(response);
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};

// PUT /authors/:id
export const updateAuthor = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, bio, birthdate } = req.body;
  const updatedAuthor: Author = { name, bio, birthdate };

  try {
    const result = await db.query(
      "UPDATE authors SET name = $1, bio = $2, birthdate = $3 WHERE id = $4 RETURNING *",
      [name, bio, birthdate, id]
    );
    if (result.rows.length > 0) {
      const response: SuccessResponse<Author> = {
        message: "Author updated successfully",
        success: true,
        data: result.rows[0],
      };
      res.json(response);
    } else {
      res.status(404).json({ success: false, message: "Author not found" });
    }
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};

// DELETE /authors/:id
export const deleteAuthor = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const result = await db.query(
      "DELETE FROM authors WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length > 0) {
      const response: SuccessResponse<any> = {
        message: "Author deleted successfully",
        success: true,
        data: {},
      };
      res.json(response);
    } else {
      res.status(404).json({ success: false, message: "Author not found" });
    }
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};
