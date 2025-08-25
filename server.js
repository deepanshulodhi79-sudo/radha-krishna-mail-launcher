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
  const { senderName, senderEmail, appPassword, recipients, subject, message, delay } = req.body;

  try {
    // Mail transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    // Recipient list split
    const recipientList = recipients.split("\n").map(r => r.trim()).filter(r => r);

    // ✅ Private Mode → use BCC
    let mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: senderEmail,       // सिर्फ़ खुद को visible रहेगा
      bcc: recipientList,    // सब recipients को mail जाएगा, IDs hidden रहेंगी
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "✅ Mail sent privately to all recipients!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.json({ success: false, message: "❌ Failed: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
