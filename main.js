/* ============================================================
   MJclemente Portfolio — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar: shadow on scroll ──────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Mobile menu toggle ────────────────────────────────────
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  // ── Contact form: intercept + show confirmation ───────────
  const form = document.querySelector('.contact-form');
  const formSuccess = document.querySelector('.form-success');
  if (form && formSuccess) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      formSuccess.classList.add('show');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ── Smooth scroll for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Lightbox for case study images ───────────────────────
  const caseImages = document.querySelectorAll('.case-section img');
  if (caseImages.length > 0) {
    // Create lightbox DOM
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML = `
      <button class="lightbox__close" aria-label="Cerrar">&times;</button>
      <img class="lightbox__img" src="" alt="" />
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.lightbox__img');
    const lbClose = lightbox.querySelector('.lightbox__close');
    let scale = 1;
    let zoomed = false;

    const openLightbox = (src, alt) => {
      lbImg.src = src;
      lbImg.alt = alt || '';
      scale = 1;
      zoomed = false;
      lbImg.style.transform = 'scale(1)';
      lbImg.style.cursor = 'zoom-in';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      scale = 1;
      lbImg.style.transform = 'scale(1)';
    };

    caseImages.forEach(img => {
      img.addEventListener('click', () => openLightbox(img.src, img.alt));
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Click image to toggle zoom
    lbImg.addEventListener('click', () => {
      zoomed = !zoomed;
      scale = zoomed ? 2.2 : 1;
      lbImg.style.transform = `scale(${scale})`;
      lbImg.style.cursor = zoomed ? 'zoom-out' : 'zoom-in';
    });

    // Scroll wheel zoom
    lbImg.addEventListener('wheel', (e) => {
      e.preventDefault();
      scale = Math.min(Math.max(scale - e.deltaY * 0.002, 1), 4);
      zoomed = scale > 1;
      lbImg.style.transform = `scale(${scale})`;
      lbImg.style.cursor = zoomed ? 'zoom-out' : 'zoom-in';
    }, { passive: false });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // ── Active nav link highlight ─────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link, .navbar__mobile .navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.style.color = 'var(--green-dark)';
    }
  });

});
