function checkLogin() {
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "/";
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "/";
}

document.getElementById("mailForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const sendBtn = document.getElementById("sendBtn");
  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  alert("Demo Mode: Mail sending will be implemented with backend Nodemailer.");

  // Reset button
  sendBtn.disabled = false;
  sendBtn.textContent = "Send";
});
