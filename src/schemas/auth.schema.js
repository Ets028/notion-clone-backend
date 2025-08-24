import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string({ required_error: "Username harus diisi" })
      .min(3, "Username minimal harus 3 karakter"),
    email: z
      .string({ required_error: "Email harus diisi" })
      .email("Email tidak valid"),
    password: z
      .string({ required_error: "Password harus diisi" })
      .min(6, "Password minimal harus 6 karakter"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email harus diisi" })
      .email("Email tidak valid"),
    password: z.string({ required_error: "Password harus diisi" }),
  }),
});
