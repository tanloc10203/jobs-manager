"use strict";

const mongoose = require("mongoose");
const configs = require("../config");

class Database {
  constructor() {
    this.connect();
  }

  connect = () => {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });

    mongoose
      .connect(configs.mongoUri)
      .then((_) => console.log("Connected mongodb success."))
      .catch((error) => console.log("Error connect mongodb:", error));
  };

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
