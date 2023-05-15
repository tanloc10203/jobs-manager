"use strict";

//-!dmbg
const mongoose = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

var userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      maxLength: 150,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      maxLength: 150,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
      },
    },
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
