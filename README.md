# Radha Krishna Mail Launcher

A clean, animated, modern mail launcher with protected login and Gmail SMTP.

## Features
- **Hardcoded login**: username `radha krishna`, password `shree krishna15`
- **Protected launcher** (`/launcher`) via sessions + logout
- **Sender Name + Gmail + App Password**
- **Recipients** list (one per line), **Subject**, **Message**
- **Per-email delay** to reduce spam risk
- **Animated gradient title + glow + fade-in subtitle**
- Render/GitHub friendly (Node.js + Express + Nodemailer)

## Local Run
```bash
npm install
npm start
# open http://localhost:3000
```

## Deploy to Render
- Build command: `npm install`
- Start command: `npm start`
- (Optional) Env var: `SESSION_SECRET`

> Use **Gmail App Password** (Google Account → Security → 2-Step Verification → App Passwords). Normal password नहीं चलेगा.

