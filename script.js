document.addEventListener('DOMContentLoaded', () => {
  // 🌐 Tab switching
  document.getElementById('found-tab').addEventListener('click', () => {
    showSection('found-form', 'found-tab');
  });

  document.getElementById('lost-tab').addEventListener('click', () => {
    showSection('lost-form', 'lost-tab');
  });

  document.getElementById('login-tab').addEventListener('click', () => {
    showSection('login-section', 'login-tab');
  });

  function showSection(sectionId, tabId) {
    document.querySelectorAll('.form-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(sectionId).classList.remove('hidden');
    document.getElementById(tabId).classList.add('active');
  }

  // 🟢 Found form submission
  document.getElementById('foundItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = grecaptcha.getResponse();
    if (!token) return alert("Please complete the reCAPTCHA.");

    const payload = {
      email: foundEmail.value,
      item_name: foundName.value,
      color: foundColor.value,
      brand: foundBrand.value,
      location: foundLocation.value,
      captchaToken: token
    };

    const res = await fetch('https://backend-by4w.onrender.com/api/found', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    alert(data.message || 'Item registered!');
    grecaptcha.reset();
    foundItemForm.reset();
  });

  // 🔍 Lost form submission
  document.getElementById('lostItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = grecaptcha.getResponse();
    if (!token) return alert("Please complete the reCAPTCHA.");

    const payload = {
      item_name: lostName.value,
      color: lostColor.value,
      brand: lostBrand.value,
      captchaToken: token
    };

    const res = await fetch('https://backend-by4w.onrender.com/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const results = await res.json();

    const output = results.length
      ? results.map(item => `<li>${item.item_name} (${item.color}) - ${item.brand || 'No brand'} at ${item.location}</li>`).join('')
      : '<p>No items found matching your criteria.</p>';

    document.getElementById('searchResults').innerHTML = `<ul>${output}</ul>`;
    grecaptcha.reset();
    lostItemForm.reset();
  });

  // 🔐 Login form
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = grecaptcha.getResponse();
    if (!token) return alert("Please complete the reCAPTCHA.");

    const payload = {
      email: loginEmail.value,
      password: loginPassword.value,
      captchaToken: token
    };

    const res = await fetch('https://backend-by4w.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      alert("OTP sent to your email!");
      showSection('otp-section', 'login-tab');
    } else {
      alert(data.message || 'Login failed.');
    }
    grecaptcha.reset();
  });

  // ✅ Verify OTP
  document.getElementById('otpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = grecaptcha.getResponse();
    if (!token) return alert("Please complete the reCAPTCHA.");

    const payload = {
      email: loginEmail.value,
      code: otpCode.value,
      captchaToken: token
    };

    const res = await fetch('https://backend-by4w.onrender.com/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Login successful!");
      otpForm.reset();
      showSection('found-form', 'found-tab'); // back to main
    } else {
      alert(data.message || 'Invalid OTP.');
    }
    grecaptcha.reset();
  });
});
