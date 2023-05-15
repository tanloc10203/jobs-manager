"use strict";

const configs = require("../config");
const { sendEmailVerifyAccount } = require("../respository/email.res");
const { teamplateHTML } = require("../utils");
const TokenService = require("./token.service");

class EmailService {
  static verifyRegister = async ({ toEmail, fullName, urlVerify }) => {
    return await sendEmailVerifyAccount({
      subject: "Xác thực tài khoản",
      to: toEmail,
      html: teamplateHTML.verifyRegister({ fullName, urlVerify }),
    });
  };

  static forgotPwd = async ({ toEmail, fullName, urlVerify }) => {
    return await sendEmailVerifyAccount({
      subject: "Quên mật khẩu",
      to: toEmail,
      html: teamplateHTML.forgotPwd({ email: toEmail, fullName, urlVerify }),
    });
  };

  static sendEmailAccount = async ({ userId, toEmail, fullName }) => {
    const token = await TokenService.createToken(userId);
    const urlVerify = `${configs.baseUrlClient}/confirm/account/${userId}?token=${token}`;

    await EmailService.verifyRegister({ toEmail, fullName, urlVerify });
    return true;
  };

  static sendEmailForgotPwd = async ({ userId, token, toEmail, fullName }) => {
    const urlVerify = `${configs.baseUrlClient}/confirm/account/change/pwd/${userId}?token=${token}`;
    await EmailService.forgotPwd({ toEmail, fullName, urlVerify });
    return true;
  };
}

module.exports = EmailService;
