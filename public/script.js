async function sendMails() {
  const senderName = document.getElementById("senderName").value;
  const senderEmail = document.getElementById("senderEmail").value;
  const appPassword = document.getElementById("appPassword").value;
  const recipients = document.getElementById("recipients").value.split("\n");
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;
  const delay = parseInt(document.getElementById("delay").value, 10);

  try {
    const res = await fetch("/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderName, senderEmail, appPassword, recipients, subject, message })
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Emails sent successfully!");
    } else {
      alert("❌ Failed: " + data.msg);
    }
  } catch (err) {
    console.error(err);
    alert("Error sending emails!");
  }
}
