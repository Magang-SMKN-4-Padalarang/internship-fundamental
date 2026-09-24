//memanggil library yg sudah di install
//express digunakan untuk membuat server dan API
//mysql2 digunakan agar node.js bisa berkomunikasi dgn MySQL
//jsonwebtoken (library) untuk membuat dan mengecek JWT
const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");

//untuk membuat apk/server express
const app = express();

//agar server bisa membaca JSON
app.use(express.json());

// SECRET JWT (kunci rahasia yang digunakan untuk membuat dan memverifikasi JWT)
const JWT_SECRET = "rahasia_login_api";

// KONEKSI KE MYSQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "login_api"
});

// Cek koneksi
db.connect((err) => {
    if (err) {
        console.error("Database gagal terhubung:", err);
        return;
    }

    console.log("Database berhasil terhubung!");
});


// API UTAMA (bisa dipakai untuk mengecek apakah server/API sedang berjalan)
app.get("/", (req, res) => {
    res.json({
        message: "API Login berhasil berjalan!"
    });
});

// API USERS
app.get("/users", (req, res) => {
    const sql = "SELECT * FROM users";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Gagal mengambil data"
            });
        }

        res.json(result);
    });
});


// API LOGIN + JWT (endpoint API login yang nantinya melakukan pengecekan username + password dan, kalau benar, membuat JWT. kenapa post krn client mengirim data login ke server
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";

    db.query(sql, [username, password], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Terjadi kesalahan server"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Username atau password salah"
            });
        }

        const user = result[0];

        // Membuat JWT / token setelah login berhasil
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login berhasil",
            token: token
        });
    });
});


// MIDDLEWARE CEK JWT
function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {                        //Mengecek apakah user mengirim token di header atau tidak
        return res.status(401).json({
            message: "Token tidak ditemukan"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, JWT_SECRET);  //untuk mengecek/memverifikasi JWT

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Token tidak valid"
        });

    }
}


// PROFILE (untuk mengakses data profil user)
app.get("/profile", verifyToken, (req, res) => {

    res.json({
        message: "Berhasil mengakses profile",
        user: req.user
    });

});

// MENJALANKAN SERVER
app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});