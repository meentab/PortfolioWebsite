// Simple starter script
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header h1");
  if (header) {
    header.insertAdjacentHTML(
      "beforeend",
      ' <span class="muted" aria-hidden="true">• Ready</span>'
    );
  }
  // Expose a tiny helper for quick testing in devtools
  window.appInfo = () => ({ initializedAt: new Date().toISOString() });

  // Contact form handler
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = form.querySelector(".form-status");
      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const subject = form.querySelector("#subject");
      const message = form.querySelector("#message");

      const errors = {};
      const setError = (field, msg) => {
        const el = form.querySelector(`.field-error[data-for="${field}"]`);
        if (el) el.textContent = msg || "";
      };

      setError("name");
      setError("email");
      setError("subject");
      setError("message");

      if (!name.value.trim()) errors.name = "Please enter your name.";
      if (!email.value.trim()) {
        errors.email = "Please enter your email.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = "Please enter a valid email.";
      }
      if (!subject.value.trim()) errors.subject = "Please enter a subject.";
      if (!message.value.trim()) errors.message = "Please enter a message.";

      Object.entries(errors).forEach(([field, msg]) => setError(field, msg));

      if (Object.keys(errors).length > 0) {
        if (status) status.textContent = "";
        return;
      }

      if (status) status.textContent = "";
      alert("Thank you for your message!");
      console.log("Contact form submission:", {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value,
      });
      form.reset();
    });
  }

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Reveal on scroll for project cards
  const revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealables.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show immediately
    revealables.forEach((el) => el.classList.add('in-view'));
  }

  // Tilt-on-hover for project cards
  const cards = document.querySelectorAll('.project-card');
  const maxTiltDeg = 1.5;
  const damp = 40; // lower = snappier
  cards.forEach((card) => {
    let currentRx = 0, currentRy = 0, targetRx = 0, targetRy = 0, raf;

    const animate = () => {
      currentRx += (targetRx - currentRx) / damp;
      currentRy += (targetRy - currentRy) / damp;
      card.style.transform = `rotateX(${currentRx}deg) rotateY(${currentRy}deg)`;
      raf = requestAnimationFrame(animate);
    };

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      targetRy = (px - 0.5) * maxTiltDeg * 2; // left/right
      targetRx = -(py - 0.5) * maxTiltDeg * 2; // up/down
      if (!raf) animate();
    };

    const reset = () => {
      targetRx = 0; targetRy = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        animate();
        setTimeout(() => { cancelAnimationFrame(raf); raf = undefined; }, 200);
      });
    };

    card.addEventListener('mouseenter', () => { card.style.willChange = 'transform'; });
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
    card.addEventListener('touchstart', (e) => onMove(e.touches[0]));
    card.addEventListener('touchmove', (e) => onMove(e.touches[0]));
    card.addEventListener('touchend', reset);
  });

  // Typing animation in hero subtitle
  const typeTarget = document.getElementById('type-target');
  if (typeTarget) {
    const words = ["Software QA", "Designer", "Creator"];
    const typeDelay = 95; // ms per char
    const eraseDelay = 70;
    const wordHold = 1000;
    let wordIndex = 0;
    let charIndex = 0;
    let isErasing = false;

    const tick = () => {
      const current = words[wordIndex];
      if (!isErasing) {
        typeTarget.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isErasing = true;
          setTimeout(tick, wordHold);
          return;
        }
        setTimeout(tick, typeDelay);
      } else {
        typeTarget.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isErasing = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, typeDelay);
          return;
        }
        setTimeout(tick, eraseDelay);
      }
    };
    tick();
  }
});


