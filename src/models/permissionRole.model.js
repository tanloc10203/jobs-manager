"use strict";

//-!dmbg
const mongoose = require("mongoose");

const DOCUMENT_NAME = "PermissionRole";
const COLLECTION_NAME = "PermissionRoles";

var PermissionRoleTokenSchema = new mongoose.Schema(
  {
    permission: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
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
module.exports = mongoose.model(DOCUMENT_NAME, PermissionRoleTokenSchema);
