const db = require("../data/dbConfig");

module.exports = {
  find,
  findBy,
  add
};

function find() {
  return db("users");
}

function findBy(filter) {
  return db("users")
    .where(filter)
    .first();
}

function add(obj) {
  return db("users").insert(obj);
}
