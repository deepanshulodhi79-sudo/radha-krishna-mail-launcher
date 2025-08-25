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

    // Recipients को line break से split करो
    const recipientList = recipients.split("\n").map(r => r.trim()).filter(r => r);

    // हर receiver को अलग mail भेजो
    for (const recipient of recipientList) {
      const mailOptions = {
        from: `"${senderName}" <${senderEmail}>`,
        to: recipient,     // ✅ हर बार सिर्फ़ उसी की ID जाएगी
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
