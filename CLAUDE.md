# CLAUDE.md - Dokumentasi Proyek Apriprogram

> File ini adalah sumber referensi tunggal untuk memahami arsitektur, API, database, dan konvensi kode proyek ini.
> Selalu baca file ini sebelum mengerjakan task apapun di proyek ini.

---

## 1. Tentang Proyek

Apriprogram adalah platform pemesanan pembuatan website custom.
Dibangun dengan fokus pada kecepatan, desain modern UI/UX, dan kemudahan pengelolaan bagi admin maupun klien.

### Fitur Utama

- **Client Area**: Pemesanan layanan, tracking status pesanan, pengelolaan profil.
- **Admin Dashboard**: Manajemen pesanan, pengguna, pengaturan platform, statistik real-time.
- **Authentication**: Registrasi, login, Google OAuth, role-based access control Admin/Client.
- **Responsive UI**: Tailwind CSS, dark mode, komponen EJS reusable.

---

## 2. Tech Stack & Arsitektur

- **Frontend**: HTML5, EJS server-side rendering, Vanilla JavaScript, Tailwind CSS CDN.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL via `mysql2/promise`.
- **Session & Auth**: `express-session`, `bcrypt`, Google OAuth.
- **Pola**: MVC - Models/DB config, Views/EJS, Controllers/logika bisnis.

### Struktur Folder

```text
apriprogram/
|-- src/
|   |-- server.js              # Entry point Express, semua route terdaftar di sini
|   |-- config/db.js           # Koneksi pool MySQL + inisialisasi tabel
|   |-- controllers/
|   |   |-- adminController.js # Logika dashboard admin, settings, users, stats
|   |   |-- authController.js  # Login, register, Google OAuth
|   |   `-- orderController.js # CRUD pesanan
|   `-- middleware/auth.js     # requireLogin, requireAdmin
|-- views/
|   |-- admin/
|   |   |-- dashboard.ejs      # Shell halaman admin (layout + include tabs, modal, scripts)
|   |   |-- components/        # Komponen EJS reusable (modal, stat-card, ui-scripts)
|   |   |-- partials/          # navbar.ejs, sidebar.ejs
|   |   |-- tabs/              # dashboard.ejs, orders.ejs, settings.ejs, users.ejs
|   |   `-- scripts/           # Logic JS admin per fitur
|   |-- client/order.ejs       # Halaman pemesanan klien
|   `-- login.ejs
|-- public/
|   |-- css/                   # style.css utama
|   |-- js/                    # Script klien
|   |-- uploads/               # Upload gambar umum/admin
|   `-- assets/                # Asset publik, dokumen client, bukti pembayaran
`-- CLAUDE.md                  # File ini
```

---

## 3. Database Schema

### Tabel `users`

| Kolom      | Tipe                  | Keterangan                             |
| ---------- | --------------------- | -------------------------------------- |
| id         | INT PK AUTO_INCREMENT |                                        |
| full_name  | VARCHAR(100)          | Nama lengkap                           |
| email      | VARCHAR(100) UNIQUE   |                                        |
| password   | VARCHAR(255)          | bcrypt hash                            |
| whatsapp   | VARCHAR(20)           |                                        |
| role       | ENUM                  | `client`, `admin`, `super admin`       |
| google_id  | VARCHAR(100)          | Untuk OAuth                            |
| created_at | TIMESTAMP             |                                        |

### Tabel `orders`

| Kolom            | Tipe                  | Keterangan              |
| ---------------- | --------------------- | ----------------------- |
| id               | INT PK AUTO_INCREMENT |                         |
| user_id          | INT FK ke users.id    |                         |
| project_name     | VARCHAR(200)          |                         |
| package_name     | VARCHAR(100)          | Paket yang dipilih      |
| package_price    | DECIMAL / VARCHAR     | Harga paket             |
| website_type     | VARCHAR(100)          |                         |
| domain_name      | VARCHAR(100)          |                         |
| description      | TEXT                  | Deskripsi proyek        |
| features         | TEXT                  | Fitur yang diminta      |
| reference_links  | TEXT                  |                         |
| primary_color    | VARCHAR(20)           | Preferensi warna utama  |
| secondary_color  | VARCHAR(20)           | Preferensi warna kedua  |
| typography       | VARCHAR(100)          | Font preferensi         |
| design_style     | VARCHAR(100)          | Gaya desain             |
| project_document | TEXT                  | Path file dokumen (CSV) |
| payment_proof    | VARCHAR(255)          | Path bukti bayar        |
| status           | VARCHAR(50)           | Default: `Pending DP`   |
| notes            | TEXT                  | Catatan admin           |
| start_date       | DATE                  | Tanggal mulai           |
| target_date      | DATE                  | Estimasi selesai        |
| created_at       | TIMESTAMP             |                         |
| updated_at       | TIMESTAMP             |                         |

