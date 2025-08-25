import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mail-launcher-demo-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 }
  })
);

const DEMO_USER = { username: 'radha krishna', password: 'shree krishna15' };

function requireAuth(req, res, next) {
  if (req.session && req.session.user === DEMO_USER.username) return next();
  return res.status(401).json({ ok: false, error: 'Unauthorized' });
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    req.session.user = DEMO_USER.username;
    return res.json({ ok: true, user: DEMO_USER.username });
  }
  return res.status(401).json({ ok: false, error: 'Invalid credentials' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/session', (req, res) => {
  res.json({ ok: true, authenticated: !!(req.session && req.session.user) });
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

app.post('/api/send', requireAuth, async (req, res) => {
  try {
    const { senderName, gmailAddress, gmailAppPassword, subject, message, recipientsText, perEmailDelaySec } = req.body || {};

    if (!senderName || !gmailAddress || !gmailAppPassword) {
      return res.status(400).json({ ok: false, error: 'Sender Name, Gmail, and App Password are required.' });
    }
    if (!recipientsText) {
      return res.status(400).json({ ok: false, error: 'Recipients list is required.' });
    }

    const recipients = recipientsText.split('\n').map(r => r.trim()).filter(Boolean);
    if (recipients.length === 0) return res.status(400).json({ ok: false, error: 'No valid recipients provided.' });

    const delayMs = Math.max(0, Number(perEmailDelaySec || 0) * 1000);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: gmailAddress, pass: gmailAppPassword }
    });

    const results = [];
    for (let i = 0; i < recipients.length; i++) {
      const to = recipients[i];
      try {
        const info = await transporter.sendMail({
          from: `"${senderName}" <${gmailAddress}>`,
          to,
          subject,
          text: message || ''
        });
        results.push({ to, ok: true, id: info.messageId || null });
      } catch (err) {
        results.push({ to, ok: false, error: err?.message || String(err) });
      }
      if (i < recipients.length - 1 && delayMs > 0) await sleep(delayMs);
    }

    const okCount = results.filter(x => x.ok).length;
    const failCount = results.length - okCount;
    res.json({ ok: true, total: results.length, okCount, failCount, results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Unexpected server error.' });
  }
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/launcher', (req, res) => {
  if (req.session && req.session.user === DEMO_USER.username) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  return res.redirect('/');
});

app.use((req, res) => res.status(404).send('Not Found'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Radha Krishna Mail Launcher at http://localhost:${PORT}`));
