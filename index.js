const sections = document.querySelectorAll("main section.page");
const headerNav = document.querySelector("header nav");
const canvas = document.getElementById("header-cv");
const ctx = canvas?.getContext("2d");

function getImageElement() {
  const image = document.getElementById("$cryptface");
  if (image) return image;
  const fallback = new Image();
  fallback.src = "$crypt.png";
  return fallback;
}

class Cell {
  constructor(effect, x, y, index) {
    this.effect = effect;
    this.x = x;
    this.y = y;
    this.index = index;
    this.speedX = 0;
    this.speedY = 0;
    this.posX = this.effect.width * (Math.random() * 4 - 2);
    this.posY = this.effect.height * (Math.random() * 4 - 2);
    this.width = this.effect.cellWidth;
    this.height = this.effect.cellHeight;
    this.slideX =
      Math.random() * this.effect.cellWidth * 2 - this.effect.cellWidth;
    this.slideY =
      Math.random() * this.effect.cellHeight * 2 - this.effect.cellHeight;
    this.image = getImageElement();
    this.vx = 0;
    this.vy = 0;
    this.ease = 0.01 + Math.random() * 0.02;
    this.friction = 0.8 + Math.random() * 0.06;
    this.randomize = Math.random() * 60 + 20;
    this.delay = Math.random() * 200;
    setTimeout(() => {
      this.start();
    }, this.delay);
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.x + this.slideX,
      this.y + this.slideY,
      this.width,
      this.height,
      this.posX,
      this.posY,
      this.width,
      this.height,
    );
  }

  start() {
    this.speedX = (this.x - this.posX) / this.randomize;
    this.speedY = (this.y - this.posY) / this.randomize;
  }

  update() {
    if (Math.abs(this.speedX) > 0.01 || Math.abs(this.speedY) > 0.01) {
      this.speedX = (this.x - this.posX) / this.randomize;
      this.speedY = (this.y - this.posY) / this.randomize;
      this.posX += this.speedX;
      this.posY += this.speedY;
    }

    const dx = this.effect.mouse.x - this.x;
    const dy = this.effect.mouse.y - this.y;
    const distance = Math.hypot(dx, dy);
    if (distance < this.effect.mouse.radius) {
      const angle = Math.atan2(dy, dx);
      const force = distance / this.effect.mouse.radius;
      this.vx = force * Math.cos(angle) * (4 + Math.random() * 2);
      this.vy = force * Math.sin(angle) * (4 + Math.random() * 2);
    } else {
      this.vx = 0;
      this.vy = 0;
    }

    this.slideX += (this.vx *= this.friction) - this.slideX * this.ease;
    this.slideY += (this.vy *= this.friction) - this.slideY * this.ease;
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cellWidth = this.width / (25 + Math.random() * 10);
    this.cellHeight = this.height / (35 + Math.random() * 15);
    this.imageGrid = [];
    this.createGrid();
    this.mouse = {
      x: undefined,
      y: undefined,
      radius: 40 + Math.random() * 20,
    };
    this.canvas.addEventListener("mousemove", (event) => {
      this.mouse.x = event.offsetX;
      this.mouse.y = event.offsetY;
    });
    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.x = undefined;
      this.mouse.y = undefined;
    });
  }

  createGrid() {
    let index = 0;
    for (let y = 0; y < this.height; y += this.cellHeight) {
      for (let x = 0; x < this.width; x += this.cellWidth) {
        index++;
        this.imageGrid.push(new Cell(this, x, y, index));
      }
    }
  }

  render(context) {
    this.imageGrid.forEach((cell) => {
      cell.draw(context);
    });
  }
}

function initializeCanvasEffect() {
  if (!canvas || !ctx) return;
  canvas.width = 300;
  canvas.height = 300;

  const effect = new Effect(canvas);
  canvas.dataset.activeEffect = "RandomizedGridDistortion";

  function animateCanvas() {
    effect.imageGrid.forEach((cell) => {
      cell.update();
    });
    effect.render(ctx);
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
}

initializeCanvasEffect();

if (headerNav) {
  const effect = new Effect(canvas);
  canvas.dataset.activeEffect = "RandomizedGridDistortion";

  function animateCanvas() {
    effect.imageGrid.forEach((cell) => {
      cell.update();
    });
    effect.render(ctx);
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
}

initializeCanvasEffect();

if (headerNav) {
  sections.forEach((section) => {
    const sectionNav = headerNav.cloneNode(true);
    sectionNav.classList.add("section-nav");
    sectionNav.style.display = "";
    section.prepend(sectionNav);
  });
}

const setActiveSection = (pageId) => {
  const active = document.getElementById(pageId);
  if (!active) {
    window.location.hash = "#Top";
    return;
  }

  sections.forEach((section) => {
    section.classList.toggle("active", section === active);
  });

  document.title = `$crypt - ${pageId === "Top" ? "Home" : pageId}`;
  window.scrollTo({ top: 0, behavior: "auto" });
};

const navigateToHash = () => {
  const hash = window.location.hash.replace("#", "") || "Top";
  setActiveSection(hash);
};

window.addEventListener("hashchange", navigateToHash);
window.addEventListener("DOMContentLoaded", navigateToHash);

document.addEventListener("click", (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;

  const target = anchor.getAttribute("href").replace("#", "");
  if (!target) return;

  event.preventDefault();
  window.location.hash = `#${target}`;
});
