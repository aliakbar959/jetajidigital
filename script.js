/* ═══════════════════════════════════════════════════════
   JETAJI DIGITAL — script.js
═══════════════════════════════════════════════════════ */

'use strict';

/* ── WhatsApp number (without + or spaces) ── */
const WA_NUMBER = '918306455053';

/* ── DOM refs ── */
const mainNav      = document.getElementById('main-nav');
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu   = document.getElementById('mobile-menu');

/* ═══════════════════════════════════════════════════════
   HAMBURGER MENU
   Only rendered on mobile (≤768px) via CSS.
   JS just toggles the .open class.
═══════════════════════════════════════════════════════ */
hamburgerBtn.addEventListener('click', () => {
  const isOpen = hamburgerBtn.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  /* Prevent background scroll while drawer is open */
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeMobileMenu() {
  hamburgerBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* Close drawer automatically when viewport goes above mobile breakpoint */
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMobileMenu();
}, { passive: true });

/* ═══════════════════════════════════════════════════════
   MOBILE DRAWER LINK HANDLER
   Called by onclick="navTo('page')" in the drawer links.
═══════════════════════════════════════════════════════ */
function navTo(name) {
  closeMobileMenu();
  showPage(name);
}

/* ═══════════════════════════════════════════════════════
   PAGE ROUTING
   SPA: show/hide .page sections, sync active link state.
═══════════════════════════════════════════════════════ */
function showPage(name) {
  /* Switch active page */
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');

  /* Sync active class — desktop links */
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  /* Sync active class — mobile drawer links */
  document.querySelectorAll('.mobile-menu a').forEach(a => a.classList.remove('active'));

  const order = { home: 0, services: 1, about: 2, contact: 3 };
  const idx   = order[name];

  const dLinks = document.querySelectorAll('.nav-links a');
  const mLinks = document.querySelectorAll('.mobile-menu a');
  if (dLinks[idx]) dLinks[idx].classList.add('active');
  if (mLinks[idx]) mLinks[idx].classList.add('active');

  /* Scroll to top without animation */
  window.scrollTo({ top: 0, behavior: 'instant' });

  /* Reset contact form whenever contact page is opened */
  if (name === 'contact') resetContactForm();

  /* Trigger scroll-reveal for the new page */
  setTimeout(initReveal, 60);
}

/* ═══════════════════════════════════════════════════════
   SCROLL — Nav border shadow on scroll
═══════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
═══════════════════════════════════════════════════════ */
function initReveal() {
  const activePage = document.querySelector('.page.active');
  if (!activePage) return;

  const unrevealedEls = activePage.querySelectorAll('.reveal:not(.visible)');
  if (!unrevealedEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  unrevealedEls.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════
   CONTACT FORM → WHATSAPP
   Builds a pre-filled WhatsApp message from the form
   fields and opens wa.me deep-link in a new tab.
═══════════════════════════════════════════════════════ */
function handleSubmit() {
  /* Read values */
  const first   = document.getElementById('f-first').value.trim();
  const last    = document.getElementById('f-last').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const service = document.getElementById('f-service').value;
  const budget  = document.getElementById('f-budget').value;
  const message = document.getElementById('f-message').value.trim();

  /* Validate required fields */
  if (!first) { flashError('f-first', 'Please enter your first name.'); return; }
  if (!email || !isValidEmail(email)) { flashError('f-email', 'Please enter a valid email address.'); return; }
  if (!service) { flashError('f-service', 'Please select a service.'); return; }

  /* Build WhatsApp message */
  const lines = [
    '👋 Hello Jetaji Digital!',
    '',
    `*Name:* ${first}${last ? ' ' + last : ''}`,
    `*Email:* ${email}`,
  ];
  if (phone) lines.push(`*Phone:* ${phone}`);
  lines.push(`*Service Interest:* ${service}`);
  if (budget) lines.push(`*Budget:* ${budget}`);
  if (message) {
    lines.push('');
    lines.push(`*Project Details:*`);
    lines.push(message);
  }
  lines.push('');
  lines.push('Looking forward to hearing from you!');

  const encodedMsg = encodeURIComponent(lines.join('\n'));
  const waURL      = `https://wa.me/${WA_NUMBER}?text=${encodedMsg}`;

  /* Open WhatsApp in a new tab */
  window.open(waURL, '_blank', 'noopener,noreferrer');

  /* Show success state */
  document.getElementById('form-container').style.display = 'none';
  document.getElementById('form-success').style.display   = 'block';
}

/* Validate email format */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Briefly highlight an invalid field */
function flashError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = '#c0392b';
  field.focus();
  /* Restore border after 2 s */
  setTimeout(() => { field.style.borderColor = ''; }, 2000);
  /* Show a small alert — can be replaced with a custom toast if desired */
  alert(msg);
}

/* Reset contact form back to its initial state */
function resetContactForm() {
  const fc = document.getElementById('form-container');
  const fs = document.getElementById('form-success');
  if (fc) fc.style.display = 'block';
  if (fs) fs.style.display = 'none';
  /* Clear field values */
  ['f-first','f-last','f-email','f-phone','f-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['f-service','f-budget'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });
}

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
window.addEventListener('load', initReveal);