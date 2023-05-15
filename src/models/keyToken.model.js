"use strict";

//-!dmbg
const mongoose = require("mongoose");

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    public_key: {
      type: String,
      required: true,
    },
    private_key: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    refresh_tokens_used: {
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
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
