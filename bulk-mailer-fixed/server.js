const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Hardcoded login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

// Send Mail
app.post("/send", async (req, res) => {
  const { email, pass, subject, message, recipients } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: email, pass: pass }
    });

    let recipientList = recipients.split(/\r?\n/).filter(r => r.trim() !== "");

    for (let r of recipientList) {
      await transporter.sendMail({
        from: email,
        to: r,
        subject: subject,
        text: message,
      });
    }

    res.json({ success: true, message: "Emails sent successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
