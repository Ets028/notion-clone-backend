// src/middleware/validateRequest.js

/**
 * Middleware untuk memvalidasi request body, params, atau query
 * berdasarkan skema Zod yang diberikan.
 * @param {z.AnyZodObject} schema - Skema Zod untuk validasi.
 */
export const validateRequest = (schema) => (req, res, next) => {
  // `parse` akan melempar error jika validasi gagal,
  // yang akan ditangkap oleh errorHandler terpusat kita.
  schema.parse({
    body: req.body,
    query: req.query,
    params: req.params,
  });
  next();
};
