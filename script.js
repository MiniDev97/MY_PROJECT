// VIDEO HOVER PREVIEW
const videos = document.querySelectorAll(".hover-video");

videos.forEach((video) => {
  const container = video.parentElement;

  container.addEventListener("mouseenter", () => {
    video.currentTime = 0;
    video.play();
  });

  container.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});

// MENU SHRINK ON SCROLL
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar"); // Assicurati che <header> abbia id="navbar"
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
});

// SOTTO MENU

