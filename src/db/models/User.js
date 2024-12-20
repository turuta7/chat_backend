const { list } = require("@keystone-6/core");
const { text } = require("@keystone-6/core/fields");
const { allowAll } = require("@keystone-6/core/access");

const User = list({
  access: {
    operation: {
      query: () => true,
      create: allowAll,
      update: allowAll,
      delete: allowAll,
    },
  },
  fields: {
    username: text({
      validation: { isRequired: true },
      isIndexed: "unique", // Уникальный индекс для логина
    }),
    password: text({
      validation: { isRequired: true }, // Пароль обязателен
      isPrivate: true, // Скрывать поле пароля при возвращении данных
    }),
  },
});

module.exports = User;
