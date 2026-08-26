/**
 * ACTUAL ACCOUNTING - Main Interactive Application Logic
 * Vanilla JavaScript implementation for navigation, header, widgets, and UI states.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderScroll();
  initActiveNavLink();
  initBackToTop();
  initFAQAccordion();
  initChartToggle();
  initServiceFilters();
  initFamilyVentures();
});

/* --- Mobile Navigation Drawer --- */
function initNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (!mobileToggle || !mainNav) return;

  // Create mobile backdrop if not present
  let backdrop = document.querySelector('.mobile-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-backdrop';
    document.body.appendChild(backdrop);
  }

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !mainNav.classList.contains('active');
    if (isOpen) {
      mainNav.classList.add('active');
      backdrop.classList.add('active');
      mobileToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mainNav.classList.remove('active');
      backdrop.classList.remove('active');
      mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  mobileToggle.addEventListener('click', () => toggleMenu());
  backdrop.addEventListener('click', () => toggleMenu(false));

  // Close nav on ESC key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  // Close mobile menu when clicking nav links
  const navLinks = mainNav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/* --- Sticky Header Scroll Behavior --- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --- Highlight Active Navigation Link --- */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- Back To Top Floating Button --- */
function initBackToTop() {
  let btn = document.querySelector('.back-to-top');
  
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --- FAQ Accordions --- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-question');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close other accordion items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const content = other.querySelector('.faq-answer');
        if (content) content.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* --- Interactive Chart Toggle (Hero / Financial Visuals) --- */
function initChartToggle() {
  const toggleBtns = document.querySelectorAll('[data-chart-toggle]');
  const chartBars = document.querySelectorAll('.bar-fill');
  
  if (!toggleBtns.length || !chartBars.length) return;

  const dataset = {
    revenue: [65, 80, 72, 90, 85, 95, 100],
    tax: [45, 55, 60, 65, 70, 75, 82]
  };

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('btn-primary', 'active'));
      toggleBtns.forEach(b => b.classList.add('btn-secondary'));
      
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary', 'active');

      const mode = btn.getAttribute('data-chart-toggle');
      const heights = dataset[mode] || dataset.revenue;

      chartBars.forEach((bar, index) => {
        if (heights[index] !== undefined) {
          bar.style.height = heights[index] + '%';
        }
      });
    });
  });
}

/* --- Service Category Filtering (services.html) --- */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const serviceCards = document.querySelectorAll('[data-category]');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-secondary'));

      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary', 'active');

      const filterVal = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
        }
      });
    });
  });
}

/* --- ACTUAL Family Interactive Ventures --- */
function initFamilyVentures() {
  const familyCards = document.querySelectorAll('.family-card');
  familyCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.family-icon i');
      if (icon) {
        icon.style.transform = 'scale(1.2) rotate(6deg)';
        icon.style.transition = 'transform 0.3s ease';
      }
    });
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.family-icon i');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });
}
/* ===== ACTUAL FAMILY PAGE ===== */

// Family card hover effect
document.querySelectorAll('.family-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.classList.add('family-active');
  });

  card.addEventListener('mouseleave', () => {
    card.classList.remove('family-active');
  });
});

// Smooth scroll for family page links
document.querySelectorAll('#page-family a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Family page loaded
document.addEventListener('DOMContentLoaded', () => {
  const familyPage = document.querySelector('#page-family');

  if (familyPage) {
    familyPage.classList.add('family-ready');
  }
});