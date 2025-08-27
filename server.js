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

// ✅ Send Mail (Clean version)
app.post("/send", async (req, res) => {
  try {
    const { email, password, recipients, subject, message, senderName } = req.body;

    // Gmail transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,     // ✅ यहां Gmail ID डालनी है
        pass: password,  // ✅ यहां App Password (16-digit) डालना है
      },
    });

    // Mail options
    let mailOptions = {
      from: `"${senderName || "Anonymous"}" <${email}>`, // अगर senderName नहीं दिया तो "Anonymous"
      to: recipients,
      subject: subject || "No Subject",
      text: message || "No message",
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("✅ Mail sent:", info.response);

    res.json({ success: true, message: "Mail sent successfully!" });
  } catch (err) {
    console.error("❌ Error while sending mail:", err.message);
    res.json({ success: false, message: err.message });
  }
});

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
