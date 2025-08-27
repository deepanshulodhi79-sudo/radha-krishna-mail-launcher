const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Default route -> login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ✅ Hardcoded login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "radha krishna" && password === "shree krishna15") {
    return res.json({ success: true });
  }
  return res.json({ success: false, message: "Invalid credentials" });
});

// ✅ Helper delay
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ✅ Send route
app.post("/send", async (req, res) => {
  const { senderName, email, pass, recipients, subject, message, delayMs } = req.body;

  if (!senderName || !email || !pass || !recipients || !subject || !message) {
    return res.json({ success: false, message: "⚠️ Please fill all fields." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: email, pass: pass }
    });

    const list = recipients.split(/\r?\n/).map(x => x.trim()).filter(Boolean);

    let sent = 0;
    let failed = 0;
    let errors = [];

    for (let i = 0; i < list.length; i++) {
      const to = list[i];
      try {
        await transporter.sendMail({
          from: `"${senderName}" <${email}>`,
          to,
          subject,
          text: message
        });
        sent++;
        console.log(`✅ Sent to ${to}`);
      } catch (e) {
        failed++;
        errors.push({ to, error: e.message });
        console.error(`❌ ${to} -> ${e.message}`);
      }

      if (i < list.length - 1) {
        const gap = Number(delayMs) || 3000; // default 3s
        await sleep(gap);
      }
    }

    return res.json({
      success: true,
      message: `✅ Done: Sent ${sent}, Failed ${failed}`,
      details: errors
    });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "❌ " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
