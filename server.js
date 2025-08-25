const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// 📩 Send Mail Route
app.post("/send-mail", async (req, res) => {
  try {
    const { senderName, gmail, appPassword, recipients, subject, message } = req.body;

    if (!senderName || !gmail || !appPassword || !recipients || !subject || !message) {
      return res.json({ success: false, message: "⚠️ Missing required fields" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmail,
        pass: appPassword,
      },
    });

    const recipientList = recipients.split("\n").map(r => r.trim()).filter(r => r);

    for (let recipient of recipientList) {
      try {
        await transporter.sendMail({
          from: `"${senderName}" <${gmail}>`,
          to: recipient,
          subject,
          text: message,
        });
        console.log(`✅ Sent to: ${recipient}`);
      } catch (innerError) {
        console.error(`❌ Failed to ${recipient}:`, innerError);
      }
    }

    res.json({ success: true, message: "✅ All mails processed" });
  } catch (error) {
    console.error("❌ Full Error:", error);

    res.json({
      success: false,
      message: "❌ Failed: " + (error?.message || error?.toString() || JSON.stringify(error))
    });
  }
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
