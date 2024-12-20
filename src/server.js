const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const isAuthenticated = require("./middleware/auth");
const sharedSession = require("express-socket.io-session");
const userStore = require("./store/UserStore");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageController");

// // Set up session middleware
// app.use(
//   session({
//     secret: "your_secret_key", // Ваш секретный ключ
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: false,
//       maxAge: 20 * 60 * 1000,
//     },
//   })
// );

// Set up session middleware
const sessionMiddleware = session({
  secret: "your_secret_key", // Ваш секретный ключ
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Для разработки (на HTTPS поставить true)
    maxAge: 20 * 60 * 1000, // Время жизни сессии — 20 минут
  },
});

// Используем session middleware для Express
app.use(sessionMiddleware);

// Set up CORS middleware
app.use(cors({ credentials: true, origin: "*" })); // Replace "*" with your frontend URL

// Use body parser to parse incoming JSON
app.use(bodyParser.json());

// Set up routes
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

// Middleware to check authentication for all routes except for / and /register
app.use((req, res, next) => {
  // Проверяем, что запрашиваемый путь не является файлом .js
  if (req.path.endsWith(".js")) {
    return next(); // Пропускаем запрос на js-файлы
  }

  // Для всех остальных путей проверяем аутентификацию
  if (req.path === "/" || req.path === "/register") {
    return next(); // Пропускаем запросы на / и /register
  }

  // Вызов middleware для аутентификации
  isAuthenticated(req, res, next);
});

// Static files (e.g., index.html)
app.use(express.static(path.join(__dirname, "../../public")));

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "../../public/index.html"));
});

app.get("/register", (req, res) => {
  return res.sendFile(path.join(__dirname, "../../public/register.html"));
});

app.get("/chat", isAuthenticated, (req, res) => {
  return res.sendFile(path.join(__dirname, "../../public/chat.html"));
});

// 404 error handler
app.use("*", (req, res) => {
  res.status(404).send({ message: "Error endpoint" });
});

io.use(
  sharedSession(sessionMiddleware, {
    autoSave: true, // Сохранять сессию автоматически при её изменении
  })
);

// WebSocket setup
let onlineUsers = new Map(); // To store online users
io.on("connection", async (socket) => {
  // Получение данных сессии
  const session = socket.handshake.session;
  console.log("Session data:", session);

  if (session && session.user) {
    const users = await prisma.user.findMany(); // Get all users
    const username = session?.user?.username;
    users.forEach((user) => {
      console.log("====================================");
      console.log(user.username, username);
      console.log("====================================");
      if (user.username === username) {
        userStore.addOnlineUser(user, socket.id);
        console.log("SAVE addOnlineUser");
      }
      userStore.addUser(user);
    });

    // onlineUsers.set(username, socket.id);
    console.log(`${username} connected with session ID: ${session.id}`);
  }

  socket.emit("users", userStore.getUsers());
  socket.emit("usersOnline", userStore.getOnlineUsers());

  // socket.on("online", (username) => {
  //   if (username) {
  //     onlineUsers.set(username, socket.id);
  //     console.log(`${username} is online`);
  //   }
  // });

  socket.on("disconnect", () => {
    for (let [username, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(username);
        console.log(`${username} disconnected`);
        break;
      }
    }
  });
});

// Start the server
const startServer = (PORT) => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

module.exports = startServer;
