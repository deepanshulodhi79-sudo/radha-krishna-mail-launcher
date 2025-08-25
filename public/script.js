function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "radha krishna" && password === "shree krishna15") {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "/launcher";
  } else {
    alert("Invalid credentials!");
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "/";
}

function checkAuth() {
  if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "/";
  }
}

function sendMails() {
  const senderName = document.getElementById("senderName").value;
  const senderEmail = document.getElementById("senderEmail").value;
  const appPassword = document.getElementById("appPassword").value;
  const recipients = document.getElementById("recipients").value.split("\n");
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;
  const delay = parseInt(document.getElementById("delay").value, 10);

  console.log("🚀 Sending mails...");
  console.log({ senderName, senderEmail, appPassword, recipients, subject, message, delay });

  alert("Demo only: Mail sending logic goes here!");
}

// protect launcher page
if (window.location.pathname.includes("index.html") || window.location.pathname.includes("launcher")) {
  checkAuth();
}
