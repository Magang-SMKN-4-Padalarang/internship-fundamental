const modalBerita = document.getElementById("modalBerita");

modalBerita.addEventListener("show.bs.modal", function (event) {

    const tombol = event.relatedTarget;

    const judul = tombol.getAttribute("data-judul");
    const tanggal = tombol.getAttribute("data-tanggal");
    const gambar = tombol.getAttribute("data-gambar");
    const isi = tombol.getAttribute("data-isi");

    document.getElementById("modalJudul").textContent = judul;
    document.getElementById("modalTanggal").textContent = tanggal;
    document.getElementById("modalGambar").src = gambar;
    document.getElementById("modalIsi").textContent = isi;

});