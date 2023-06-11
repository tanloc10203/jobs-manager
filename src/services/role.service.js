"use strict";

const { Roles, PermissionsApiKey } = require("../const");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const { getInfoData } = require("../utils");
const EmailService = require("./email.service");
const ApiKeyService = require("./apiKey.service");
const {
  findByName,
  findBySlug,
  insertPermission,
  getAll,
} = require("../respository/permission.res");
const { ConflictRequestError } = require("../responses/error.response");
const { findOneRoleByName, insertRole } = require("../respository/role.res");
const {
  findOneByPerRole,
  insertPermissionRole,
} = require("../respository/permissionRole.res");

class RoleService {
  static create = async ({ name, desc, permissions = [] }) => {
    if (await findOneRoleByName(name)) {
      throw new ConflictRequestError("Tên vai trò đã tồn tại.");
    }

    const roleInsert = await insertRole(name, desc);

    const permiss = permissions.map(
      (p) =>
        new Promise(async (resolve) => {
          if (
            await findOneByPerRole({ permission: p._id, role: roleInsert._id })
          ) {
            throw new ConflictRequestError(
              `Tên quyền \`${p.name}\` đã tồn tại trong vài trò này.`
            );
          }

          await insertPermissionRole({
            permission: p._id,
            role: roleInsert._id,
          });

          resolve(true);
        })
    );

    await Promise.all(permiss);

    return true;
  };
}

module.exports = RoleService;
