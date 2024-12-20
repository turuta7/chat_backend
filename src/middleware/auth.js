// Middleware для проверки авторизации
const isAuthenticated = (req, res, next) => {
  // Проверяем, есть ли имя пользователя в сессии
  if (!req.session?.user?.username) {
    return res.redirect("/"); // или можно отправить 401 ошибку
    return res.status(401).json({ message: "Пожалуйста, авторизуйтесь" });
  }
  next(); // Если пользователь авторизован, продолжаем обработку запроса
};

module.exports = isAuthenticated;
