/**
 * Rifat Akhter - Portfolio Scripts
 * Handles Navigation, Filtering, Modals, Lightbox, and Form Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Set Current Year in Footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. ScrollSpy: Highlight active navigation link during scrolling
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Show/hide Back to Top button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.4';
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // 4. Certifications Filter
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      certCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Close modals & drawer with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCertModal();
      toggleDrawer(false);
    }
  });
});

// Toggle Off-Canvas Side Menu Drawer
function toggleDrawer(open) {
  const drawer = document.getElementById('sideDrawer');
  if (drawer) {
    if (typeof open === 'boolean') {
      drawer.classList.toggle('open', open);
    } else {
      drawer.classList.toggle('open');
    }
    const isOpen = drawer.classList.contains('open');
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }
}

// Scroll to Top Smoothly
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// -------------------------------------------------------------
// CERTIFICATE & MEDIA MODAL PREVIEW
// -------------------------------------------------------------
function openCertModal(title, issuer, imgSrc, credentialId, verifyUrl) {
  const modal = document.getElementById('certModal');
  const titleEl = document.getElementById('modalCertTitle');
  const issuerEl = document.getElementById('modalCertIssuer');
  const imgEl = document.getElementById('modalCertImg');
  const credEl = document.getElementById('modalCertCredential');
  const verifyLink = document.getElementById('modalCertVerifyLink');

  if (titleEl) titleEl.textContent = title;
  if (issuerEl) issuerEl.textContent = issuer;
  if (imgEl) {
    imgEl.src = imgSrc;
    imgEl.alt = `${title} Preview`;
  }
  if (credEl) {
    credEl.textContent = credentialId ? `Credential ID: ${credentialId}` : 'Verified Portfolio Media';
  }
  if (verifyLink) {
    if (verifyUrl && verifyUrl.startsWith('http')) {
      verifyLink.href = verifyUrl;
      verifyLink.target = '_blank';
      verifyLink.rel = 'noopener noreferrer';
      verifyLink.removeAttribute('download');
      verifyLink.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i> Verify Credential Online';
    } else {
      verifyLink.href = 'Md. Rifat Akter cv.pdf';
      verifyLink.setAttribute('download', 'Md. Rifat Akter cv.pdf');
      verifyLink.removeAttribute('target');
      verifyLink.removeAttribute('rel');
      verifyLink.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Download in Official CV';
    }
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

function closeCertModal() {
  const modal = document.getElementById('certModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}



// -------------------------------------------------------------
// CONTACT FORM HANDLER
// -------------------------------------------------------------
function handleFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const subjectInput = document.getElementById('userSubject');
  const messageInput = document.getElementById('userMessage');
  const submitBtn = document.getElementById('submitBtn');
  const alertBox = document.getElementById('formAlert');

  if (!nameInput || !emailInput || !messageInput || !alertBox) return;

  const originalBtnHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';

  // Simulate network request or send via Formspree / EmailJS
  setTimeout(() => {
    alertBox.className = 'form-alert success';
    alertBox.innerHTML = `
      <i class="fa-solid fa-circle-check"></i> Thank you, <strong>${escapeHtml(nameInput.value)}</strong>! 
      Your message has been received. I will reply to you at <strong>${escapeHtml(emailInput.value)}</strong> shortly.
    `;

    // Reset Form
    document.getElementById('contactForm').reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHtml;

    // Hide alert after 8 seconds
    setTimeout(() => {
      alertBox.className = 'form-alert';
      alertBox.innerHTML = '';
    }, 8000);
  }, 900);
}

// Helper function to sanitize input strings
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
