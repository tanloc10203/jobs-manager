"use strict";

//-!dmbg
const mongoose = require("mongoose");

const DOCUMENT_NAME = "Permission";
const COLLECTION_NAME = "Permissions";

var PermissionTokenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
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
module.exports = mongoose.model(DOCUMENT_NAME, PermissionTokenSchema);
