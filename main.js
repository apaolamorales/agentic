const body = document.body;
const burger = document.querySelector(".burger");
const menu = document.getElementById("mobile-menu");
const menuInner = document.querySelector(".menu__inner");
const menuLinks = document.querySelectorAll(".menu a");
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleLabel = document.querySelector(".theme-toggle__label");
const themeToggleIcon = themeToggle?.querySelector(".material-icons");
const directCard = document.querySelector(".direct-card");
const directArtboard = document.getElementById("directCardTwoArtboard");
const directPhoto = document.querySelector(".direct-card__photo");
const directVideo = document.querySelector(".direct2-video");
const storySection = document.getElementById("picturia-story");
const storyCanvas = document.getElementById("story-canvas");
const storyVideoBack = document.getElementById("story-video-back");
const projectsAccentShell = document.querySelector(".projects-section__accent-shell");
const projectsAccent = document.querySelector(".projects-section__accent");
const projectMedia = document.querySelector(".project-card--large .project-card__media");
const projectsSection = document.getElementById("realisations");
const leaves = {
  left: document.querySelector(".leaf--left"),
  right: document.querySelector(".leaf--right"),
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setMenuState(isOpen) {
  body.classList.toggle("is-open", isOpen);
  burger?.setAttribute("aria-expanded", String(isOpen));
  burger?.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");

  if (!isOpen) {
    burger?.focus();
  }
}

function closeMenu({ restoreFocus = false } = {}) {
  body.classList.remove("is-open");
  burger?.setAttribute("aria-expanded", "false");
  burger?.setAttribute("aria-label", "Ouvrir le menu");

  if (restoreFocus) {
    burger?.focus();
  }
}

burger?.addEventListener("click", () => {
  const isOpen = !body.classList.contains("is-open");
  setMenuState(isOpen);
});

menu?.addEventListener("click", (event) => {
  if (!menuInner?.contains(event.target)) {
    closeMenu();
  }
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && body.classList.contains("is-open")) {
    closeMenu({ restoreFocus: true });
  }
});

const desktopMedia = window.matchMedia("(min-width: 781px)");
desktopMedia.addEventListener("change", (event) => {
  if (event.matches) {
    closeMenu();
  }
});

let ticking = false;
let storyBackDuration = 0;
let storyTargetTime = 0;
let storyCurrentTime = 0;
let storyScrubFrame = 0;
let storyPlaybackReady = false;

function primeStoryPlayback() {
  if (!storyVideoBack) return;

  storyPlaybackReady = true;
  storyBackDuration = storyVideoBack.duration || storyBackDuration || 0;
  if (storyVideoBack.paused === false) {
    storyVideoBack.pause();
  }
}

storyVideoBack?.addEventListener("loadedmetadata", () => {
  storyBackDuration = storyVideoBack.duration || 0;
  storyCurrentTime = 0;
  storyTargetTime = storyCurrentTime;
  storyVideoBack.currentTime = 0;
  storyVideoBack.pause();
});

storyVideoBack?.addEventListener("loadeddata", () => {
  primeStoryPlayback();
});

storyVideoBack?.addEventListener("canplay", () => {
  primeStoryPlayback();
});

function tickStoryScrub() {
  storyScrubFrame = 0;

  if (!storyVideoBack || storyBackDuration <= 0 || !storyPlaybackReady) {
    return;
  }

  const diff = storyTargetTime - storyCurrentTime;
  if (Math.abs(diff) < 0.001) {
    storyCurrentTime = storyTargetTime;
    if (Math.abs(storyVideoBack.currentTime - storyCurrentTime) > 1 / 120) {
      storyVideoBack.currentTime = storyCurrentTime;
    }
    return;
  }

  storyCurrentTime += diff * 0.18;
  storyCurrentTime = Math.max(0, Math.min(storyBackDuration, storyCurrentTime));

  if (Math.abs(storyVideoBack.currentTime - storyCurrentTime) > 1 / 120) {
    storyVideoBack.currentTime = storyCurrentTime;
  }

  storyScrubFrame = window.requestAnimationFrame(tickStoryScrub);
}

function scheduleStoryScrub() {
  if (storyScrubFrame || reducedMotion.matches) return;
  storyScrubFrame = window.requestAnimationFrame(tickStoryScrub);
}

