// Session check for launcher, login handler, logout, send logic

async function api(path, options = {}) {
  const r = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  let data = null;
  try { data = await r.json(); } catch {}
  return { ok: r.ok, data };
}

// If login page
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  async function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const { ok, data } = await api('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    if (ok) location.href = '/launcher';
    else alert((data && data.error) || 'Login failed');
  }
  loginBtn.addEventListener('click', login);
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter') login(); });
}

// If launcher page
const sendBtn = document.getElementById('sendBtn');
const logoutBtn = document.getElementById('logoutBtn');

async function ensureSession() {
  const el = document.getElementById('sendBtn'); // only on launcher
  if (!el) return;
  const { data } = await api('/api/session');
  if (!data || !data.authenticated) location.href = '/';
}
ensureSession();

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await api('/api/logout', { method: 'POST' });
    location.href = '/';
  });
}

if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    sendBtn.disabled = true;
    const t = sendBtn.textContent;
    sendBtn.textContent = 'Sending…';

    const payload = {
      senderName: document.getElementById('senderName').value.trim(),
      gmailAddress: document.getElementById('gmailAddress').value.trim(),
      gmailAppPassword: document.getElementById('gmailAppPassword').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
      recipientsText: document.getElementById('recipients').value,
      perEmailDelaySec: Number(document.getElementById('delaySec').value || 0)
    };

    try {
      const { ok, data } = await api('/api/send', { method: 'POST', body: JSON.stringify(payload) });
      if (!ok || !data || !data.ok) {
        alert((data && data.error) || 'Failed to send');
      } else {
        alert(`Total: ${data.total}\nSent: ${data.okCount}\nFailed: ${data.failCount}`);
      }
    } catch (e) {
      alert('Unexpected error');
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = t;
    }
  });
}
