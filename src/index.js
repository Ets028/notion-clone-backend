import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import noteRoutes from "./routes/note.routes.js";
import tagRoutes from './routes/tag.routes.js';

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: '*',
  credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Notion Clone API!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use('/api/tags', tagRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
