/* ═══════════════════════════════════════════════════════
   JETAJI DIGITAL — script.js
   (Multi-page site: each page is a real .html file)
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
if (hamburgerBtn && mobileMenu) {
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

  /* Close drawer when a link inside it is clicked (page will navigate) */
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

/* ═══════════════════════════════════════════════════════
   SCROLL — Nav border shadow on scroll
═══════════════════════════════════════════════════════ */
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
═══════════════════════════════════════════════════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════
   CONTACT FORM → WHATSAPP
   Builds a pre-filled WhatsApp message from the form
   fields and opens wa.me deep-link in a new tab.
═══════════════════════════════════════════════════════ */
function handleSubmit() {
  const firstEl   = document.getElementById('f-first');
  const lastEl    = document.getElementById('f-last');
  const emailEl   = document.getElementById('f-email');
  const phoneEl   = document.getElementById('f-phone');
  const serviceEl = document.getElementById('f-service');
  const budgetEl  = document.getElementById('f-budget');
  const messageEl = document.getElementById('f-message');

  if (!firstEl || !emailEl || !serviceEl) return; /* not on contact page */

  const first   = firstEl.value.trim();
  const last    = lastEl.value.trim();
  const email   = emailEl.value.trim();
  const phone   = phoneEl.value.trim();
  const service = serviceEl.value;
  const budget  = budgetEl.value;
  const message = messageEl.value.trim();

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
    lines.push('*Project Details:*');
    lines.push(message);
  }
  lines.push('');
  lines.push('Looking forward to hearing from you!');

  const encodedMsg = encodeURIComponent(lines.join('\n'));
  const waURL = `https://wa.me/${WA_NUMBER}?text=${encodedMsg}`;

  /* Open WhatsApp in a new tab */
  window.open(waURL, '_blank', 'noopener,noreferrer');

  /* Show success state */
  const formContainer = document.getElementById('form-container');
  const formSuccess   = document.getElementById('form-success');
  if (formContainer) formContainer.style.display = 'none';
  if (formSuccess)   formSuccess.style.display   = 'block';
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
  setTimeout(() => { field.style.borderColor = ''; }, 2000);
  alert(msg);
}

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
window.addEventListener('load', initReveal);
