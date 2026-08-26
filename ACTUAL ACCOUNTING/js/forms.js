/**
 * ACTUAL ACCOUNTING - Form Handling & Front-End Validation
 * Handles form validation, error message displaying, consultation booking,
 * interactive fee estimation, and client portal authentication simulators.
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initConsultationForm();
  initLoginForm();
  initSignupForm();
  initFeeEstimator();
});

/* --- Contact Form Validation & Submission --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      showFormSuccess(form, 'Inquiry Submitted', 'Thank you for reaching out to ACTUAL ACCOUNTING. Our senior business advisory team in Rwanda will review your message and respond within 24 business hours.');
    }
  });
}

/* --- Consultation Form Validation & Submission --- */
function initConsultationForm() {
  const form = document.getElementById('consultation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      const refCode = 'ACTUAL-RWA-' + Math.floor(100000 + Math.random() * 900000);
      showFormSuccess(form, 'Consultation Request Confirmed!', `Your booking request has been received (Ref: <strong>${refCode}</strong>). A senior consultant from ACTUAL ACCOUNTING will contact you shortly to confirm your schedule and consultation format.`);
    }
  });
}

/* --- Login Form Validation --- */
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      showFormSuccess(form, 'Login Successful', 'Redirecting to your ACTUAL ACCOUNTING Client Portal dashboard...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }
  });
}

/* --- Signup Form Validation --- */
function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      showFormSuccess(form, 'Account Created!', 'Your client portal registration request has been submitted. Our compliance team will review your details and send login credentials to your registered email address.');
    }
  });
}

/* --- Generic Form Validation Helper --- */
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

  inputs.forEach(input => {
    const group = input.closest('.form-group') || input.parentElement;
    let errorMsg = group.querySelector('.form-error-msg');

    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'form-error-msg';
      group.appendChild(errorMsg);
    }

    // Reset state
    group.classList.remove('has-error');
    errorMsg.style.display = 'none';

    // Validation rules
    const val = input.value.trim();
    if (!val) {
      showError(group, errorMsg, 'This field is required.');
      isValid = false;
    } else if (input.type === 'email' && !isValidEmail(val)) {
      showError(group, errorMsg, 'Please enter a valid email address.');
      isValid = false;
    } else if (input.type === 'tel' && val.length < 8) {
      showError(group, errorMsg, 'Please enter a valid phone number.');
      isValid = false;
    } else if (input.tagName === 'TEXTAREA' && val.length < 10) {
      showError(group, errorMsg, 'Please enter at least 10 characters.');
      isValid = false;
    } else if (input.id === 'confirm-password') {
      const pass = form.querySelector('#password');
      if (pass && pass.value !== val) {
        showError(group, errorMsg, 'Passwords do not match.');
        isValid = false;
      }
    }
  });

  return isValid;
}

function showError(group, errorMsgEl, message) {
  group.classList.add('has-error');
  errorMsgEl.textContent = message;
  errorMsgEl.style.display = 'block';
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showFormSuccess(form, title, message) {
  let successBox = form.nextElementSibling;
  if (!successBox || !successBox.classList.contains('form-success-box')) {
    successBox = document.createElement('div');
    successBox.className = 'form-success-box';
    form.parentNode.insertBefore(successBox, form.nextSibling);
  }

  successBox.innerHTML = `
    <i class="fa-solid fa-circle-check"></i>
    <h4 style="margin-bottom: 0.5rem; color: var(--dark-green);">${title}</h4>
    <p style="margin: 0; font-size: 0.95rem; color: var(--black);">${message}</p>
  `;

  form.style.display = 'none';
  successBox.style.display = 'block';
}

/* --- Interactive Service Fee / Consultation Estimator --- */
function initFeeEstimator() {
  const estimator = document.getElementById('interactive-fee-estimator');
  if (!estimator) return;

  const businessTypeSelect = document.getElementById('calc-type');
  const sizeSelect = document.getElementById('calc-size');
  const serviceCheckboxes = document.querySelectorAll('.calc-service-check');
  const priceDisplay = document.getElementById('calc-price-output');

  if (!businessTypeSelect || !priceDisplay) return;

  function calculateEstimate() {
    let base = 0;
    const typeVal = businessTypeSelect.value;
    const sizeVal = sizeSelect ? sizeSelect.value : 'small';

    if (typeVal === 'sole-proprietor') base = 150000; // RWF base estimate
    else if (typeVal === 'sme') base = 350000;
    else if (typeVal === 'corporate') base = 750000;

    let multiplier = 1;
    if (sizeVal === 'medium') multiplier = 1.4;
    else if (sizeVal === 'large') multiplier = 2.0;

    let total = base * multiplier;

    serviceCheckboxes.forEach(chk => {
      if (chk.checked) {
        total += parseFloat(chk.getAttribute('data-fee') || 100000);
      }
    });

    const formatted = Math.round(total).toLocaleString() + ' RWF';
    priceDisplay.textContent = formatted;
  }

  businessTypeSelect.addEventListener('change', calculateEstimate);
  if (sizeSelect) sizeSelect.addEventListener('change', calculateEstimate);
  serviceCheckboxes.forEach(chk => chk.addEventListener('change', calculateEstimate));

  // Initial calculation
  calculateEstimate();
}
