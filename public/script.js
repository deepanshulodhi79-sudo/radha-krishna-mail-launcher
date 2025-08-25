async function sendMails() {
  const sendBtn = document.getElementById("sendBtn"); // Send Mail button ka id
  sendBtn.disabled = true;
  sendBtn.innerText = "📨 Sending...";
  sendBtn.style.backgroundColor = "#f39c12"; // orange color while sending

  const senderName = document.getElementById("senderName").value;
  const senderEmail = document.getElementById("senderEmail").value;
  const appPassword = document.getElementById("appPassword").value;
  const recipients = document.getElementById("recipients").value.split("\n");
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

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

  // Reset button state
  sendBtn.disabled = false;
  sendBtn.innerText = "📩 Send Mail";
  sendBtn.style.backgroundColor = "#3498db"; // back to blue
}