Nilai status yang valid: `Pending DP`, `Proses`, `Revisi`, `Selesai`, `Batal`.

Penting: key status di database pakai huruf campuran dan spasi, contoh `Pending DP`. Di API response stats, key status adalah lowercase: `pending dp`, `proses`, dan seterusnya.

### Tabel `settings`

| Kolom         | Tipe               | Keterangan                                |
| ------------- | ------------------ | ----------------------------------------- |
| id            | INT PK             |                                           |
| section       | VARCHAR(50)        | Grup pengaturan, contoh `hero`, `footer`  |
| setting_key   | VARCHAR(50)        | Key pengaturan                            |
| setting_value | TEXT               | Nilai pengaturan                          |

Catatan: item service disimpan di tabel `settings` dengan `section = 'service_items'` dan `setting_value` berupa JSON.

### Tabel `visitors`

| Kolom      | Tipe        | Keterangan |
| ---------- | ----------- | ---------- |
| id         | INT PK      |            |
| ip_address | VARCHAR(50) |            |
| user_agent | TEXT        |            |
| visited_at | TIMESTAMP   |            |

### Tabel `contacts`

| Kolom      | Tipe         | Keterangan |
| ---------- | ------------ | ---------- |
| id         | INT PK       |            |
| name       | VARCHAR(100) |            |
| email      | VARCHAR(100) |            |
| message    | TEXT         |            |
| created_at | TIMESTAMP    |            |

---

## 4. API Reference

### 4.1 Auth

| Method | Endpoint             | Keterangan                              |
| ------ | -------------------- | --------------------------------------- |
| POST   | `/api/auth/login`    | Body: `{ email, password }`             |
| POST   | `/api/auth/register` | Body: register user                     |
| POST   | `/api/auth/logout`   | Hapus sesi                              |
| GET    | `/api/auth/google`   | Redirect ke Google OAuth                |
| GET    | `/logout`            | Hapus sesi via route biasa              |

### 4.2 Orders

| Method | Endpoint          | Auth   | Keterangan                              |
| ------ | ----------------- | ------ | --------------------------------------- |
| POST   | `/api/orders`     | Login  | Buat pesanan baru                       |
| GET    | `/api/orders`     | Login  | Admin semua order, client order sendiri |
| PUT    | `/api/orders/:id` | Admin  | Update pesanan                          |
| DELETE | `/api/orders/:id` | Admin  | Hapus pesanan                           |

### 4.3 Admin

| Method | Endpoint                     | Auth   | Keterangan             |
| ------ | ---------------------------- | ------ | ---------------------- |
| GET    | `/api/admin/dashboard-stats` | Admin  | Statistik dashboard    |
| GET    | `/api/admin/users`           | Admin  | Daftar pengguna        |
| POST   | `/api/admin/users`           | Admin  | Buat pengguna baru     |
| PUT    | `/api/admin/users/:id`       | Admin  | Update pengguna        |
| DELETE | `/api/admin/users/:id`       | Admin  | Hapus pengguna         |
| GET    | `/api/settings`              | Public | Ambil semua pengaturan |
| POST   | `/api/admin/settings`        | Admin  | Update pengaturan      |
| GET    | `/api/admin/services`        | Admin  | Ambil item service     |
| POST   | `/api/admin/services`        | Admin  | Simpan item service    |
| DELETE | `/api/admin/services/:slug`  | Admin  | Hapus item service     |
| POST   | `/api/admin/upload`          | Admin  | Upload gambar umum     |

### 4.4 Upload

| Method | Endpoint               | Auth  | Keterangan                     |
| ------ | ---------------------- | ----- | ------------------------------ |
| POST   | `/api/upload/document` | Login | Upload dokumen project client  |
| POST   | `/api/upload/payment`  | Login | Upload bukti pembayaran        |
| POST   | `/api/upload`          | Login | Compatibility route dokumen    |

