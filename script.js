/* ===================================================
   TANYA'S BIRTHDAY — SCRIPT
   Handles: landing, slideshow, particles, letter modal, music
   =================================================== */

(function () {
  'use strict';

  // ============================================================
  // CONFIG — UPDATE THIS ARRAY WITH YOUR IMAGE FILENAMES
  // Place your images inside the "images/" folder next to index.html
  // Supported formats: .webp, .jpg, .jpeg, .png
  // ============================================================
  const IMAGE_FILES = [
    'images/1.jpeg',
    'images/2.jpeg',
    'images/3.jpeg',
    'images/4.jpeg',
    'images/5.jpeg',
    'images/6.jpeg',
    'images/7.jpeg',
    'images/8.jpeg',
  ];

  // Slideshow speed — seconds per full cycle of all images
  const SLIDESHOW_SPEED_SECONDS_PER_IMAGE = 12;

  // Landing screen duration before fade (ms)
  const LANDING_DURATION = 3000;

  // ============================================================
  // ELEMENTS
  // ============================================================
  const landing = document.getElementById('landing');
  const main = document.getElementById('main');
  const slideshowTrack = document.getElementById('slideshowTrack');
  const letterBox = document.getElementById('letterBox');
  const modalOverlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const musicBtn = document.getElementById('musicBtn');
  const musicIcon = document.getElementById('musicIcon');
  const musicLabel = document.getElementById('musicLabel');
  const bgMusic = document.getElementById('bgMusic');
  const particlesCanvas = document.getElementById('particlesCanvas');

  // ============================================================
  // LANDING → MAIN TRANSITION
  // ============================================================
  let landingDismissed = false;

  function dismissLanding() {
    if (landingDismissed) return;
    landingDismissed = true;

    landing.classList.add('fade-out');
    main.classList.add('visible');

    // Show letter box after a slight delay
    setTimeout(() => {
      letterBox.classList.add('visible');
    }, 600);

    // Show music button
    setTimeout(() => {
      musicBtn.classList.add('visible');
    }, 800);

    // Remove landing from DOM after transition
    setTimeout(() => {
      landing.style.display = 'none';
    }, 1800);
  }

  setTimeout(dismissLanding, LANDING_DURATION);
  landing.addEventListener('click', dismissLanding);

  // ============================================================
  // SLIDESHOW — INFINITE HORIZONTAL SCROLL
  // ============================================================
  function initSlideshow() {
    if (IMAGE_FILES.length === 0) {
      document.querySelector('.slideshow').style.background =
        'linear-gradient(135deg, #f5d5d5 0%, #fce4ec 50%, #f5f0e8 100%)';
      return;
    }

    // Duplicate for seamless loop
    const allImages = [...IMAGE_FILES, ...IMAGE_FILES];
    const fragment = document.createDocumentFragment();

    allImages.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Memory ${(i % IMAGE_FILES.length) + 1}`;
      img.loading = i < IMAGE_FILES.length ? 'eager' : 'lazy';
      img.decoding = 'async';
      fragment.appendChild(img);
    });

    slideshowTrack.appendChild(fragment);

    const totalDuration = IMAGE_FILES.length * SLIDESHOW_SPEED_SECONDS_PER_IMAGE;
    slideshowTrack.style.animation =
      `slideshow ${totalDuration}s linear infinite`;
  }

  initSlideshow();

  // ============================================================
  // FLOATING PARTICLES — Subtle texture layer
  // ============================================================
  function initParticles() {
    const ctx = particlesCanvas.getContext('2d');
    let width, height;
    const particles = [];
    const PARTICLE_COUNT = 40;

    function resize() {
      width = particlesCanvas.width = window.innerWidth;
      height = particlesCanvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Create particles with varied shapes
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2 - 0.1,
        opacity: Math.random() * 0.08 + 0.02,
        // 0 = circle, 1 = diamond, 2 = tiny line
        shape: Math.floor(Math.random() * 3),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        // Update
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Wrap around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = '#f5e6e0';

        if (p.shape === 0) {
          // Circle
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 1) {
          // Diamond
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.6, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.6, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          // Tiny line
          ctx.strokeStyle = '#f5e6e0';
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = p.opacity * 0.6;
          ctx.beginPath();
          ctx.moveTo(-p.size * 1.5, 0);
          ctx.lineTo(p.size * 1.5, 0);
          ctx.stroke();
        }

        ctx.restore();
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

  initParticles();

  // ============================================================
  // LETTER MODAL — Open / Close
  // ============================================================
  function openModal() {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  letterBox.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);

  // Close on overlay click (outside the letter)
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // ============================================================
  // MUSIC — Background audio control
  // ============================================================
  let isPlaying = false;

  // Set low volume
  bgMusic.volume = 0.3;

  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicIcon.textContent = '♪';
      musicLabel.textContent = 'Play Music';
      musicBtn.classList.remove('playing');
    } else {
      bgMusic.play().catch(() => {
        // Autoplay blocked — user interaction already given via click
      });
      musicIcon.textContent = '♫';
      musicLabel.textContent = 'Pause';
      musicBtn.classList.add('playing');
    }
    isPlaying = !isPlaying;
  });

  // ============================================================
  // PARALLAX — Subtle mouse-follow on letter box (desktop only)
  // ============================================================
  let parallaxEnabled = !window.matchMedia('(max-width: 768px)').matches;

  if (parallaxEnabled) {
    document.addEventListener('mousemove', (e) => {
      if (letterBox.classList.contains('visible') && !modalOverlay.classList.contains('open')) {
        const x = (e.clientX / window.innerWidth - 0.5) * 6;
        const y = (e.clientY / window.innerHeight - 0.5) * 4;
        letterBox.style.transform = `translate(${x}px, ${y}px)`;
      }
    });
  }

  window.addEventListener('resize', () => {
    parallaxEnabled = !window.matchMedia('(max-width: 768px)').matches;
    if (!parallaxEnabled) {
      letterBox.style.transform = '';
    }
  });

})();
