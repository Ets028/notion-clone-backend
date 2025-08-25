// src/index.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';

// Import router
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
import tagRoutes from './routes/tag.routes.js';

// Import middleware error
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

const PgStore = connectPgSimple(session);
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

//cek koneksi database
pool.on('connect', () => {
  console.log('Database connected');
});

// Middleware
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(session({
  store: new PgStore({
    pool: pool,
    tableName: 'user_sessions',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'your-default-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}));

app.use("/api", (req, res) => {
  res.send("notion clone api v1 running");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tags', tagRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

