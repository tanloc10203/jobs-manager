"use strict";

const configs = require("../config");
const { sendEmail } = require("../respository/email.res");
const { teamplateHTML } = require("../utils");
const TokenService = require("./token.service");

class EmailService {
  static sendEmailAccount = async ({ userId, toEmail, fullName }) => {
    const token = await TokenService.createToken(userId);
    const urlVerify = `${configs.baseUrlClient}/confirm/account/${userId}?token=${token}`;

    return await sendEmail({
      subject: "Xác thực tài khoản",
      to: toEmail,
      html: teamplateHTML.verifyRegister({ fullName, urlVerify }),
    });
  };

  static sendEmailForgotPwd = async ({ userId, token, toEmail, fullName }) => {
    const urlVerify = `${configs.baseUrlClient}/confirm/account/change/pwd/${userId}?token=${token}`;

    return sendEmail({
      subject: "Quên mật khẩu",
      to: toEmail,
      html: teamplateHTML.forgotPwd({ email: toEmail, fullName, urlVerify }),
    });
  };

  static sendEmailInforAdmin = async ({
    displayName,
    timeReg,
    codeAdmin,
    toEmail,
    apiKey,
  }) => {
    return await sendEmail({
      subject: "Thông tin đăng ký admin",
      to: toEmail,
      html: teamplateHTML.inforAdmin({
        displayName,
        timeReg,
        codeAdmin,
        apiKey,
      }),
    });
  };

  static sendEmailVerifyAdmin = async ({
    toEmail,
    device,
    ip,
    timeLogin,
    urlVerify,
  }) => {
    return await sendEmail({
      subject: "Cảnh báo đăng nhập",
      to: toEmail,
      html: teamplateHTML.verifyAdmin({
        device,
        ip,
        timeLogin,
        urlVerify,
      }),
    });
  };
}

module.exports = EmailService;
