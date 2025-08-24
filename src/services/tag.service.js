// src/services/tag.service.js
import prisma from "../config/db.js";

export const createTag = (name, color, userId) =>
  prisma.tag.create({ data: { name, color, userId } });
export const findTagsByUser = (userId) =>
  prisma.tag.findMany({ where: { userId }, orderBy: { name: "asc" } });
export const findTagById = (id) => prisma.tag.findUnique({ where: { id } });
export const updateTagById = (id, data) =>
  prisma.tag.update({ where: { id }, data });
export const deleteTagById = (id) => prisma.tag.delete({ where: { id } });
