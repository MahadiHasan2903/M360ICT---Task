import { Request, Response } from "express";
import db from "../config/db";
import { ErrorResponse, SuccessResponse } from "../types/response.types";

//A list of authors along with their respective books.
export const getAllAuthorsWithBooks = async (req: Request, res: Response) => {
  try {
    const authors = await db.query(`
      SELECT a.id AS author_id, a.name AS author_name, a.bio AS author_bio, 
             b.id AS book_id, b.title AS book_title, b.description AS book_description, b.published_date AS book_published_date
      FROM authors a
      LEFT JOIN books b ON a.id = b.author_id
      ORDER BY a.id, b.published_date DESC
    `);

    // Format data to group books by author
    const authorsWithBooks = authors.rows.reduce((acc: any[], row: any) => {
      let authorIndex = acc.findIndex(
        (author) => author.author_id === row.author_id
      );
      if (authorIndex === -1) {
        acc.push({
          author_id: row.author_id,
          author_name: row.author_name,
          author_bio: row.author_bio,
          books: [],
        });
        authorIndex = acc.length - 1;
      }
      if (row.book_id) {
        acc[authorIndex].books.push({
          book_id: row.book_id,
          book_title: row.book_title,
          book_description: row.book_description,
          book_published_date: row.book_published_date,
        });
      }
      return acc;
    }, []);

    const response: SuccessResponse<any[]> = {
      message: "Authors with books retrieved successfully",
      success: true,
      data: authorsWithBooks,
    };
    res.json(response);
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};

//A detailed view of an author with a list of their books.
export const getAuthorWithBooks = async (req: Request, res: Response) => {
  const authorId = parseInt(req.params.id);

  try {
    const author = await db.query(
      `
        SELECT a.id AS author_id, a.name AS author_name, a.bio AS author_bio,
               b.id AS book_id, b.title AS book_title, b.description AS book_description, b.published_date AS book_published_date
        FROM authors a
        LEFT JOIN books b ON a.id = b.author_id
        WHERE a.id = $1
        ORDER BY b.published_date DESC
      `,
      [authorId]
    );

    if (author.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }

    const authorWithBooks = {
      author_id: author.rows[0].author_id,
      author_name: author.rows[0].author_name,
      author_bio: author.rows[0].author_bio,
      books: author.rows.map((row: any) => ({
        book_id: row.book_id,
        book_title: row.book_title,
        book_description: row.book_description,
        book_published_date: row.book_published_date,
      })),
    };

    const response: SuccessResponse<any> = {
      message: "Author with books retrieved successfully",
      success: true,
      data: authorWithBooks,
    };
    res.json(response);
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};

//A detailed view of a book with author information.
export const getBookWithAuthor = async (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id);

  try {
    const book = await db.query(
      `
        SELECT b.id AS book_id, b.title AS book_title, b.description AS book_description, b.published_date AS book_published_date,
               a.id AS author_id, a.name AS author_name, a.bio AS author_bio
        FROM books b
        LEFT JOIN authors a ON b.author_id = a.id
        WHERE b.id = $1
      `,
      [bookId]
    );

    if (book.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    const bookWithAuthor = {
      book_id: book.rows[0].book_id,
      book_title: book.rows[0].book_title,
      book_description: book.rows[0].book_description,
      book_published_date: book.rows[0].book_published_date,
      author: {
        author_id: book.rows[0].author_id,
        author_name: book.rows[0].author_name,
        author_bio: book.rows[0].author_bio,
      },
    };

    const response: SuccessResponse<any> = {
      message: "Book with author information retrieved successfully",
      success: true,
      data: bookWithAuthor,
    };
    res.json(response);
  } catch (error: any) {
    const err: ErrorResponse = { success: false, message: error.message };
    res.status(500).json(err);
  }
};
