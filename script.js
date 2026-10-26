(function () {
  "use strict";

  const avatar = document.querySelector(".headline__avatar");
  const layers = avatar.querySelectorAll("img");
  let front = layers[0];
  let back = layers[1];
  const images = [
    "images/pp copy.png",
    "images/pp_2024 copy.JPG",
    "images/00469_9A copy.jpg",
    "images/IMG_7216 copy.JPG",
    "images/1c2c2b7f-2e44-4c5e-96ff-5cd05eefba95 copy.JPG",
    "images/IMG_4707 1.png",
    "images/IMG_6575 2 1.png",
  ];
  let current = 0;

  images.forEach((src) => {
    new Image().src = src;
  });

  function nextImage() {
    current = (current + 1) % images.length;

    front.className = "is-under";

    // Reset the incoming layer to transparent without animating, then fade it in
    back.className = "";
    back.style.transition = "none";
    back.src = images[current];
    void back.offsetWidth;
    back.style.transition = "";
    back.className = "is-top";

    [front, back] = [back, front];
  }

  // Mouse: change on hover. Touch: change on tap (a tap would also fire
  // emulated mouse events, so the two paths are kept apart by pointer type).
  const isMouse = (e) => e.pointerType === "mouse";
  avatar.addEventListener("pointerenter", (e) => {
    if (isMouse(e)) nextImage();
  });
  avatar.addEventListener("click", (e) => {
    if (!isMouse(e)) nextImage();
  });

  // Heart: on touch, a tap toggles the "hover" state and it stays on
  const heart = document.querySelector(".headline__heart");
  heart.addEventListener("click", (e) => {
    if (isMouse(e)) return;
    const on = heart.classList.toggle("is-active");
    heart.setAttribute("aria-pressed", String(on));
  });
})();

/* Magnetic dot grid */
(function () {
  "use strict";

  const canvas = document.querySelector(".dots");
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const COLOR = "#ceb6b5";
  const SPACING = 28;
  const RADIUS = 1.4;
  const REACH = 150; // how far the cursor's pull extends
  const PULL = 9; // max px a dot travels toward the cursor
  const EASE = 0.14;

  const pointer = { x: -9999, y: -9999 };
  let dots = [];
  let width = 0;
  let height = 0;
  let running = false;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    dots = [];
    const cols = Math.ceil(width / SPACING) + 1;
    const rows = Math.ceil(height / SPACING) + 1;
    const offsetX = (width - (cols - 1) * SPACING) / 2;
    const offsetY = (height - (rows - 1) * SPACING) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: offsetX + c * SPACING,
          y: offsetY + r * SPACING,
          dx: 0,
          dy: 0,
        });
      }
    }
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = COLOR;
    ctx.beginPath();
    for (const d of dots) {
      ctx.moveTo(d.x + d.dx + RADIUS, d.y + d.dy);
      ctx.arc(d.x + d.dx, d.y + d.dy, RADIUS, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  function step() {
    let moving = false;
    for (const d of dots) {
      let tx = 0;
      let ty = 0;
      const vx = pointer.x - d.x;
      const vy = pointer.y - d.y;
      const dist = Math.hypot(vx, vy);
      if (dist < REACH && dist > 0) {
        const falloff = 1 - dist / REACH;
        const pull = Math.min(PULL * falloff * falloff, dist);
        tx = (vx / dist) * pull;
        ty = (vy / dist) * pull;
      }
      d.dx += (tx - d.dx) * EASE;
      d.dy += (ty - d.dy) * EASE;
      if (Math.abs(tx - d.dx) > 0.01 || Math.abs(ty - d.dy) > 0.01) {
        moving = true;
      }
    }
    draw();
    if (moving) {
      requestAnimationFrame(step);
    } else {
      running = false;
    }
  }

  function wake() {
    if (!running) {
      running = true;
      requestAnimationFrame(step);
    }
  }

  window.addEventListener("resize", resize);
  resize();

  if (!prefersReducedMotion) {
    window.addEventListener("pointermove", (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      wake();
    });
    document.documentElement.addEventListener("pointerleave", () => {
      pointer.x = pointer.y = -9999;
      wake();
    });
  }
})();

/* Copy email */
(function () {
  "use strict";

  const button = document.getElementById("copy-email");
  const toast = document.getElementById("toast");
  let timer;

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Clipboard API unavailable (e.g. insecure context): fall back to execCommand
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (e) {}
      field.remove();
      return ok;
    }
  }

  button.addEventListener("click", async () => {
    if (!(await copyText(button.dataset.email))) return;
    toast.textContent = `copied "${button.dataset.email}"`;
    toast.classList.add("is-visible");
    clearTimeout(timer);
    timer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  });
})();
