const { sendEmailVerifyAccount } = require("../respository/email.res");
const { teamplateHTML } = require("../utils");

class EmailService {
  static verifyRegister = async ({ toEmail, fullName, urlVerify }) => {
    return await sendEmailVerifyAccount({
      subject: "Xác thực tài khoản",
      to: toEmail,
      html: teamplateHTML.verifyRegister({ fullName, urlVerify }),
    });
  };
}

module.exports = EmailService;
