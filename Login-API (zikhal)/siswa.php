<?php
header("Content-Type: application/json");
include "koneksi.php";

$sql = "SELECT siswa.id_siswa, siswa.nama, kelas.nama_kelas, jurusan.nama_jurusan
        FROM siswa
        JOIN kelas ON siswa.kelas_id = kelas.id_kelas
        JOIN jurusan ON kelas.jurusan_id = jurusan.id_jurusan";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>