// src/schemas/tag.schema.js
import { z } from 'zod';

export const createTagSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Tag name cannot be empty").max(20),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").optional(),
  }),
});

export const updateTagSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(20).optional(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").optional(),
  }),
  params: z.object({
    id: z.string().cuid("Invalid tag ID"),
  }),
});
