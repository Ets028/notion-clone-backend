// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Fungsi helper untuk membuat konten JSON Tiptap sederhana
const createTiptapJson = (text) => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: text ? [{ type: 'text', text }] : [],
    },
  ],
});

async function main() {
  console.log('🌱 Start seeding...');

  // 1. Hapus data lama secara berurutan untuk menghindari konflik relasi
  // Hapus relasi Note-Tag terlebih dahulu (Prisma menangani ini secara implisit saat menghapus Note)
  await prisma.note.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️  Deleted existing data.');

  // 2. Buat pengguna contoh
  const hashedPassword = await bcrypt.hash('password123', 10);
  const elfrian = await prisma.user.create({
    data: {
      email: 'elfrian@example.com',
      username: 'Elfrian',
      password: hashedPassword,
    },
  });
  console.log(`👤 Created user: ${elfrian.username} (password: password123)`);

  // 3. Buat beberapa tag untuk elfrian
  const tagPenting = await prisma.tag.create({
    data: { name: 'Penting', color: '#ef4444', userId: elfrian.id },
  });
  const tagPekerjaan = await prisma.tag.create({
    data: { name: 'Pekerjaan', color: '#3b82f6', userId: elfrian.id },
  });
  const tagPribadi = await prisma.tag.create({
    data: { name: 'Pribadi', color: '#22c55e', userId: elfrian.id },
  });
  console.log('🏷️  Created sample tags.');

  // 4. Buat struktur catatan untuk elfrian dengan properti lengkap
  const workspaceNote = await prisma.note.create({
    data: {
      title: 'Workspace Utama',
      authorId: elfrian.id,
      position: 0,
      isFavorite: true,
      content: createTiptapJson('Ini adalah halaman utama untuk semua proyek.'),
      priority: 'MEDIUM',
    },
  });

  const projectPhoenix = await prisma.note.create({
    data: {
      title: '🚀 Proyek Phoenix',
      content: createTiptapJson('Membangun ulang aplikasi utama dari awal.'),
      authorId: elfrian.id,
      parentId: workspaceNote.id,
      position: 0,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2025-12-20T23:59:59Z'),
      // Hubungkan note ini dengan tag
      tags: {
        connect: [{ id: tagPenting.id }, { id: tagPekerjaan.id }],
      },
    },
  });

  await prisma.note.create({
    data: {
      title: 'Daftar Belanja',
      content: createTiptapJson('Susu, Roti, Telur.'),
      authorId: elfrian.id,
      position: 1,
      status: 'NOT_STARTED',
      priority: 'LOW',
      tags: {
        connect: [{ id: tagPribadi.id }],
      },
    },
  });

  // Buat catatan yang diarsip
  await prisma.note.create({
    data: {
      title: 'Ide Proyek Lama (Diarsip)',
      content: createTiptapJson('Ini adalah ide yang sudah tidak relevan lagi.'),
      authorId: elfrian.id,
      position: 2,
      isArchived: true, // <-- Catatan ini ada di sampah
    },
  });

  console.log('📝 Created sample notes with advanced properties.');
  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
