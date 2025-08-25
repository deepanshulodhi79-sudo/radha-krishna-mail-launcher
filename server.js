const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// Send mail route
app.post("/send-mail", async (req, res) => {
  const { senderName, senderEmail, appPassword, recipients, subject, message } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: appPassword
      }
    });

    for (let r of recipients) {
      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: r.trim(),
        subject,
        text: message
      });
    }

    res.json({ success: true, msg: "All emails sent!" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, msg: "Failed to send" });
  }
});

// Root → login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/launcher", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
