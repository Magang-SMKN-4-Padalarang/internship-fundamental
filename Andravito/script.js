const lightbox = GLightbox();

function halo() {
    const jam = new Date().getHours();
    const sapaan = document.getElementById("pesan");

    if (jam >= 3 && jam < 11) {
        sapaan.innerHTML = "Selamat Pagi!";
    } else if (jam >= 11 && jam < 15) {
        sapaan.innerHTML = "Selamat Siang!";
    } else if (jam >= 15 && jam < 18) {
        sapaan.innerHTML = "Selamat Sore!";
    } else {
        sapaan.innerHTML = "Selamat Malam!";
    }

}

function popup() {
    alert("ini adalah pesan alert");
}

let lightMode = localStorage.getItem('lightMode')
const themeSwitch = document.getElementById('theme-switch')

const enableLightmode = () => {
    document.body.classList.add('lightMode')
    localStorage.setItem('lightMode', 'active')
}

const disableLightmode = () => {
    document.body.classList.remove('lightMode')
    localStorage.setItem('lightMode', null)
}

if (lightMode === "active") enableLightmode()

themeSwitch.addEventListener("click", () => {
    lightMode = localStorage.getItem('lightMode')
    lightMode !== "active" ? enableLightmode() : disableLightmode()
})
