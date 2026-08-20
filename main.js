const body = document.body;
const burger = document.querySelector(".burger");
const menu = document.getElementById("mobile-menu");
const menuInner = document.querySelector(".menu__inner");
const menuLinks = document.querySelectorAll(".menu a");
const leaves = {
  left: document.querySelector(".leaf--left"),
  right: document.querySelector(".leaf--right"),
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setMenuState(isOpen) {
  body.classList.toggle("is-open", isOpen);
  burger?.setAttribute("aria-expanded", String(isOpen));
  burger?.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

  if (!isOpen) {
    burger?.focus();
  }
}

function closeMenu({ restoreFocus = false } = {}) {
  body.classList.remove("is-open");
  burger?.setAttribute("aria-expanded", "false");
  burger?.setAttribute("aria-label", "Open menu");

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

function updateParallax() {
  ticking = false;

  if (reducedMotion.matches) {
    leaves.left?.style.setProperty("--parallax-y", "0px");
    leaves.left?.style.setProperty("--parallax-x", "0px");
    leaves.right?.style.setProperty("--parallax-y", "0px");
    leaves.right?.style.setProperty("--parallax-x", "0px");
    return;
  }

  const scrollY = window.scrollY;
  leaves.left?.style.setProperty("--parallax-y", `${scrollY * -0.28}px`);
  leaves.left?.style.setProperty("--parallax-x", `${scrollY * -0.06}px`);
  leaves.right?.style.setProperty("--parallax-y", `${scrollY * -0.48}px`);
  leaves.right?.style.setProperty("--parallax-x", `${scrollY * 0.08}px`);
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateParallax);
}

window.addEventListener("scroll", onScroll, { passive: true });
reducedMotion.addEventListener("change", updateParallax);
updateParallax();
