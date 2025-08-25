const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Default route → login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Send mail API
app.post("/send-mail", async (req, res) => {
  const { senderName, senderEmail, appPassword, recipients, subject, message } = req.body;

  try {
    // Gmail SMTP config
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: senderEmail,
        pass: appPassword, // App Password (not Gmail login password)
      },
    });

    // Recipients ko array me convert karo
    const recipientList = recipients.split("\n").map(r => r.trim()).filter(r => r);

    // Sab recipients ko ek-ek karke bhejna
    for (let to of recipientList) {
      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: to, // ek baar me ek hi ID jayegi
        subject,
        text: message,
      });
    }

    res.json({ success: true, msg: "✅ Emails sent successfully!" });

  } catch (error) {
    console.error("Mail send error:", error);
    res.json({ success: false, msg: "❌ Failed: " + error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
