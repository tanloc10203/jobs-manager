"use strict";

const { Roles, PermissionsApiKey } = require("../const");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const { createOTP } = require("../utils");
const EmailService = require("./email.service");
const ApiKeyService = require("./apiKey.service");

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

    const keyAdmin = `${createOTP(16)}${createOTP(16)}`;

    console.log("Key ADMIN:::", keyAdmin);

    const keyAdminHash = await bcrypt.hash(keyAdmin, 10);

    const userInsert = new userModel({
      full_name: fullName,
      password: passwordHash,
      email: email,
      roles: role,
      api_key_admin: keyAdminHash,
      ip_address: ipAddress,
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
}

module.exports = PermissionService;
