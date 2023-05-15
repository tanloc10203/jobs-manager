"use strict";

const _ = require("lodash");
const OtpGenerator = require("otp-generator");

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

const teamplateHTML = {
  verifyRegister: ({ fullName, urlVerify }) => {
    return `
    <h1>Xác thực tài khoản</h1>
    <p>Xin chào. ${fullName}</p>
    <p>Bạn nhận được email này vì đã đăng ký trên website manager jobs của chúng tôi</p>
    <p style="color: red">Nếu những thông tin trên là chính xác. Vui lòng click vào link bên dưới để xác nhận và hoàn tất thủ tục xác thực tài khoản</>
    <div><a href=${urlVerify} target="_blank"><strong>Link xác nhận</strong></a></div><br>
    <div><strong><i>Xin chân thành cảm ơn!</i></strong></div>
    `;
  },
};

const createOTP = () => {
  const OTP = OtpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  return OTP;
};

module.exports = {
  getInfoData,
  teamplateHTML,
  createOTP,
};
