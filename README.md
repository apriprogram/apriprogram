# Apriprogram Landing Page

Landing page modern untuk jasa pembuatan website custom. Stack yang digunakan:

- Node.js
- JavaScript
- HTML
- CSS
- Tailwind CSS
- MySQL

## Cara Menjalankan

1. Install dependency:

```bash
npm install
```

2. Buat database MySQL:

```sql
CREATE DATABASE apriprogram_db;
```

3. Jalankan schema:

```bash
mysql -u root -p apriprogram_db < database/schema.sql
```

4. Salin konfigurasi environment:

```bash
copy .env.example .env
```

Lalu sesuaikan `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` di file `.env`.

5. Jalankan server:

```bash
npm run dev
```

6. Buka browser:

```text
http://localhost:3000
```

## Struktur Folder

```text
apriprogram-landing-page/
├── database/
│   └── schema.sql
├── public/
│   ├── assets/
│   │   └── hero-bg.svg
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── src/
│   ├── config/
│   │   └── db.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```
