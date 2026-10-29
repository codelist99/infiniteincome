(() => {
  const path = location.pathname.toLowerCase();
  const params = Object.fromEntries(new URLSearchParams(location.search));
  if (path.endsWith('/fe1') || path.endsWith('/fe1.html') || path === '/') {
    document.addEventListener('click', async event => {
      const button = event.target.closest('a[href="#submit-form"]');
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const value = name => document.querySelector(`[name="${name}"]`)?.value?.trim() || '';
      const payload = { first_name: value('first_name'), last_name: value('last_name'), email: value('email'), phone: value('phone_number'), metadata: params };
      if (!payload.first_name || !payload.email || !payload.phone) return alert('Please enter your name, email, and phone number.');
      button.style.pointerEvents = 'none';
      try {
        const response = await fetch('/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to continue');
        sessionStorage.setItem('infiniteIncomeLead', JSON.stringify(payload));
        location.href = `/fe2${location.search}`;
      } catch (error) { button.style.pointerEvents = ''; alert(error.message); }
    }, true);
  }
  if (path.endsWith('/fe2') || path.endsWith('/fe2.html')) {
    document.querySelectorAll('a[href*="explodely.com/p/2009033458"]').forEach(link => { link.href = `/checkout${location.search}`; });
  }
})();
