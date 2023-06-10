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

class PermissionService {
  static createAdmin = async ({ ipAddress, fullName, password, email }) => {
    /**
      - Tạo 1 dãy số admin random ngẫu nhiên. 
      Sau đó lưu mã hash của số đó vào database.
      Nếu là admin thì sẽ kiểm tra thêm mã admin có khớp không.
      - Role: SUPER_ADMIN
      - Sau khi tạo admin xong. Tiến hành tạo API_KEY sử dụng cho ứng dụng.
      - 1 ứng dụng chỉ có 1 API_KEY supper_admin và 1 supper admin.
     */

    const role = [Roles.SUPPER_ADMIN];

    const passwordHash = await bcrypt.hash(password, 10);

    const userInsert = new userModel({
      full_name: fullName,
      password: passwordHash,
      email: email,
      roles: role,
      ip_address_used: [ipAddress],
    });

    const user = await userInsert.save();

    // API KEY dành cho supper admin
    const apiKeyStore = await ApiKeyService.createApiKey({
      ipAddress,
      permission: PermissionsApiKey[0],
    });

    await EmailService.sendEmailAccount({
      userId: user._id,
      toEmail: email,
      fullName,
    });

    return {
      ...getInfoData({
        fileds: ["_id", "full_name", "email"],
        object: user,
      }),
      apiKey: apiKeyStore.key,
    };
  };

  static createPermission = async ({ name, slug, desc }) => {
    if (await findByName(name)) {
      throw new ConflictRequestError("Tên quyền đã tồn tại.");
    }

    if (await findBySlug(slug)) {
      throw new ConflictRequestError("Slug đã tồn tại.");
    }

    return await insertPermission({ name, slug, desc });
  };

  static updatePermission = async ({ name, slug, desc, id }) => {
    let permission = await findByName(name);

    if (permission && permission._id.toString() !== id) {
      throw new ConflictRequestError("Tên quyền đã tồn tại.");
    }

    permission = await findBySlug(slug);

    if (permission && permission._id.toString() !== id) {
      throw new ConflictRequestError("Slug đã tồn tại.");
    }

    permission.name = name;
    permission.slug = slug;
    permission.desc = desc;

    return await permission.save();
  };

  static getAllPermission = async (filters = {}) => {
    return await getAll(filters);
  };
}

module.exports = PermissionService;
