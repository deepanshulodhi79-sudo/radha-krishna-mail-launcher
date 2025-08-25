const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple session simulation
let loggedIn = false;

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'radha krishna' && password === 'shree krishna15') {
    loggedIn = true;
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/api/check-login', (req, res) => {
  res.json({ loggedIn });
});

app.post('/api/logout', (req, res) => {
  loggedIn = false;
  res.json({ success: true });
});

app.post('/api/send', async (req, res) => {
  if (!loggedIn) {
    return res.status(403).json({ success: false, message: 'Not logged in' });
  }

  const { senderName, gmail, appPassword, recipients, subject, message, delay } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmail,
        pass: appPassword
      }
    });

    const recipientList = recipients.split('\n').map(r => r.trim()).filter(r => r);
    for (let i = 0; i < recipientList.length; i++) {
      await transporter.sendMail({
        from: `${senderName} <${gmail}>`,
        to: recipientList[i],
        subject,
        text: message
      });
      if (delay && delay > 0) {
        await new Promise(r => setTimeout(r, delay));
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