### 4.5 Response: `GET /api/admin/dashboard-stats`

Struktur response bersarang, bukan flat.

```json
{
  "success": true,
  "stats": {
    "users": { "Harian": 1, "Mingguan": 3, "Bulanan": 9, "Tahunan": 10 },
    "orders": { "Harian": 0, "Mingguan": 2, "Bulanan": 6, "Tahunan": 6 },
    "visitors": { "Harian": 5, "Mingguan": 20, "Bulanan": 80, "Tahunan": 300 },
    "statuses": {
      "pending dp": 2,
      "proses": 1,
      "revisi": 0,
      "selesai": 3,
      "batal": 0
    },
    "total_orders": 6
  }
}
```

Cara membaca di JavaScript:

```js
const stats = data.stats;
stats.visitors.Bulanan;
stats.statuses['pending dp'];
stats.orders.Tahunan;
stats.users.Tahunan;
```

### 4.6 Response: `GET /api/orders`

```json
{
  "success": true,
  "orders": [
    {
      "id": 1,
      "user_id": 2,
      "full_name": "Nama Klien",
      "email": "klien@email.com",
      "whatsapp": "08xxxxxxx",
      "project_name": "Website Company Profile",
      "package_name": "Standard",
      "package_price": 9500000,
      "website_type": "Company Profile",
      "domain_name": "example.com",
      "description": "Deskripsi proyek",
      "features": "Fitur yang diminta",
      "primary_color": "#1E40AF",
      "secondary_color": "#3B82F6",
      "design_style": "Modern Minimalist",
      "start_date": "2026-07-01",
      "target_date": "2026-08-15",
      "project_document": "/uploads/doc1.pdf,/uploads/doc2.pdf",
      "payment_proof": "/uploads/bayar.jpg",
      "status": "Pending DP",
      "created_at": "2026-06-01T00:00:00.000Z"
    }
  ]
}
```

**Catatan penting field orders:**
- `project_document` berformat CSV (dipisah koma) untuk mendukung multiple file.
- Nomor telepon klien diambil dari `order.whatsapp` atau `user.whatsapp` (bukan `user.phone`).
- Field `full_name` di response orders adalah JOIN dari tabel `users.full_name`.

---

## 5. Pengaturan Dinamis (Settings)

Pengaturan disimpan per `section` dan `setting_key`.

Contoh section yang dipakai admin dashboard:

- `navbar`: `logo_text`.
- `hero`: `image_url`, `title_main`, `title_gradient`, `subtitle`, `cta_text`, `cta_link`.
- `services`: `title`, `subtitle`, `button_text`, `button_link`.
- `projects`: `title`, `subtitle`.
- `timeline`: `title`, `subtitle`.
- `faq`: `title`, `subtitle`.
- `cta`: `title`, `subtitle`, `button_text`, `button_link`.
- `footer`: `description`, `copyright`.

Di frontend, elemen settings di-bind via ID: `id="{section}-{key}"`. Contoh: `id="hero-title_main"`.

---

## 6. Konvensi Kode

### JavaScript

- Wajib gunakan `async/await` dan `try/catch` untuk operasi API.
- Gunakan `const` untuk nilai tetap dan `let` untuk state dinamis.
- Nama variabel dan fungsi memakai `camelCase`.
- Hindari logic panjang langsung di file layout EJS.

### HTML / EJS

- Komponen reusable ditempatkan di `views/admin/components/`.
- Dipanggil via `<%- include('components/nama-file', { prop: nilai }) %>`.
- Komponen JS helper status badge dan action button ada di `views/admin/components/ui-scripts.ejs`.

### Admin Dashboard Modular

`views/admin/dashboard.ejs` hanya menjadi shell/layout halaman admin. File ini tidak boleh lagi menampung logic fitur panjang. Isi utama dashboard harus berupa include berikut:

- `views/admin/partials/` untuk `navbar.ejs` dan `sidebar.ejs`.
- `views/admin/tabs/` untuk markup halaman: `dashboard.ejs`, `orders.ejs`, `settings.ejs`, `users.ejs`.
- `views/admin/components/` untuk modal dan komponen reusable: `modal-order.ejs`, `modal-detail.ejs`, `modal-user.ejs`, `modal-delete.ejs`, `stat-card.ejs`, `ui-scripts.ejs`.
- `views/admin/scripts/` untuk logic JavaScript per fitur.

