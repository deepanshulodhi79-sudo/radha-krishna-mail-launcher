function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      window.location.href = "launcher.html";
    } else {
      document.getElementById("loginMessage").innerText = data.message;
    }
  });
}

function sendMail() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("pass").value;
  const recipients = document.getElementById("recipients").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  const btn = document.getElementById("sendBtn");
  btn.disabled = true;
  btn.innerText = "Sending...";

  fetch("/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, pass, recipients, subject, message })
  })
  .then(res => res.json())
  .then(data => {
    btn.disabled = false;
    btn.innerText = "Send Emails";
    document.getElementById("statusMessage").innerText = data.message;
    alert(data.message);
  })
  .catch(err => {
    btn.disabled = false;
    btn.innerText = "Send Emails";
    alert("Error: " + err.message);
  });
}
