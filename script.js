document.getElementById("sendBtn")?.addEventListener("click", () => {
  const btn = document.getElementById("sendBtn");
  btn.innerText = "Sending...";
  btn.disabled = true;

  setTimeout(() => {
    alert("✅ Emails sent successfully!");
    btn.innerText = "Send";
    btn.disabled = false;
  }, 2000);
});
