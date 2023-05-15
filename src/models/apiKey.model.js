"use strict";

//-!dmbg
const mongoose = require("mongoose");

const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "ApiKeys";

var apiKeyTokenSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      maxlength: 1024,
      trim: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
    status: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
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
module.exports = mongoose.model(DOCUMENT_NAME, apiKeyTokenSchema);
