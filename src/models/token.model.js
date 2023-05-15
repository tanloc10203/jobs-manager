"use strict";

const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const DOCUMENT_NAME = "Token";
const COLLECTION_NAME = "Tokens";

const TokenSchema = new Schema(
  {
    user_id: {
      type: ObjectId,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expire_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: COLLECTION_NAME,
  }
);

TokenSchema.index("expire_at", { expireAfterSeconds: 30 });

//Export the model
module.exports = model(DOCUMENT_NAME, TokenSchema);
