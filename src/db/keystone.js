const morgan = require("morgan");
require("dotenv").config({ path: "../../.env" });

const { config } = require("@keystone-6/core");
const { lists } = require("./schema");

const startServer = require("../server");

const PORT_KEYSTONE = process.env.PORT_KEYSTONE || 5000;
const PORT = process.env.PORT_SERVER || 3010;
const URL =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5433/${process.env.DB_NAME}`;
console.log("=============CONFIG=================");
console.log("Port keystone: " + PORT_KEYSTONE);
console.log("Port server: " + PORT);
console.log("URL: " + URL);
console.log("====================================");
export default config({
  db: {
    onConnect: () => {
      console.log("***Database connected and server is ready!***");
      startServer(PORT);
      // app.use(morgan("dev"));
      // server.listen(PORT, () => {
      //   console.log(`***Server is running on port ${PORT}***`);
      // });
    },
    provider: "postgresql",
    url: URL,
  },
  lists,
  telemetry: false,
  server: {
    cors: { origin: ["*"], credentials: true },
    port: PORT_KEYSTONE,
    axFileSize: 200 * 1024 * 1024,
    // Enable logging
    logger: {
      level: "info",
      transports: [
        // Вывод в консоль
        new (require("winston").transports.Console)({
          format: require("winston").format.combine(
            require("winston").format.colorize(),
            require("winston").format.simple()
          ),
        }),
      ],
    },

    extendExpressApp: (app) => {
      app.use(morgan("dev"));
      // app.use("/api/cars", require("./src/routes/carRoutes"));
    },
  },
});
