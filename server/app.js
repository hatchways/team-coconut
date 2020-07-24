const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
require('express-async-errors');

const errorMiddleware = require('./middlewares/error');
const notFoundMiddleware = require('./middlewares/notFound')

const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");
const authRouter = require("./routes/auth");
const gameRouter = require("./routes/game")
const path = require("path")

const { json, urlencoded } = express;

var app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

//if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, '../client/build')));
//}

// MongoDB config
const mongoUri = process.env.MONGO_DB_ATLAS_URI;
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((error) => console.error(error));

app.use("/", indexRouter);
app.use("/ping", pingRouter);
app.use("/auth", authRouter);
app.use("/game", gameRouter);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// error handler
app.use(errorMiddleware);
//path not found
app.use(notFoundMiddleware);


module.exports = app;
