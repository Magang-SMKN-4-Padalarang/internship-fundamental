const btnKembali = document.getElementById("btnKembali");

btnKembali.addEventListener("click", function () {
    window.location.href = "../profil/profil.html";
});

document.addEventListener('DOMContentLoaded', function () {
    const bukaPhoto = document.getElementById('bukaPhoto');

    bukaPhoto.addEventListener('click', bukaLightbox);

    function bukaLightbox() {
        document.getElementById('lightbox').style.display = 'flex';
    }
});

function tutupLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}




