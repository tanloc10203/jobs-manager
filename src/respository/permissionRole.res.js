const permissionRoleModel = require("../models/permissionRole.model");

exports.findOneByPerRole = async ({ permission, role }) => {
  return await permissionRoleModel.findOne({ permission, role });
};

exports.insertPermissionRole = async ({ permission, role }) => {
  const insert = new permissionRoleModel({
    permission,
    role,
  });

  return await insert.save();
};
