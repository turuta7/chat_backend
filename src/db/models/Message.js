// models/Message.js
const { list } = require("@keystone-6/core");
const { text, relationship, timestamp } = require("@keystone-6/core/fields");
const { allowAll } = require("@keystone-6/core/access");

const Message = list({
  access: {
    operation: {
      query: () => true, // Разрешить всем пользователям доступ на чтение
      create: allowAll,
      update: allowAll,
      delete: allowAll,
    },
  },
  fields: {
    sender: relationship({
      ref: "User", // Связь с моделью User (отправитель сообщения)
      many: false, // Отправитель может быть только один
    }),
    receiver: relationship({
      ref: "User", // Связь с моделью User (получатель сообщения)
      many: false, // Получатель может быть только один
    }),
    content: text({
      validation: { isRequired: true }, // Сообщение обязательно
    }),
    createdAt: timestamp({ defaultValue: { kind: "now" } }), // Время отправки сообщения
  },
});

module.exports = Message;
