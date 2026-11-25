/**
 * Parth Luvani Portfolio - Main JavaScript
 * Handles interactivity, animations, theme switching, project filtering, modal views, and form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Current Year in Footer
  // --------------------------------------------------------------------------
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. Dark / Light Theme Toggle
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('parth_theme');

  // Check saved theme or system preference
  if (storedTheme) {
    document.body.className = storedTheme;
  } else {
    // Default to dark theme for modern web designer aesthetic
    document.body.className = 'dark-theme';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (document.body.classList.contains('dark-theme')) {
        document.body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('parth_theme', 'light-theme');
      } else {
        document.body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('parth_theme', 'dark-theme');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      hamburgerBtn.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Header Shadow & ScrollSpy (Active Navigation Link)
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header scroll background
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
      }
    }

    // ScrollSpy active link tracking
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-list a[href*='${sectionId}']`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (activeLink) activeLink.classList.add('active');
      } else {
        if (activeLink) activeLink.classList.remove('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. Typing Effect in Hero Section
  // --------------------------------------------------------------------------
  const typingTextElement = document.getElementById('typing-text');
  if (typingTextElement) {
    const roles = [
      'Web Designer',
      'Front-End Developer',
      'WordPress Specialist',
      'UI/UX Enthusiast',
      'Responsive Web Creator'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 110;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Finished typing word, pause before deleting
        isDeleting = true;
        typingSpeed = 1600;
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next role
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
  }

  // --------------------------------------------------------------------------
  // 6. Number Counter Animation for Stats Bar
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function countUp(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, stepTime);
  }

  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statNumbers.forEach(stat => countUp(stat));
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const statsBar = document.querySelector('.hero-stats-bar');
    if (statsBar) {
      statsObserver.observe(statsBar);
    }
  }

  // --------------------------------------------------------------------------
  // 7. Skills Progress Bar Animation on Scroll
  // --------------------------------------------------------------------------
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  if (progressBars.length > 0) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-progress');
          bar.style.width = targetWidth;
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    progressBars.forEach(bar => skillsObserver.observe(bar));
  }

  // --------------------------------------------------------------------------
  // 8. Projects Filtering
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active filter button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategories = card.getAttribute('data-category');

          if (filterValue === 'all' || cardCategories.includes(filterValue)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Project Details Modal (Case Studies)
  // --------------------------------------------------------------------------
  const projectData = {
    'project-x': {
      title: 'Project X - Corporate Web Platform',
      category: 'Web Design & Front-End Architecture',
      overview: 'Project X is an enterprise-grade digital platform designed to provide an intuitive user journey for corporate stakeholders. As the lead front-end designer on this project, I translated design specifications into an ultra-responsive web environment.',
      responsibilities: [
        'Crafted mobile-first layouts using semantic HTML5 and modular CSS3 architecture.',
        'Collaborated with cross-functional development teams to guarantee technical feasibility.',
        'Integrated interactive JavaScript micro-animations to enhance user engagement.',
        'Optimized asset payloads, achieving a 45% reduction in initial page render time.'
      ],
      technologies: ['HTML5', 'CSS3 / Flexbox & Grid', 'JavaScript (ES6)', 'Responsive Web Design'],
      impact: 'Delivered an engaging digital presence that elevated brand perception and ensured seamless browsing across 100% of tested device viewports.'
    },
    'dislike': {
      title: 'Dislike - Creative Showcase App',
      category: 'Interactive Front-End & UI Design',
      overview: 'Dislike is a dynamic web showcase emphasizing playful user feedback loops, expressive visual micro-interactions, and instant client-side state responsiveness.',
      responsibilities: [
        'Designed custom UI components and state transitions without relying on heavy third-party UI libraries.',
        'Structured modular vanilla JavaScript modules for DOM manipulation and event delegation.',
        'Conducted rigorous cross-browser testing across Chrome, Safari, Edge, and mobile browsers.',
        'Fine-tuned CSS performance to eliminate layout recalculations and jank.'
      ],
      technologies: ['Vanilla JavaScript', 'CSS Keyframes & Transitions', 'UI/UX Wireframing'],
      impact: 'Achieved 60fps animations on both mobile and desktop screens with zero runtime dependencies.'
    },
    'project-y': {
      title: 'Project Y - Performance Business Hub',
      category: 'WordPress CMS & Back-End Scripting',
      overview: 'Project Y was engineered to handle high customer traffic while giving business administrators complete autonomy over dynamic content and product listings.',
      responsibilities: [
        'Architected custom WordPress templates using PHP, modular hooks, and custom post types.',
        'Designed normalized MySQL queries to expedite content retrieval for thousands of items.',
        'Implemented SEO best practices, structured JSON-LD schemas, and on-page optimization.',
        'Configured advanced caching and image compression for sub-second page loads.'
      ],
      technologies: ['WordPress', 'PHP 8', 'MySQL Database', 'SEO Optimization'],
      impact: 'Boosted organic search traffic by 35% within 90 days of rollout with 98+ Google Lighthouse mobile score.'
    },
    'wordpress-hub': {
      title: 'WordPress Multi-Client Showcase (25+ Deliveries)',
      category: 'CMS Platforms & Custom Themes',
      overview: 'Over two years of industry delivery, I have designed, configured, and deployed over 25 individual WordPress platforms spanning local businesses, corporate portals, and boutique brands.',
      responsibilities: [
        'End-to-end theme customization, responsive styling, and child theme maintenance.',
        'Integration of critical plugins (security, caching, contact forms, analytics, SEO).',
        'Database migration, staging-to-production deployment, and SSL configuration.',
        'Conducted client onboarding and delivered user-friendly administration guidelines.'
      ],
      technologies: ['WordPress', 'PHP', 'WooCommerce', 'Elementor & Gutenberg', 'Speed Optimization'],
      impact: 'Maintained a 100% client satisfaction record with zero critical post-launch downtime incidents.'
    },
    'portfolio-v1': {
      title: 'Parth Luvani Portfolio Website',
      category: 'Modern Web Engineering',
      overview: 'The portfolio website you are exploring right now! Built from scratch to highlight the harmony between clean design aesthetics and clean, accessible code.',
      responsibilities: [
        'Designed sleek dark and light color systems with CSS Custom Properties.',
        'Built accessible, semantic HTML5 structure with ARIA landmark attributes.',
        'Implemented dynamic typing animations, interactive filtering, and scroll animations using vanilla JS.',
        'Packaged with a downloadable verified resume and immediate contact points.'
      ],
      technologies: ['HTML5', 'CSS3 Variables', 'Vanilla JavaScript (ES6+)', 'Responsive Design'],
      impact: 'Scores 100/100 across accessibility, performance, and best practices with zero bloat.'
    },
    'seo-portal': {
      title: 'High-Conversion SEO Landing Page',
      category: 'Digital Marketing & Conversion Design',
      overview: 'A laser-focused landing page tailored for lead capture and maximum organic visibility, fusing graphic design fundamentals with marketing analytics.',
      responsibilities: [
        'Drafted clear visual hierarchy guiding users effortlessly toward call-to-action touchpoints.',
        'Optimized Core Web Vitals (LCP, FID, CLS) to maximize Google ranking factors.',
        'Integrated responsive lead forms with instant client-side validation.',
        'Conducted UX A/B layout experiments to identify high-converting layouts.'
      ],
      technologies: ['HTML5', 'CSS3', 'SEO & Analytics', 'UX Principles'],
      impact: 'Increased inquiry conversion rate by 28% compared to the legacy template.'
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data || !projectModal) return;

    modalTag.textContent = data.category;
    modalTitle.textContent = data.title;

    let techPills = data.technologies.map(t => `<span class="badge-pill" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">${t}</span>`).join(' ');
    let respList = data.responsibilities.map(r => `<li>${r}</li>`).join('');

    modalBody.innerHTML = `
      <p><strong>Overview:</strong> ${data.overview}</p>
      <h4>Key Responsibilities & Execution:</h4>
      <ul>${respList}</ul>
      <h4>Tech Stack:</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
        ${techPills}
      </div>
      <h4>Impact & Results:</h4>
      <p style="background: rgba(59, 130, 246, 0.08); padding: 0.85rem; border-left: 3px solid var(--accent-blue); border-radius: 4px;">
        ${data.impact}
      </p>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Attach modal trigger listeners
  document.querySelectorAll('.project-card').forEach(card => {
    const projectId = card.getAttribute('data-id');
    const viewButtons = card.querySelectorAll('.view-details-btn');

    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(projectId);
      });
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. Contact Form Interactive Validation & Submission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function checkField(input, condition) {
      const group = input.closest('.form-group');
      if (!condition) {
        group.classList.add('has-error');
        return false;
      } else {
        group.classList.remove('has-error');
        return true;
      }
    }

    // Input blur real-time validation
    nameInput.addEventListener('blur', () => checkField(nameInput, nameInput.value.trim().length > 1));
    emailInput.addEventListener('blur', () => checkField(emailInput, validateEmail(emailInput.value.trim())));
    subjectInput.addEventListener('blur', () => checkField(subjectInput, subjectInput.value.trim().length > 2));
    messageInput.addEventListener('blur', () => checkField(messageInput, messageInput.value.trim().length > 5));

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = checkField(nameInput, nameInput.value.trim().length > 1);
      const isEmailValid = checkField(emailInput, validateEmail(emailInput.value.trim()));
      const isSubjectValid = checkField(subjectInput, subjectInput.value.trim().length > 2);
      const isMessageValid = checkField(messageInput, messageInput.value.trim().length > 5);

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        // Simulate sending state
        submitBtn.disabled = true;
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;

          // Show success message
          if (formSuccess) {
            formSuccess.classList.add('show');
            contactForm.reset();

            // Auto-hide success message after 7 seconds
            setTimeout(() => {
              formSuccess.classList.remove('show');
            }, 7000);
          }
        }, 1200);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 11. Smooth Scrolling for Internal Links
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

});
