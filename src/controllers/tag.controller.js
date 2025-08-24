import * as tagService from '../services/tag.service.js';
import prisma from '../config/db.js';

export const createTag = async (req, res) => {
  const { name, color } = req.body;
  const userId = req.session.userId;
  
  const existingTag = await prisma.tag.findUnique({
    where: { userId_name: { userId, name } },
  });
  if (existingTag) {
    return res.status(409).json({ message: 'Tag dengan nama tersebut sudah ada' });
  }

  const tag = await tagService.createTag(name, color, userId);
  res.status(201).json(tag);
};

export const getTags = async (req, res) => {
  const userId = req.session.userId;
  const tags = await tagService.findTagsByUser(userId);
  res.status(200).json(tags);
};

export const updateTag = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  
  const tag = await tagService.findTagById(id);
  if (!tag || tag.userId !== userId) {
    return res.status(404).json({ message: 'Tag tidak ditemukan' });
  }

  const updatedTag = await tagService.updateTagById(id, req.body);
  res.status(200).json(updatedTag);
};

export const deleteTag = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  const tag = await tagService.findTagById(id);
  if (!tag || tag.userId !== userId) {
    return res.status(404).json({ message: 'Tag tidak ditemukan' });
  }

  await tagService.deleteTagById(id);
  res.status(204).send();
};