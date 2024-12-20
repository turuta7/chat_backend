const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/messageController");

// Создание нового сообщения
router.post("/messages", MessageController.createMessage);

// Получение переписки между двумя пользователями
router.get("/messages/:userId1/:userId2", MessageController.getConversation);

module.exports = router;
