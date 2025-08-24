// src/controllers/note.controller.js
import * as noteService from "../services/note.service.js";
import prisma from "../config/db.js";

/**
 * Mengarsipkan sebuah catatan (sebelumnya deleteNote).
 */
export const archiveNote = async (req, res) => {
  const { id } = req.params;
  const authorId = req.session.userId;

  const note = await noteService.findNoteById(id);
  if (!note || note.authorId !== authorId) {
    return res
      .status(404)
      .json({
        message: "Note not found or you do not have permission to archive it.",
      });
  }

  await noteService.archiveNoteInDb(id);
  res.status(200).json({ message: "Note archived successfully." });
};

/**
 * Controller BARU untuk mendapatkan semua catatan yang diarsip.
 */
export const getArchivedNotes = async (req, res) => {
  const authorId = req.session.userId;
  const notes = await noteService.findArchivedNotesByAuthor(authorId);
  res.status(200).json(notes);
};

/**
 * Controller BARU untuk mengembalikan catatan dari arsip.
 */
export const restoreNote = async (req, res) => {
  const { id } = req.params;
  const authorId = req.session.userId;

  const note = await noteService.findNoteById(id);
  if (!note || note.authorId !== authorId) {
    return res
      .status(404)
      .json({
        message: "Note not found or you do not have permission to restore it.",
      });
  }

  const restoredNote = await noteService.restoreNoteInDb(id);
  res.status(200).json(restoredNote);
};

/**
 * Controller BARU untuk menghapus catatan secara permanen.
 */
export const deleteNotePermanently = async (req, res) => {
  const { id } = req.params;
  const authorId = req.session.userId;

  const note = await noteService.findNoteById(id);
  if (!note || note.authorId !== authorId) {
    return res
      .status(404)
      .json({
        message: "Note not found or you do not have permission to delete it.",
      });
  }

  await noteService.permanentlyDeleteNoteFromDb(id);
  res.status(204).send();
};

export const createNote = async (req, res) => {
  const { title, content, isFavorite, status, parentId } = req.body;
  const authorId = req.session.userId;

  // Jika ada parentId, verifikasi bahwa parent tersebut ada dan milik user
  if (parentId) {
    const parentNote = await noteService.findNoteById(parentId);
    if (!parentNote || parentNote.authorId !== authorId) {
      return res.status(404).json({
        message:
          "Parent note tidak ditemukan, atau Anda tidak memiliki izin untuk mengaksesnya",
      });
    }
  }

  const newNote = await noteService.createNoteInDb(
    { title, content, isFavorite, status, parentId },
    authorId
  );
  res.status(201).json(newNote);
};

/**
 * Mengambil semua catatan level atas (untuk sidebar)
 */
export const getNotes = async (req, res) => {
  const authorId = req.session.userId;
  
  // Mengumpulkan filter dari query string dengan cara yang lebih rapi
  const { status, priority, tags } = req.query;
  const filters = {
    status,
    priority,
    tagIds: tags ? String(tags).split(',') : undefined,
  };
  
  const notes = await noteService.findTopLevelNotesByAuthor(authorId, filters);
  res.status(200).json(notes);
};

/**
 * Mengambil satu catatan beserta anak-anaknya
 */
export const getNoteById = async (req, res) => {
  const { id } = req.params;
  const authorId = req.session.userId;

  const note = await noteService.findNoteWithChildren(id, authorId);

  if (!note) {
    // findNoteWithChildren sudah termasuk cek authorId
    return res.status(404).json({
      message:
        "Note tidak ditemukan, atau Anda tidak memiliki izin untuk mengaksesnya",
    });
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  // Ambil semua data yang mungkin ada dari body request
  const dataToUpdate = req.body;
  const authorId = req.session.userId;

  // Verifikasi bahwa catatan yang akan diupdate itu ada dan milik pengguna
  const note = await noteService.findNoteById(id);
  if (!note || note.authorId !== authorId) {
    return res.status(404).json({
      message:
        "Catatan tidak ditemukan, atau Anda tidak memiliki izin untuk mengaksesnya",
    });
  }

  // Jika ada parentId baru, verifikasi bahwa parent tersebut valid
  if (dataToUpdate.parentId) {
    const parentNote = await noteService.findNoteById(dataToUpdate.parentId);
    if (!parentNote || parentNote.authorId !== authorId) {
      return res.status(404).json({ message: "Induk catatan tidak ditemukan" });
    }
  }

  try {
    const updatedNote = await noteService.updateNoteInDb(id, dataToUpdate);
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Gagal memperbarui catatan" });
  }
};

// ... (deleteNote dan updateNotePositions tetap sama) ...
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const authorId = req.session.userId;
  const note = await noteService.findNoteById(id);
  if (!note || note.authorId !== authorId) {
    return res.status(404).json({
      message:
        "Note tidak ditemukan, atau Anda tidak memiliki izin untuk menghapusnya",
    });
  }
  await noteService.deleteNoteFromDb(id);
  res.status(204).send();
};

export const updateNotePositions = async (req, res) => {
  const { notes } = req.body;
  const authorId = req.session.userId;
  const noteIds = notes.map((n) => n.id);
  const userNotes = await prisma.note.findMany({
    where: { id: { in: noteIds }, authorId: authorId },
    select: { id: true },
  });
  if (userNotes.length !== noteIds.length) {
    return res
      .status(403)
      .json({
        message:
          "Forbidden: Kamu tidak memiliki izin untuk mengubah posisi ini",
      });
  }
  await noteService.updateNotePositionsInDb(notes);
  res.status(200).json({ message: "Posisi catatan berhasil diperbarui" });
};
