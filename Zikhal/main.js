document.addEventListener('DOMContentLoaded', function () {

  const fotoProfil = document.getElementById('fotoProfil');
  const lightbox = document.getElementById('lightbox');
  const btnKembali = document.getElementById('btnKembali');

  function bukaLightbox() {
    lightbox.style.display = 'flex';
  }

  function tutupLightbox() {
    lightbox.style.display = 'none';
  }

  fotoProfil.addEventListener('click', bukaLightbox);
  lightbox.addEventListener('click', tutupLightbox);

  btnKembali.addEventListener('click', function () {
    window.location.href = '../index.html';
  });

});