Pembagian file logic admin saat ini:

- `scripts/core.ejs`: state global admin, dark mode, sidebar toggle, tab switching, upload image umum, toast, delete modal.
- `scripts/dashboard-page.ejs`: load dan render statistik dashboard, termasuk status bars order.
- `scripts/orders-page.ejs`: tabel orders, search, pagination, side modal tambah/edit order, side modal detail order, upload dokumen/bukti bayar.
- `scripts/settings-page.ejs`: load/save settings, navigasi section settings, CRUD service item, modal service, upload image service.
- `scripts/users-page.ejs`: tabel users, search, pagination, modal tambah/edit user, submit user form.
- `scripts/init.ejs`: inisialisasi event listener dan initial load setelah DOM siap.

Konvensi penting:

- Tombol yang memakai `onclick` di markup tab/component harus memanggil fungsi global dari file di `views/admin/scripts/`.
- Jika menambah fitur dashboard baru, buat atau update file script fitur terkait. Jangan menaruh logic panjang langsung di `dashboard.ejs`.
- Modal Order dan Detail memakai pola side modal dari kanan: overlay `hidden opacity-0`, panel `translate-x-full`, dibuka lewat helper `openSideModal()` dan ditutup lewat `closeSideModal()` di `scripts/orders-page.ejs`.
- Simpan handler form sesuai domainnya: users di `users-page.ejs`, orders di `orders-page.ejs`, settings di `settings-page.ejs`.

### Custom Dropdown

- Semua `<select>` di dalam `<form>` secara otomatis dikonversi menjadi *custom dropdown* yang lebih cantik oleh fungsi `initCustomDropdowns()` di `components/ui-scripts.ejs`.
- Ketika mengisi nilai `<select>` secara programatik (via JavaScript), **wajib dispatch event `change`** agar tampilan custom dropdown ikut update:
  ```js
  el.value = 'nilai-baru';
  el.dispatchEvent(new Event('change'));
  ```
- Fungsi `initCustomDropdowns()` dipanggil sekali di `init.ejs`. Jika modal baru muncul setelah init, jalankan `initCustomDropdowns(document.getElementById('nama-modal'))` secara manual.

### Modal Detail Pesanan (`modal-detail.ejs`)

Modal detail pesanan menampilkan informasi read-only dalam 4 seksi:
1. **CLIENT INFORMATION** - nama, email, telepon klien (dari `user.whatsapp`).
2. **FINANCIALS & TIMELINE** - budget, tanggal mulai/selesai, jenis layanan, domain.
3. **DESIGN PREFERENCES** - primary color, secondary color (dengan preview warna), design style.
4. **PROJECT MATERIALS** - dokumen proyek (multiple file CSV) dan bukti pembayaran, dengan tombol Lihat & Download per file.

Logic pengisian modal detail ada di fungsi `viewOrderDetail(id)` di `scripts/orders-page.ejs`.
Logic render dokumen ada di `renderDetailDocuments(order)` dan `renderDetailPaymentProof(order)`.

### Tailwind CSS & Desain

- Urutan class: layout, dimensi, tipografi, warna, interaktivitas.
- Gunakan var brand seperti `brand-dark`, `brand-blue`, `brand-card`, `brand-border`.
- Border radius kartu besar: `rounded-2xl`, tombol: `rounded-xl` atau `rounded-full`.
- Shadow minimal, preferensi flat dengan border `border-slate-200`.
- Font weight: `font-medium` untuk angka statistik dan judul. Hindari `font-bold`/`font-black` untuk statistik utama kecuali ada alasan desain.

---

## 7. Instalasi

```bash
npm install
cp .env.example .env
node migrate.js
npm run dev
```

Isi `.env` minimal:

```text
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
SESSION_SECRET=
```

---

## 8. Keamanan

- Password memakai bcrypt dengan 10 salt rounds.
- Session memakai `express-session` dengan cookie HttpOnly.
- Query database memakai prepared statements via `mysql2` untuk mengurangi risiko SQL injection.
- Upload memakai nama file acak berbasis timestamp + random.
- Route admin harus dilindungi `requireAdmin`.
- Route client yang membutuhkan sesi harus dilindungi `requireLogin`.