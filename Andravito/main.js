const btnKembali = document.getElementById("btnKembali");

btnKembali.addEventListener("click", function () {
	window.location.href = '../profil/profil.html'
});

document.addEventListener('DOMContentLoaded', function () {
	const bukaPhoto = document.getElementById("bukapoto");
	const tutupPhoto = document.getElementById("tutuppoto");

	bukaPhoto.addEventListener('click', bukaLightbox)
	tutupPhoto.addEventListener('click', tutupLightbox)

	function bukaLightbox() {
		document.getElementById('lightbox').style.display = 'flex';
	}

	function tutupLightbox() {
		document.getElementById('lightbox').style.display = 'none';
	}
});
