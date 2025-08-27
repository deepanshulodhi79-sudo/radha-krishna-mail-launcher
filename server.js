const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Default route → Login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ✅ Hardcoded login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "radha krishna" && password === "shree krishna15") {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

// ✅ Logout route
app.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// ✅ Send Mail
app.post("/send", async (req, res) => {
  try {
    const { email, password, senderName, recipients, subject, message } = req.body;

    if (!email || !password || !recipients || !subject || !message) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Gmail transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
    });

    // ✅ Clean mail body (no duplicate email/time)
    let mailOptions = {
      from: `"${senderName}" <${email}>`,
      to: recipients,
      subject: subject,
      text: message, // ✅ Only the message content
    };

    let info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("❌ Mail send failed:", err);
    res.json({ success: false, message: err.message });
  }
});

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
