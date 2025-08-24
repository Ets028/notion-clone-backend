import prisma from '../config/db.js';
import bcrypt from 'bcrypt';

/**
 * Registrasi pengguna baru
 */
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Validasi input dasar
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, dan password harus diisi.' });
    }

    // 2. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }

    // 3. Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Buat pengguna baru di database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // 5. Kirim respons sukses (tanpa password)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'User berhasil didaftarkan', user: userWithoutPassword });

  } catch (error) {
    console.error('Terjadi kesalahan saat registrasi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

/**
 * Login pengguna
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password harus diisi' });
    }

    // 2. Cari pengguna berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email atau Password salah' });
    }

    // 3. Bandingkan password yang diberikan dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau Password salah' });
    }

    req.session.userId = user.id;

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ message: 'Login berhasil', user: userWithoutPassword });

  } catch (error) {
    console.error('Login gagal:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

/**
 * Logout pengguna
 */
export const logout = (req, res) => {
  // Hancurkan session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Tidak dapat logout, Coba lagi nanti' });
    }
    // Hapus cookie dari browser
    res.clearCookie('connect.sid'); // Nama default cookie session Express
    res.status(200).json({ message: 'Logout berhasil' });
  });
};

/**
 * Cek status autentikasi pengguna (me)
 */
export const me = async (req, res) => {
  // Cek apakah ada userId di session
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Belum Login' });
  }

  try {
    // Ambil data pengguna dari database berdasarkan ID di session
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      // Pilih field yang ingin dikembalikan (kecualikan password)
      select: { id: true, email: true, username: true, createdAt: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    // Kirim data pengguna
    res.status(200).json(user);

  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};