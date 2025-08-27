const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Default route → Login
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

// ✅ Logout
app.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// ✅ Send Mail
app.post("/send", async (req, res) => {
  try {
    const { email, password, senderName, recipients, subject, message, delayMs } = req.body;

    if (!email || !password || !recipients) {
      return res.json({ success: false, message: "Email, password, and recipients are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: email, pass: password },
    });

    const recipientList = recipients.split(/[\n,]+/).map(r => r.trim()).filter(r => r);

    for (let i = 0; i < recipientList.length; i++) {
      let mailOptions = {
        from: `"${senderName || "Anonymous"}" <${email}>`,
        to: recipientList[i],
        subject: subject || "No Subject",
        text: message || "",
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Mail sent to ${recipientList[i]}`);

      if (delayMs) {
        await new Promise(resolve => setTimeout(resolve, parseInt(delayMs)));
      }
    }

    res.json({ success: true, message: "All mails sent successfully ✅" });
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    res.json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
