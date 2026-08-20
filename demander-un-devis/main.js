const form = document.getElementById("quote-form");
const nextButton = document.getElementById("next-step");
const prevButton = document.getElementById("prev-step");
const budgetInput = document.getElementById("budget-input");
const emailInput = document.getElementById("email-input");
const success = document.getElementById("quote-success");
const stepOne = document.querySelector('[data-step="1"]');
const stepTwo = document.querySelector('[data-step="2"]');
const quoteCarousel = document.getElementById("quote-carousel");
const quoteGallery = document.querySelector(".quote-gallery");
const halo = document.querySelector(".quote-gallery__halo");
const videos = document.querySelectorAll("video");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function formatBudgetInput(value) {
  const digits = value.replace(/[^\d]/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function transitionStep(fromStep, toStep) {
  if (!fromStep || !toStep || fromStep === toStep) return;

  fromStep.classList.add("is-leaving");

  window.setTimeout(() => {
    fromStep.hidden = true;
    fromStep.classList.remove("is-leaving", "is-active");
    toStep.hidden = false;
    toStep.classList.add("is-entering");

    requestAnimationFrame(() => {
      toStep.classList.add("is-active");
      toStep.classList.remove("is-entering");
    });
  }, prefersReducedMotion.matches ? 0 : 260);
}

function goToStep(step) {
  const isStepOne = step === 1;
  transitionStep(isStepOne ? stepTwo : stepOne, isStepOne ? stepOne : stepTwo);

  if (isStepOne) {
    window.setTimeout(() => budgetInput?.focus(), prefersReducedMotion.matches ? 0 : 180);
  } else {
    window.setTimeout(() => emailInput?.focus(), prefersReducedMotion.matches ? 0 : 180);
  }
}

budgetInput?.addEventListener("input", (event) => {
  const input = event.currentTarget;
  input.value = formatBudgetInput(input.value);
});

nextButton?.addEventListener("click", () => {
  const value = budgetInput?.value.replace(/\s/g, "") || "";
  if (value.length < 3) {
    budgetInput?.focus();
    return;
  }
  goToStep(2);
});

prevButton?.addEventListener("click", () => {
  goToStep(1);
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = emailInput?.value.trim() || "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailInput?.focus();
    return;
  }

  stepTwo.classList.add("is-leaving");

  window.setTimeout(() => {
    stepOne.hidden = true;
    stepTwo.hidden = true;
    success.hidden = false;
    success.classList.add("is-active");
  }, prefersReducedMotion.matches ? 0 : 260);
});

function updateGalleryMotion(event) {
  if (!quoteCarousel || prefersReducedMotion.matches) return;

  const rect = quoteGallery?.getBoundingClientRect();
  if (!rect) return;

  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;

  quoteCarousel.style.transform =
    `perspective(1200px) rotateY(${(-14 + px * 8).toFixed(2)}deg) rotateX(${(6 + py * -5).toFixed(2)}deg) translate3d(${(px * 10).toFixed(2)}px, ${(py * -8).toFixed(2)}px, 0)`;
  halo?.style.setProperty("--halo-x", `${px * 18}px`);
  halo?.style.setProperty("--halo-y", `${py * -20}px`);
}

function resetGalleryMotion() {
  if (!quoteCarousel) return;
  quoteCarousel.style.transform = "perspective(1200px) rotateY(-14deg) rotateX(6deg)";
  halo?.style.setProperty("--halo-x", "0px");
  halo?.style.setProperty("--halo-y", "0px");
}

quoteGallery?.addEventListener("pointermove", updateGalleryMotion);
quoteGallery?.addEventListener("pointerleave", resetGalleryMotion);

window.addEventListener("load", () => {
  videos.forEach((video) => {
    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  });
  requestAnimationFrame(() => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
  });
});

budgetInput?.focus();
