// ==========================
// VIDEO HOVER PREVIEW
// ==========================
const videos = document.querySelectorAll(".hover-video");

videos.forEach((video) => {
  const container = video.parentElement;

  // Desktop hover
  container.addEventListener("mouseenter", () => {
    video.currentTime = 0;
    video.play();
  });

  container.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });

  // Mobile touch support
  container.addEventListener("touchstart", () => {
    video.currentTime = 0;
    video.play();
  });

  container.addEventListener("touchend", () => {
    video.pause();
    video.currentTime = 0;
  });
});

// ==========================
// MENU SHRINK ON SCROLL
// ==========================
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
});

// ==========================
// PAGE LOAD ANIMATIONS
// ==========================
window.addEventListener("load", () => {
  // Scroll to top on load
  window.scrollTo(0, 0);
  document.body.classList.add('noscroll');
  setTimeout(() => document.body.classList.remove('noscroll'), 1000);

  const navbar = document.getElementById("navbar");
  navbar?.classList.add("nav-animate");

  document.querySelector('.left-brand')?.classList.add('brand-animate');
  document.querySelector('.search-box')?.classList.add('search-animate');
  document.getElementById('menu-toggle')?.classList.add('toggle-animate');

  const subtitle = document.querySelector(".animated-subtitle");
  if (subtitle) {
    subtitle.style.animationDelay = "300ms";
    subtitle.classList.add("subtitle-animate");
  }

  document.querySelectorAll(".game-box").forEach((box, i) => {
    box.style.animationDelay = `${500 + i * 50}ms`;
    box.classList.add("game-animate");
  });

  // Restore menu width from previous session
  const savedWidth = localStorage.getItem('menuWidth');
  if (savedWidth) {
    document.documentElement.style.setProperty('--menu-width', savedWidth);
  }
});

// ==========================
// MENU TOGGLE + BUTTON ACTIVE STATE
// ==========================
const toggleBtn = document.getElementById('menu-toggle');
const closeBtn = document.getElementById('menu-close');
const menu = document.getElementById('side-menu');

toggleBtn?.addEventListener('click', () => {
  menu.classList.toggle('open');
  toggleBtn.classList.toggle('active');
});

closeBtn?.addEventListener('click', () => {
  menu.classList.remove('open');
  toggleBtn.classList.remove('active');
});

// ==========================
// DRAG TO RESIZE MENU
// ==========================
const resizer = document.getElementById('resizer');
let isResizing = false;

resizer?.addEventListener('mousedown', () => {
  isResizing = true;
  document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
  if (!isResizing) return;
  const newWidth = window.innerWidth - e.clientX;
  const minW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--menu-min'));
  const maxW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--menu-max'));
  const clampedWidth = Math.min(Math.max(newWidth, minW), maxW);
  document.documentElement.style.setProperty('--menu-width', clampedWidth + 'px');
});

document.addEventListener('mouseup', () => {
  if (isResizing) {
    isResizing = false;
    document.body.style.userSelect = '';
    const width = getComputedStyle(document.documentElement).getPropertyValue('--menu-width');
    localStorage.setItem('menuWidth', width);
  }
});

// ==========================
// BASIC DEVTOOLS BLOCKING (DETERRENTE)
// ==========================

// Disable right-click
document.addEventListener('contextmenu', e => e.preventDefault());

// Block dev tools shortcuts
document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j')) ||
    (e.ctrlKey && key === 'u')
  ) {
    e.preventDefault();
    alert("Questa azione è disabilitata.");
  }
});

// Optional: rileva ispezione tramite dimensione finestra
setInterval(() => {
  if (
    window.outerWidth - window.innerWidth > 100 ||
    window.outerHeight - window.innerHeight > 100
  ) {
    console.warn("DevTools rilevato.");
    // document.body.innerHTML = "<h1>Accesso non autorizzato</h1>"; // opzionale
  }
}, 1000);

// ==========================
// SHUFFLE GAME BOXES ON TITLE CLICK
// ==========================
document.getElementById("shuffle-title")?.addEventListener("click", () => {
  const container = document.querySelector(".grid-container");
  if (!container) return;

  const gameBoxes = Array.from(container.children);

  // RIMUOVI TUTTE LE EVIDENZIAZIONI PRIMA DI SHUFFLARE
  gameBoxes.forEach(box => box.classList.remove('highlighted'));

  // Shuffle dei giochi
  for (let i = gameBoxes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameBoxes[i], gameBoxes[j]] = [gameBoxes[j], gameBoxes[i]];
  }

  container.innerHTML = "";
  gameBoxes.forEach(box => container.appendChild(box));
});

// ==========================
// PULSANTE CASUALE - VERSIONE CORRETTA
// ==========================
// Funzione per ottenere sempre l'array aggiornato dei giochi
function getCurrentGameBoxes() {
  return Array.from(document.querySelectorAll('.game-box'));
}

const randomGameBtn = document.querySelector('.random-game-btn');

// Variabile per controllare se il pulsante è in cooldown
let isButtonCooldown = false;

randomGameBtn?.addEventListener('click', () => {
  // Ottieni l'array aggiornato dei giochi ogni volta
  const currentGameBoxes = getCurrentGameBoxes();
  
  // Se è in cooldown o non ci sono giochi, ignora il click
  if (isButtonCooldown || currentGameBoxes.length === 0) return;

  // Attiva il cooldown
  isButtonCooldown = true;
  
  // Disabilita visivamente il pulsante
  randomGameBtn.style.opacity = '0.5';
  randomGameBtn.style.cursor = 'not-allowed';
  randomGameBtn.textContent = 'Scegliendo...';

  // Rimuovi evidenziazione precedente
  currentGameBoxes.forEach(box => box.classList.remove('highlighted'));

  // Aggiungi un piccolo delay per l'effetto "scelta in corso"
  setTimeout(() => {
    // Ottieni di nuovo l'array aggiornato (per sicurezza)
    const gameBoxes = getCurrentGameBoxes();
    
    // Scegli un indice casuale
    const randomIndex = Math.floor(Math.random() * gameBoxes.length);
    const chosenGame = gameBoxes[randomIndex];
    const firstGame = gameBoxes[0];
    const container = document.querySelector(".grid-container");

    // Se il gioco scelto non è già il primo, scambia le posizioni
    if (chosenGame !== firstGame && container) {
      // Metodo più semplice e affidabile: sposta l'elemento scelto in prima posizione
      container.insertBefore(chosenGame, firstGame);
    }

    // Evidenzia il gioco ora in prima posizione
    const newFirstGame = getCurrentGameBoxes()[0];
    newFirstGame.classList.add('highlighted');

    // Dopo 2 secondi, riabilita il pulsante
    setTimeout(() => {
      isButtonCooldown = false;
      randomGameBtn.style.opacity = '1';
      randomGameBtn.style.cursor = 'pointer';
      randomGameBtn.textContent = 'Scegli gioco casuale';
    }, 2000);

  }, 800); // Delay di 800ms per l'effetto "scelta in corso"
});