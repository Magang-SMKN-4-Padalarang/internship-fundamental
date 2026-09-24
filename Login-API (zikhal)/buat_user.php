<?php
header("Content-Type: application/json");
include "koneksi.php";

// ==== GANTI username & password percobaan di sini kalau perlu ====
$username = "widi";
$password = "rahasia123";

// Cek dulu supaya tidak dobel kalau file ini kelupaan dijalankan 2x
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "User '$username' sudah ada, tidak dibuat ulang"
    ]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $hashedPassword);
$stmt->execute();

echo json_encode([
    "status" => "success",
    "message" => "User percobaan berhasil dibuat",
    "username" => $username,
    "password_asli_untuk_login" => $password
]);
