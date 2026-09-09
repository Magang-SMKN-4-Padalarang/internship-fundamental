document.addEventListener("DOMContentLoaded", function () {
    const galleryPhotos = document.querySelectorAll(".galleryPhoto");

    galleryPhotos.forEach(function (photo) {
        photo.addEventListener("click", function (event) {
            event.preventDefault();

            const lightbox = GLightbox({
                elements: [
                    {
                        href: photo.src,
                        type: "image"
                    }
                ]
            });

            lightbox.open();
        });
    });
});