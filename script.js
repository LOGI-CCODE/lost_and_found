document.addEventListener('DOMContentLoaded', () => {
  // 🟣 Toggle tabs between Found and Lost
  document.getElementById('found-tab').addEventListener('click', () => {
    document.getElementById('found-form').classList.remove('hidden');
    document.getElementById('lost-form').classList.add('hidden');
    document.getElementById('found-tab').classList.add('active');
    document.getElementById('lost-tab').classList.remove('active');
  });

  document.getElementById('lost-tab').addEventListener('click', () => {
    document.getElementById('lost-form').classList.remove('hidden');
    document.getElementById('found-form').classList.add('hidden');
    document.getElementById('lost-tab').classList.add('active');
    document.getElementById('found-tab').classList.remove('active');
  });

  // 🟢 Found item form submit
  document.getElementById('foundItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = grecaptcha.getResponse();
    if (!token) return alert("Please complete the reCAPTCHA.");

    const payload = {
      email: document.getElementById('foundEmail').value,
      item_name: document.getElementById('foundName').value,
      color: document.getElementById('foundColor').value,
      brand: document.getElementById('foundBrand').value,
      location: document.getElementById('foundLocation').value,
      captchaToken: token
    };

    try {
      const res = await fetch('https://backend-by4w.onrender.com/api/found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      alert(data.message || 'Item registered!');
      grecaptcha.reset();
      document.getElementById('foundItemForm').reset();
    } catch (err) {
      alert('Error registering item.');
      console.error(err);
    }
  });

  // 🔍 Lost item search form submit
  document.getElementById('lostItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = grecaptcha.getResponse();
    if (!token) return alert("Please complete the reCAPTCHA.");

    const payload = {
      item_name: document.getElementById('lostName').value,
      color: document.getElementById('lostColor').value,
      brand: document.getElementById('lostBrand').value,
      captchaToken: token
    };

    try {
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
      document.getElementById('lostItemForm').reset();
    } catch (err) {
      alert('Error searching for items.');
      console.error(err);
    }
  });
});
