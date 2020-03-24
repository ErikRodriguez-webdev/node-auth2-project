const express = require("express");
const Users = require("./usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const restricted = require("../auth/restricted-middleware");

const router = express.Router();

router.post("/register", (req, res) => {
  const aUser = req.body;
  const hash = bcrypt.hashSync(aUser.password, 8);

  aUser.password = hash;

  Users.add(req.body)
    .then(() => {
      res.status(201).json({ message: "successfully created an account." });
    })
    .catch(() => {
      res.status(500).json({ message: "Error adding user." });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({ username: user.username, aToken: token });
      } else {
        res.status(401).json({ message: "User is not authorized." });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Invalid Credentials" });
    });
});

router.get("/users", restricted, (req, res) => {
  Users.find()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(() => {
      res.status(400).json({ message: "You shall not pass" });
    });
});

function generateToken(userOBJ) {
  const payload = {
    subject: userOBJ.id,
    username: userOBJ.username
  };

  const secrets = "my own secret";

  const options = {
    expiresIn: "1h"
  };
  return jwt.sign(payload, secrets, options);
}

module.exports = router;
