document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3020/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (res.status === 200) {
    window.location.href = "/chat.html"; // Redirect to chat page after login
  } else {
    alert(data.message);
  }
});

document.getElementById("register-btn").addEventListener("click", () => {
  window.location.href = "/register.html"; // Redirect to register page
});
