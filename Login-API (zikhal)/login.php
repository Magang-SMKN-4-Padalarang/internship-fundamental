<?php
header("Content-Type: application/json");
include "koneksi.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = isset($data['username']) ? $data['username'] : '';
$password = isset($data['password']) ? $data['password'] : '';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Username dan password wajib diisi"]);
    exit;
}

$sql = "SELECT id, username, password FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Username tidak ditemukan"]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Password salah"]);
    exit;
}

$token = bin2hex(random_bytes(32));

$sqlToken = "INSERT INTO user_tokens (user_id, token) VALUES (?, ?)";
$stmtToken = $conn->prepare($sqlToken);
$stmtToken->bind_param("is", $user['id'], $token);
$stmtToken->execute();

echo json_encode([
    "status" => "success",
    "message" => "Login berhasil",
    "data" => [
        "id" => $user['id'],
        "username" => $user['username'],
        "token" => $token
    ]
]);
?>