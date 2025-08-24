# 📘 Dokumentasi API - Notion Clone

Selamat datang di dokumentasi API untuk backend **Notion Clone**.  
API ini dirancang untuk mendukung fitur pencatatan, manajemen tag, dan autentikasi pengguna.

---

## 🌐 Base URL

```

[http://localhost:5000/api](http://localhost:5000/api)

````

---

## 👤 Autentikasi

### POST `/auth/register`  
Mendaftarkan pengguna baru.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
````

**Respons (201):**

```json
{
  "message": "User registered successfully",
  "user": { ... }
}
```

---

### POST `/auth/login`

Login pengguna dan membuat sesi baru.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Respons (200):**

```json
{
  "message": "Login successful",
  "user": { ... }
}
```

---

### POST `/auth/logout`

Logout pengguna dan menghancurkan sesi.

**Respons (200):**

```json
{
  "message": "Logged out successfully"
}
```

---

### GET `/auth/me`

Mendapatkan data pengguna yang sedang login.

**Respons (200):**

```json
{
  "id": "...",
  "username": "...",
  "email": "..."
}
```

---

## 📝 Catatan (Notes)

> Semua endpoint berikut memerlukan autentikasi.

---

### POST `/notes`

Membuat catatan baru.

**Request Body:**

```json
{
  "title": "string",
  "content": { ... },
  "parentId": "optional"
}
```

---

### GET `/notes`

Mengambil semua catatan level atas yang belum diarsipkan.

**Query Params (Opsional):**

* `status`: `NOT_STARTED`, `IN_PROGRESS`, `DONE`
* `priority`: `LOW`, `MEDIUM`, `HIGH`
* `tags`: ID tag, dipisahkan koma (e.g. `?tags=tag1,tag2`)

**Respons (200):**

```json
[
  { "id": "...", "title": "...", ... }
]
```

---

### GET `/notes/archived`

Mengambil semua catatan yang telah diarsipkan.

**Respons (200):** Array objek catatan.

---

### GET `/notes/:id`

Mengambil satu catatan spesifik beserta anak-anaknya.

**Respons (200):**

```json
{
  "id": "...",
  "title": "...",
  "children": [...],
  "tags": [...]
}
```

---

### PUT `/notes/:id`

Memperbarui detail sebuah catatan.

**Request Body (semua opsional):**

```json
{
  "title": "Judul Baru",
  "content": { ... },
  "isFavorite": true,
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2025-12-31T00:00:00.000Z",
  "tags": ["tagId1", "tagId2"]
}
```

**Respons (200):** Objek catatan yang diperbarui.

---

### DELETE `/notes/:id`

Mengarsipkan catatan.

**Respons (200):**

```json
{
  "message": "Note archived successfully."
}
```

---

### POST `/notes/:id/restore`

Mengembalikan catatan dari arsip.

**Respons (200):** Objek catatan.

---

### DELETE `/notes/:id/permanent`

Menghapus catatan secara permanen.

**Respons (204):** Tidak ada konten.

---

### PATCH `/notes/reorder`

Memperbarui posisi (urutan) catatan.

**Request Body:**

```json
{
  "notes": [
    { "id": "noteId1", "position": 0 },
    { "id": "noteId2", "position": 1 }
  ]
}
```

**Respons (200):**

```json
{
  "message": "Notes reordered successfully"
}
```

---

## 🏷️ Tag

> Semua endpoint berikut memerlukan autentikasi.

---

### POST `/tags`

Membuat tag baru.

**Request Body:**

```json
{
  "name": "Tag Name",
  "color": "#RRGGBB"
}
```

**Respons (201):** Objek tag.

---

### GET `/tags`

Mengambil semua tag milik pengguna.

**Respons (200):** Array objek tag.

---

### PUT `/tags/:id`

Memperbarui nama atau warna tag.

**Request Body (opsional):**

```json
{
  "name": "New Name",
  "color": "#NewColor"
}
```

**Respons (200):** Objek tag yang diperbarui.

---

### DELETE `/tags/:id`

Menghapus sebuah tag.

**Respons (204):** Tidak ada konten.

---

## 🚀 Selesai!

Untuk menggunakan API ini secara maksimal, pastikan Anda sudah melakukan autentikasi dan menyertakan token sesi (jika ada) pada setiap permintaan ke endpoint yang membutuhkan autentikasi.

---

© 2025 Notion Clone API
