const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Mail API
app.post("/send-mail", async (req, res) => {
  try {
    const { senderName, senderEmail, appPassword, recipients, subject, message } = req.body;

    // transporter create
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    // recipients हमेशा string → array
    let allRecipients = String(recipients).split("\n").map(r => r.trim()).filter(r => r);

    // सबको एक साथ भेजो (Inbox chance ↑)
    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: allRecipients.join(","),
      subject,
      text: message,
    });

    return res.json({ success: true, msg: `✅ Sent to all (${allRecipients.length})` });

  } catch (error) {
    console.error("Mail Error:", error);
    return res.json({ success: false, msg: "❌ Failed to send" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
