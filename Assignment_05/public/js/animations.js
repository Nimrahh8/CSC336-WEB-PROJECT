// animations.js - Parallax and animation effects

// Parallax Animations for Hero & Residents
window.addEventListener("scroll", () => {
  const windowHeight = window.innerHeight;

  // HERO IMAGE
  const hero = document.querySelector(".hero-section");
  const heroImg = document.querySelector(".hero-bg");
  if (hero && heroImg) {
    const heroTop = hero.getBoundingClientRect().top;
    const heroVisible = heroTop < windowHeight && heroTop > -windowHeight;
    if (heroVisible) {
      heroImg.style.transform = `translateY(${heroTop * -0.9}px)`;
    }
  }

  // RESIDENT 1 IMAGE
  const resident1 = document.querySelector(".resident-1");
  const resident1Img = document.querySelector(".resident-1 .resident-image.full-image img");
  if (resident1 && resident1Img) {
    const rect1 = resident1.getBoundingClientRect();
    const visible1 = rect1.top < windowHeight && rect1.bottom > 0;
    if (visible1) {
      resident1Img.style.transform = `translateY(${rect1.top * -1.2}px)`;
    }
  }

  // RESIDENT 2 IMAGE
  const resident2 = document.querySelector(".resident-2");
  const resident2Img = document.querySelector(".resident-2 .resident-image.full-image img");
  if (resident2 && resident2Img) {
    const rect2 = resident2.getBoundingClientRect();
    const visible2 = rect2.top < windowHeight && rect2.bottom > 0;
    if (visible2) {
      resident2Img.style.transform = `translateY(${rect2.top * -1.2}px)`;
    }
  }
});

// Staggered Animation for Promotions
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    const cards = document.querySelectorAll('.drink-card');
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('show');
      }, i * 100);
    });
  }, 1000);
});