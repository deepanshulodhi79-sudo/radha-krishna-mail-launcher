const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Send Mail Route
app.post("/send-mail", async (req, res) => {
  const { senderName, senderEmail, appPassword, recipients, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    // Split recipients by new line
    const recipientList = recipients.split("\n").map(r => r.trim()).filter(r => r);

    // Send to each recipient separately
    for (const recipient of recipientList) {
      const mailOptions = {
        from: `"${senderName}" <${senderEmail}>`,
        to: recipient, // ✅ Each mail only goes to that one recipient
        subject: subject,
        text: message,
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ success: true, msg: "Emails sent successfully!" });

  } catch (error) {
    console.error("Mail send error:", error);
    res.json({ success: false, msg: "Failed to send mail." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
