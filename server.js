const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limiter");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const { readdirSync } = require("fs");
/**
 * Global middlewares
 */
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 100,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    extended: false,
    limit: "50mb",
  })
);

/**
 * Development router
 */

/**
 * Routers calling
 */

readdirSync("./src/routes").map((fileName) =>
  app.use("/api/v1", require(`./src/routes/${fileName}`))
);

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    app.listen(PORT, () => {
      console.log("DB is connected:", PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
