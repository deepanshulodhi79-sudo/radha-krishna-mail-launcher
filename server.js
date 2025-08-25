const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Default route -> login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Mail sending route
app.post("/send-mail", async (req, res) => {
  const { senderName, senderEmail, appPassword, recipients, subject, message } = req.body;

  try {
    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    // Prepare mail options
    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: recipients,
      subject: subject,
      text: message,
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    // ✅ If no error -> Success response
    res.json({ success: true, msg: "Emails sent successfully!" });

  } catch (error) {
    console.error("Mail send error:", error);
    // ❌ Failure response
    res.json({ success: false, msg: "Failed to send mail." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
