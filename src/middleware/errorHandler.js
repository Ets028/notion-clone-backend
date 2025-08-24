import { ZodError } from "zod";

/**
 * Middleware penanganan error terpusat.
 * Ini akan menangkap semua error yang dilempar oleh aplikasi.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err); // Log error untuk debugging

  // Jika error berasal dari validasi Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Gagal melakukan validasi",
      errors: err.errors.map((e) => ({
        path: e.path.join("."),
        errors: err.issues.map(e => ({ path: e.path.join('.'), message: e.message }))
      })),
    });
  }

  // Error umum atau tidak terduga
  res.status(500).json({
    message: "Terjadi kesalahan pada server",
    error: err.message, // Di lingkungan produksi, Anda mungkin ingin menyembunyikan detail error
  });
};
