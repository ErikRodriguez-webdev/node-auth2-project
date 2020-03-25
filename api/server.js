const express = require("express");
const usersRouter = require("../users/usersRouter");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send(`<h1>API IS UP!</h1>`);
});

//Endpoints/ Routers
server.use("/api", usersRouter);

module.exports = server;
