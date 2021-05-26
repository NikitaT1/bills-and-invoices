const winston = require("winston");
const path = require("path");

// const logger = winston.createLogger({
//   level: "http",
//   format: winston.format.simple(),
//   //defaultMeta: { service: "user-service" },
//   transports: [
//     new winston.transports.Console(),

//     new winston.transports.File({ filename: "http.log", level: "http" }),
//   ],
// });

// if (process.env.NODE_ENV !== "production") {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.simple(),
//     })
//   );
// }
module.exports = () => {
  process.on("uncaughtException", (err) =>
    winston.error("uncaught exception: ", err)
  );
  process.on("unhandledRejection", (reason, p) =>
    winston.error("unhandled rejection: ", reason, p)
  );

  winston.exitOnError = false;
  winston.level = process.env.NODE_ENV === "production" ? "info" : "debug";
  winston.remove(winston.transports.Console);

  // winston.add(winston.transports.Console, {
  //   level: "debug",
  //   handleExceptions: true,
  //   prettyPrint: true,
  //   humanReadableUnhandledException: false,
  //   json: false,
  //   colorize: true,
  //   timestamp: new Date(),
  // });

  // winston.add(winston.transports.File, {
  //   // filename: "http.log",
  //   level: "http",
  //   level: "debug",
  //   filename: path.join(__dirname, "./app_asd.log"),
  //   handleExceptions: true,
  //   humanReadableUnhandledException: true,
  //   json: false,
  //   maxsize: 10242880, // ~10MB
  //   maxFiles: 3,
  //   colorize: false,
  //   timestamp: new Date(),
  // });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
};
