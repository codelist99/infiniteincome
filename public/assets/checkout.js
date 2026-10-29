(() => {
  const get = id => document.getElementById(id), form = get('paymentForm'), button = get('checkoutButton'), errorBox = get('paymentError');
  const label = 'COMPLETE SECURE ORDER — $67.00';
  let processing = false;
  const saved = JSON.parse(sessionStorage.getItem('infiniteIncomeLead') || '{}');
  get('firstName').value = saved.first_name || '';
  get('lastName').value = saved.last_name || '';
  get('email').value = saved.email || '';
  get('phone').value = saved.phone || '';
  const fail = message => { processing = false; errorBox.textContent = message; button.disabled = false; button.textContent = label; };
  async function pay(response) {
    if (processing || !form.reportValidity()) return;
    processing = true; errorBox.textContent = ''; button.disabled = true; button.textContent = 'SECURELY PROCESSING…';
    try {
      const payload = { paymentToken: response.token, consent: get('consent').checked, first_name: get('firstName').value, last_name: get('lastName').value, email: get('email').value, phone: get('phone').value, address: get('address').value, city: get('city').value, state: get('state').value, zip: get('zip').value, metadata: Object.fromEntries(new URLSearchParams(location.search)) };
      const responseData = await fetch('/api/checkout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await responseData.json();
      if (!responseData.ok) throw new Error(data.error || 'Payment could not be completed');
      location.href = `/thankyou${location.search}`;
    } catch (error) { fail(error.message); }
  }
  fetch('/api/checkout/config').then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Checkout unavailable'); return data; }).then(config => {
    if (!config.publicKey) throw new Error('Secure checkout is not configured');
    const script = document.createElement('script');
    script.src = 'https://secure.nmi.com/token/Collect.js'; script.dataset.tokenizationKey = config.publicKey;
    script.onload = () => {
      CollectJS.configure({ variant: 'inline', paymentSelector: '#checkoutButton', fields: { ccnumber: { selector: '#cardNumber', title: 'Card Number', placeholder: 'Card number' }, ccexp: { selector: '#cardExpiration', title: 'Expiration', placeholder: 'MM / YY' }, cvv: { selector: '#cardCvv', title: 'CVV', placeholder: 'CVV' } }, styleSniffer: 'false', customCss: { display: 'block', width: '100%', height: '46px', border: '0', padding: '0 12px', 'font-size': '16px', 'font-family': 'Arial', 'box-sizing': 'border-box', outline: 'none' }, callback: pay });
      button.disabled = false; button.textContent = label;
    };
    script.onerror = () => fail('Secure payment fields could not load. Refresh and try again.');
    document.head.appendChild(script);
  }).catch(error => fail(error.message));
})();
