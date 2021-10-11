const express = require("express");
const loggerMiddleWare = require("morgan");
const corsMiddleWare = require("cors");
const { PORT } = require("./config/constants");
const authRouter = require("./routers/auth");
// const authMiddleWare = require("./auth/middleware");
const bodyParserMiddleWare = express.json();

const app = express();

app.use(loggerMiddleWare("dev"));
app.use(bodyParserMiddleWare);
app.use(corsMiddleWare());
if (process.env.DELAY) {
  app.use((req, res, next) => {
    setTimeout(() => next(), parseInt(process.env.DELAY));
  });
}

// Routers

app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
