const roleModel = require("../models/role.model");

exports.findOneRoleByName = async (name) => {
  return await roleModel.findOne({ name });
};

exports.insertRole = async (name, desc) => {
  const insert = new roleModel({
    name,
    desc,
  });

  return await insert.save();
};
