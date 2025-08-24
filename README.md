# 📝 Notion Clone - Backend

Ini adalah **backend** untuk aplikasi kloningan **Notion**, dibangun dengan **Node.js**, **Express**, dan **PostgreSQL**. Proyek ini menyediakan API yang tangguh untuk autentikasi pengguna dan manajemen catatan (dokumen) yang mendukung:

- Struktur bertingkat
- Pengarsipan
- Properti lanjutan seperti tag, prioritas, dan tanggal jatuh tempo

---

## ✨ Fitur

- **Autentikasi Pengguna**  
  Registrasi, login, dan logout berbasis sesi yang aman.

- **Manajemen Catatan (CRUD)**  
  Buat, baca, perbarui, dan arsipkan catatan.

- **Struktur Bertingkat**  
  Catatan dapat memiliki sub-catatan (anak), meniru fitur inti Notion.

- **Drag & Drop**  
  Mendukung pengurutan ulang catatan dengan menyimpan posisi.

- **Fitur Sampah (Archive)**  
  Catatan yang dihapus tidak langsung hilang, melainkan diarsipkan.  
  Pengguna dapat melihat, memulihkan, atau menghapus catatan secara permanen.

- **Properti & Filter Lanjutan**  
  - Tambahkan **tags berwarna** untuk kategorisasi  
  - Tetapkan **prioritas**: `LOW`, `MEDIUM`, `HIGH`  
  - Tambahkan **tanggal jatuh tempo**  
  - Filter catatan berdasarkan status, prioritas, atau tag

- **Validasi & Keamanan**  
  Validasi input yang kuat menggunakan **Zod** dan penanganan error terpusat.

---

## 🚀 Teknologi yang Digunakan

| Komponen       | Teknologi                 |
|----------------|---------------------------|
| Runtime        | Node.js                   |
| Framework      | Express.js                |
| Database       | PostgreSQL (via Docker)   |
| ORM            | Prisma                    |
| Autentikasi    | express-session, cookie-parser |
| Password Hash  | bcrypt                    |
| Validasi       | Zod                       |
| Lainnya        | ES Modules, CORS          |

---

## 🛠️ Instalasi & Penyiapan Lokal

Ikuti langkah-langkah ini untuk menjalankan server secara lokal:

### 1. Prasyarat

- Node.js (v18 atau lebih baru)
- Docker & Docker Compose

### 2. Clone Repositori

```bash
git clone https://github.com/Ets028/notion-clone-backend.git
cd notion-clone-backend
````

### 3. Instal Dependensi

```bash
npm install
```

### 4. Konfigurasi Environment Variables

Buat file `.env` di root proyek dan isi dengan:

```env
# URL koneksi database untuk Prisma
DATABASE_URL="postgresql://notionuser:notionpass@localhost:5432/notionclone?schema=public"

# Secret key untuk session cookie
SESSION_SECRET="ganti-dengan-secret-key-yang-sangat-aman"

# URL frontend Anda (untuk konfigurasi CORS)
FRONTEND_URL="http://localhost:3000"
```

Atau salin dari `.env.example` jika tersedia:

```bash
cp .env.example .env
```

### 5. Jalankan Database

Pastikan Docker sudah aktif, lalu jalankan:

```bash
docker-compose up -d
```

> `-d` berarti menjalankan dalam mode *detached* (di latar belakang)

### 6. Jalankan Migrasi Database

```bash
npx prisma migrate dev
```

### 7. (Opsional) Isi Database dengan Data Contoh

```bash
npx prisma db seed
```

### 8. Jalankan Server

Untuk mode pengembangan (auto-reload dengan `nodemon`):

```bash
npm run dev
```

Server akan berjalan di: [http://localhost:5000](http://localhost:5000)

---

## 📜 Skrip yang Tersedia

| Skrip               | Deskripsi                                  |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Menjalankan server dalam mode pengembangan |
| `npm start`         | Menjalankan server dalam mode produksi     |
| `npx prisma studio` | UI visual untuk melihat dan mengelola data |

---

## 🧾 Lisensi

Tambahkan lisensi proyek di sini, misalnya MIT, jika diperlukan.

---

## 🙌 Kontribusi

Pull request dan masukan sangat diterima!
Pastikan untuk membuka issue terlebih dahulu sebelum membuat perubahan besar.

---

Happy coding! 🚀

```
