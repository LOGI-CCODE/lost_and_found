document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Tab switching ---------- */
  const tabs = {
    'found-tab': 'found-form',
    'lost-tab' : 'lost-form'
  };

  Object.keys(tabs).forEach(tabId => {
    document.getElementById(tabId).addEventListener('click', () => {
      // show the selected section
      Object.values(tabs).forEach(sec => document.getElementById(sec).classList.add('hidden'));
      document.getElementById(tabs[tabId]).classList.remove('hidden');

      // highlight the active tab
      Object.keys(tabs).forEach(id => document.getElementById(id).classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });

  /* ---------- Found form submit ---------- */
  document.getElementById('foundItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = grecaptcha.getResponse();
    if (!token) return alert('Please complete the reCAPTCHA.');

    const payload = {
      email:       foundEmail.value,
      item_name:   foundName.value,
      color:       foundColor.value,
      brand:       foundBrand.value,
      location:    foundLocation.value,
      captchaToken: token
    };

    try {
      const res  = await fetch('https://backend-by4w.onrender.com/api/found', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload)
      });
      const data = await res.json();
      alert(data.message || 'Item registered!');
      grecaptcha.reset();
      foundItemForm.reset();
    } catch (err) {
      alert('Error registering item.');
      console.error(err);
    }
  });

  /* ---------- Lost form submit ---------- */
  document.getElementById('lostItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = grecaptcha.getResponse();
    if (!token) return alert('Please complete the reCAPTCHA.');

    const payload = {
      item_name:   lostName.value,
      color:       lostColor.value,
      brand:       lostBrand.value,
      captchaToken: token
    };

    try {
      const res  = await fetch('https://backend-by4w.onrender.com/api/search', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload)
      });
      const results = await res.json();

      const html = results.length
        ? `<ul>${results.map(
            it => `<li>${it.item_name} (${it.color}) – ${it.brand || 'No brand'} @ ${it.location}</li>`
          ).join('')}</ul>`
        : '<p>No items found.</p>';

      document.getElementById('searchResults').innerHTML = html;
      grecaptcha.reset();
      lostItemForm.reset();
    } catch (err) {
      alert('Error searching items.');
      console.error(err);
    }
  });
});
