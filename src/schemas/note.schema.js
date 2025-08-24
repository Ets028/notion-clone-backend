// src/schemas/note.schema.js
import { z } from 'zod';

const noteStatusEnum = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'DONE']);
const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

// Skema BARU untuk memvalidasi query string pada GET /notes
export const getNotesQuerySchema = z.object({
  query: z.object({
    status: noteStatusEnum.optional(),
    priority: priorityEnum.optional(),
    // Memastikan 'tags' adalah string yang berisi CUID yang dipisahkan koma
    tags: z.string().regex(/^[a-zA-Z0-9,]+$/, "Tags must be a comma-separated list of IDs").optional(),
  }),
});

// Skema untuk membuat catatan baru
export const createNoteSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Tittle harus diisi',
    }).min(1, 'Tittle tidak boleh kosong'),
    content: z.any().optional(),
    isFavorite: z.boolean().optional(),
    status: noteStatusEnum.optional(),
    parentId: z.string().cuid('Invalid parent ID format').optional(),
  }),
});

// Skema untuk memperbarui catatan
export const updateNoteSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.any().optional(),
    isFavorite: z.boolean().optional(),
    status: noteStatusEnum.optional(),
    parentId: z.string().cuid('Invalid parent ID format').optional().nullable(),
    tags: z.array(z.string().cuid()).optional(),
  }),
  params: z.object({
    id: z.string({ required_error: 'Note ID di URL wajib ada' }),
  })
});

// Skema untuk validasi parameter ID saja
export const noteIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Note ID di URL wajib ada' }),
  }),
});

export const reorderNotesSchema = z.object({
  body: z.object({
    notes: z.array(
      z.object({
        id: z.string(),
        position: z.number().int().min(0),
      }),
      { required_error: 'Notes array wajib ada' }
    ).min(1, 'Notes array harus memiliki setidaknya satu item'),
  }),
});
