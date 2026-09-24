# JWT Auth API

Contoh REST API sederhana untuk **register**, **login**, **refresh token**, dan **protected route** menggunakan JWT. Dibuat menggunakan Node.js + Express, data user & refresh token disimpan di **MySQL**.

## Struktur Folder

```
jwt-auth-demo/
├── server.js              
├── db.js                 
├── schema.sql              
├── routes/
│   └── auth.js         
├── middleware/
│   └── verifyToken.js     
├── package.json
└── .env.example
```

## Cara Menjalankan

1. **Install dependency**
   ```bash
   npm install
   ```

2. **Siapkan database MySQL**
   Pastikan MySQL server sudah jalan, lalu import `schema.sql` (ini akan otomatis bikin database `jwt_auth_demo` beserta tabel `users` dan `refresh_tokens`):
   ```bash
   mysql -u root -p < schema.sql
   ```

3. **Siapkan file `.env`**
   Copy `.env.example` jadi `.env`, lalu isi:
   - `JWT_ACCESS_SECRET` dan `JWT_REFRESH_SECRET` dengan string acak (boleh generate pakai `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
   - `DB_USER`, `DB_PASSWORD`, `DB_NAME` sesuai kredensial MySQL kamu
   ```bash
   cp .env.example .env
   ```

4. **Jalankan server**
   ```bash
   npm start
   # atau kalau mau auto-restart pas ada perubahan kode:
   npm run dev
   ```
   Server jalan di `http://localhost:3000`. Sudah ditest end-to-end (register → login → akses profile → refresh token → logout) dan berhasil semua, termasuk cek kalau username sudah dipakai dan refresh token yang sudah logout tidak bisa dipakai lagi.

## Cara Testing (pakai curl, atau bisa import ke Postman)

### 1. Register user baru
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"vito","password":"rahasia123"}'
```

### 2. Login → dapat accessToken & refreshToken
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"vito","password":"rahasia123"}'
```
Response contoh:
```json
{
  "message": "Login berhasil",
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

### 3. Akses protected route pakai accessToken
```bash
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer PASTE_ACCESS_TOKEN_DI_SINI"
```
Kalau token valid → dapat data profile.
Kalau token expired/salah → dapat error 401/403.

### 4. Kalau accessToken sudah expired → minta yang baru pakai refreshToken
```bash
curl -X POST http://localhost:3000/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"PASTE_REFRESH_TOKEN_DI_SINI"}'
```

### 5. Logout (refreshToken jadi tidak bisa dipakai lagi)
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"PASTE_REFRESH_TOKEN_DI_SINI"}'
```