function updateParallax() {
  ticking = false;

  if (reducedMotion.matches) {
    leaves.left?.style.setProperty("--parallax-y", "0px");
    leaves.left?.style.setProperty("--parallax-x", "0px");
    leaves.right?.style.setProperty("--parallax-y", "0px");
    leaves.right?.style.setProperty("--parallax-x", "0px");
    projectsAccentShell?.style.setProperty("--projects-accent-shell-x", "0px");
    projectsAccentShell?.style.setProperty("--projects-accent-shell-y", "0px");
    projectsAccent?.style.setProperty("--projects-accent-x", "0px");
    projectsAccent?.style.setProperty("--projects-accent-y", "0px");
    projectMedia?.style.setProperty("--project-media-y", "0px");
    return;
  }

  const scrollY = window.scrollY;
  leaves.left?.style.setProperty("--parallax-y", `${scrollY * -0.28}px`);
  leaves.left?.style.setProperty("--parallax-x", `${scrollY * -0.06}px`);
  leaves.right?.style.setProperty("--parallax-y", `${scrollY * -0.48}px`);
  leaves.right?.style.setProperty("--parallax-x", `${scrollY * 0.08}px`);

  if (storySection && storyVideoBack && storyBackDuration > 0) {
    const rect = storySection.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    const progress = travel > 0 ? Math.max(0, Math.min(1, -rect.top / travel)) : 0;
    storyTargetTime = storyBackDuration * progress;
    scheduleStoryScrub();
  }

  if (projectsSection) {
    const rect = projectsSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
    const clamped = Math.max(0, Math.min(1, progress));
    const accentShellY = (clamped - 0.5) * -42;
    const accentShellX = (clamped - 0.5) * 16;
    const accentY = (clamped - 0.5) * -76;
    const accentX = (clamped - 0.5) * 22;
    const mediaY = (clamped - 0.5) * -28;

    projectsAccentShell?.style.setProperty("--projects-accent-shell-x", `${accentShellX}px`);
    projectsAccentShell?.style.setProperty("--projects-accent-shell-y", `${accentShellY}px`);
    projectsAccent?.style.setProperty("--projects-accent-x", `${accentX}px`);
    projectsAccent?.style.setProperty("--projects-accent-y", `${accentY}px`);
    projectMedia?.style.setProperty("--project-media-y", `${mediaY}px`);
  }

}

function onScroll() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateParallax);
}

window.addEventListener("scroll", onScroll, { passive: true });
reducedMotion.addEventListener("change", updateParallax);
window.addEventListener("resize", updateParallax);
updateParallax();
storyVideoBack?.pause();

function updateDirectScale() {
  if (!directCard || !directArtboard) return;

  const scale = Math.min(directCard.clientWidth / 660, directCard.clientHeight / 836);
  directArtboard.style.setProperty("--direct-scale", String(scale));
}

function syncThemeToggle() {
  if (!themeToggle) return;

  const isNight = body.classList.contains("is-night");
  themeToggle.setAttribute("aria-pressed", String(isNight));
  themeToggle.setAttribute(
    "aria-label",
    isNight ? "Revenir au mode jour" : "Activer le mode nuit",
  );

  if (themeToggleLabel) {
    themeToggleLabel.textContent = isNight ? "Mode jour" : "Mode nuit";
  }

  if (themeToggleIcon) {
    themeToggleIcon.textContent = isNight ? "light_mode" : "dark_mode";
  }
}

function swapDirectPhoto(targetSrc) {
  if (!directPhoto || directPhoto.getAttribute("src") === targetSrc) return;

  directPhoto.classList.add("is-swapping");

  const nextImage = new Image();
  nextImage.onload = () => {
    directPhoto.setAttribute("src", targetSrc);
    requestAnimationFrame(() => {
      directPhoto.classList.remove("is-swapping");
    });
  };
  nextImage.src = targetSrc;
}

function applyThemeState(isNight) {
  body.classList.toggle("is-night", isNight);

  if (directPhoto) {
    const targetSrc = isNight
      ? directPhoto.dataset.nightSrc
      : directPhoto.dataset.daySrc || "https://res.cloudinary.com/dgupuutfn/image/upload/v1780913983/room2_pihyox.png";
    swapDirectPhoto(targetSrc);
  }

  if (directVideo) {
    if (isNight) {
      const playPromise = directVideo.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
    } else {
      directVideo.pause();
    }
  }

  syncThemeToggle();
}

themeToggle?.addEventListener("click", () => {
  applyThemeState(!body.classList.contains("is-night"));
});

window.addEventListener("load", updateDirectScale);
window.addEventListener("resize", updateDirectScale);
updateDirectScale();
syncThemeToggle();
