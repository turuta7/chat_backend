const socket = io("http://localhost:3020");
let currentUser = null;

// Get DOM elements
const usersList = document.getElementById("users-list");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("send-btn");
const activeUserHeader = document.getElementById("active-user");

// Fetch and display users
// fetch("http://localhost:3020/api/user", { credentials: "include" })
//   .then((response) => response.json())
//   .then((users) => {
//     console.log("=============users================");
//     console.log(users);
//     console.log("====================================");
//     usersList.innerHTML = "";
//     users.forEach((user) => {
//       const li = document.createElement("li");
//       li.textContent = `${user.username} (${
//         user.online ? "Online" : "Offline"
//       })`;
//       li.dataset.username = user.username;
//       li.addEventListener("click", () => selectUser(user.username));
//       usersList.appendChild(li);
//     });
//   });

// Select a user to chat with
function selectUser(username) {
  currentUser = username;
  activeUserHeader.textContent = `Chatting with ${username}`;
  messagesDiv.innerHTML = "";
  fetch(`http://localhost:3020/api/message/conversation/${username}`, {
    credentials: "include",
  })
    .then((response) => response.json())
    .then((messages) => {
      messages.forEach((msg) =>
        displayMessage(
          msg.content,
          msg.senderId === username ? "received" : "sent"
        )
      );
    });
}

// Display a message
function displayMessage(content, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = content;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send a message
sendBtn.addEventListener("click", () => {
  if (currentUser && messageInput.value.trim() !== "") {
    const message = messageInput.value.trim();
    displayMessage(message, "sent");

    fetch("http://localhost:3020/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ receiverId: currentUser, content: message }),
    });

    messageInput.value = "";
  }
});

// Update online status via WebSocket
socket.on("user-online", (username) => updateUserStatus(username, true));
socket.on("user-offline", (username) => updateUserStatus(username, false));

socket.on("users", (users) => {
  console.log("===============SOCKETusers==============");
  console.log(users);
  console.log("====================================");
});

socket.on("usersOnline", (users) => {
  console.log("===============SOCKETusers==============");
  console.log(users);
  console.log("====================================");
});
function updateUserStatus(username, isOnline) {
  const userItem = Array.from(usersList.children).find(
    (li) => li.dataset.username === username
  );
  if (userItem) {
    userItem.textContent = `${username} (${isOnline ? "Online" : "Offline"})`;
  }
}
