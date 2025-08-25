const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Mail Sender Route
app.post("/send-mail", async (req, res) => {
  const { senderName, senderEmail, appPassword, recipients, subject, message } = req.body;

  try {
    if (!recipients) {
      return res.json({ success: false, message: "❌ Failed: No recipients provided" });
    }

    // Mail transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    // Recipient list split
    const recipientList = recipients
      .split("\n")
      .map(r => r.trim())
      .filter(r => r);

    if (recipientList.length === 0) {
      return res.json({ success: false, message: "❌ Failed: Empty recipient list" });
    }

    // ✅ Private Mode → use BCC
    let mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: senderEmail,       // खुद को visible
      bcc: recipientList,    // बाकी recipients hidden
      subject: subject || "(No Subject)",
      text: message || "(No Message)",
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "✅ Mail sent privately to all recipients!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.json({ success: false, message: "❌ Failed: " + (error.message || error.toString() || "Unknown error") });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
