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
    key_reset_pwd: {
      type: String,
      default: "",
    },
    api_key_admin: {
      type: String,
      default: "",
    },
    user_login: {
      type: [
        {
          ip: String,
          device: String,
          time: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    user_login_temp: {
      type: [
        {
          ip: String,
          device: String,
          time: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    ip_address_used: {
      type: [String],
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
