const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class MessageController {
  // Создание нового сообщения
  static async createMessage(req, res) {
    const { senderId, receiverId, content } = req.body;

    // Проверка на корректность данных
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    try {
      // Создание нового сообщения в базе данных
      const message = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content,
        },
      });

      // Ответ с созданным сообщением
      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Ошибка при отправке сообщения" });
    }
  }

  // Получение переписки между двумя пользователями
  static async getConversation(req, res) {
    const { userId1, userId2 } = req.params;

    // Проверка на корректность данных
    if (!userId1 || !userId2) {
      return res
        .status(400)
        .json({ message: "Необходимы оба id пользователей" });
    }

    try {
      // Получение сообщений между двумя пользователями
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: parseInt(userId1), receiverId: parseInt(userId2) },
            { senderId: parseInt(userId2), receiverId: parseInt(userId1) },
          ],
        },
        orderBy: {
          createdAt: "asc", // Сортировка по времени отправки
        },
      });

      // Ответ с полученными сообщениями
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Ошибка при получении переписки" });
    }
  }
}

module.exports = MessageController;
