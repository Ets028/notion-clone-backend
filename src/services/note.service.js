// src/services/note.service.js
import prisma from '../config/db.js';

const buildNoteFilter = (authorId, filters = {}) => {
  const { status, priority, tagIds } = filters;
  
  const whereClause = {
    authorId,
    parentId: null,
    isArchived: false,
  };

  if (status) {
    whereClause.status = status;
  }
  if (priority) {
    whereClause.priority = priority;
  }
  if (tagIds && tagIds.length > 0) {
    whereClause.tags = { some: { id: { in: tagIds } } };
  }

  return whereClause;
};


export const findTopLevelNotesByAuthor = (authorId, filters) => {
  const where = buildNoteFilter(authorId, filters);

  return prisma.note.findMany({
    where,
    orderBy: { position: 'asc' },
    include: { tags: true },
  });
};


export const updateNoteInDb = (id, data) => {
  const { tags, ...noteData } = data;

  const updatePayload = {
    ...noteData,
  };

  if (Array.isArray(tags)) {
    updatePayload.tags = {
      set: tags.map(tagId => ({ id: tagId })),
    };
  }

  return prisma.note.update({
    where: { id },
    data: updatePayload,
    include: { tags: true }, 
  });
};

export const createNoteInDb = async (noteData, authorId) => {
  const { title, content, isFavorite, status, parentId } = noteData;

  // Hitung posisi relatif terhadap saudaranya (notes dengan parentId yang sama)
  const siblingCount = await prisma.note.count({
    where: { authorId, parentId }, // parentId bisa null (untuk root) atau string
  });

  return prisma.note.create({
    data: {
      title,
      content,
      authorId,
      parentId,
      position: siblingCount,
      isFavorite,
      status,
    },
  });
};


export const findNoteWithChildren = (id, authorId) => {
  return prisma.note.findFirst({
    where: { id, authorId, isArchived: false },
    include: {
      children: {
        where: { isArchived: false },
        orderBy: { position: 'asc' },
        include: { tags: true },
      },
      tags: true,
    },
  });
};

export const findArchivedNotesByAuthor = (authorId) => {
  return prisma.note.findMany({
    where: {
      authorId,
      isArchived: true, // <-- Hanya ambil yang diarsip
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
};

export const archiveNoteInDb = (id) => {
  return prisma.note.update({
    where: { id },
    data: { isArchived: true },
  });
};


export const restoreNoteInDb = (id) => {
  return prisma.note.update({
    where: { id },
    data: { isArchived: false },
  });
};


export const permanentlyDeleteNoteFromDb = (id) => {
  return prisma.note.delete({ where: { id } });
};

export const findNoteById = (id) => prisma.note.findUnique({ where: { id } });
export const updateNotePositionsInDb = (notes) => {
  const updatePromises = notes.map(note =>
    prisma.note.update({
      where: { id: note.id },
      data: { position: note.position },
    })
  );
  return prisma.$transaction(updatePromises);
};
