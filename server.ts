import express, { Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import "colors";
import authorsRouter from "./routes/authorsRoutes";
import booksRouter from "./routes/booksRoutes";
import authorBooksRouter from "./routes/authorBooksRoutes";
import viewsRoutes from "./routes/viewsRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/v1/authors", authorsRouter);
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/query", authorBooksRouter);
app.use("/api/v1/views", viewsRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world from backend server!");
});

// Server
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${port}`.bgCyan
      .white
  );
});
