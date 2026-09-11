document.addEventListener("DOMContentLoaded", function () {

  const modalBerita = document.getElementById("modalBerita");

  modalBerita.addEventListener("show.bs.modal", function (event) {


    const button = event.relatedTarget;


    const judul = button.getAttribute("data-judul");
    const tanggal = button.getAttribute("data-tanggal");
    const gambar = button.getAttribute("data-gambar");
    const isi = button.getAttribute("data-isi");



    document.getElementById("modalJudul").textContent = judul;
    document.getElementById("modalTanggal").textContent = tanggal;
    document.getElementById("modalIsi").textContent = isi;

    const modalGambar = document.getElementById("modalGambar");

    modalGambar.src = gambar;

    modalGambar.alt = judul;

  });

});