"use strict";

const _ = require("lodash");
const OtpGenerator = require("otp-generator");
const { Types } = require("mongoose");
const { BadRequestError } = require("../responses/error.response");
const IP_ADDRESS = require("ipaddr.js");

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
  forgotPwd: ({ fullName, email, urlVerify }) => {
    return `
    <h1>Thay đổi mật khẩu</h1>
    <p>Xin chào. ${fullName} <i>(${email})</i></p>
    <p>Bạn nhận được email này vì đã click vào quên mật khẩu trên website jobs của chúng tôi</p>
    <p style="color: red">Nếu những thông tin trên là chính xác. Vui lòng click vào link bên dưới để xác nhận và hoàn tất thủ tục thay đổi mật khẩu</>
    <div><a href=${urlVerify} target="_blank"><strong>Link thay đổi</strong></a></div><br>
    <div><strong><i>Xin chân thành cảm ơn!</i></strong></div>
    `;
  },
};

const createOTP = (number = 6) => {
  const OTP = OtpGenerator.generate(number, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  return OTP;
};

const validateObjectId = ({ id, message = "Id không hợp lệ" }) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError(message);
  }
};

function cleanupAddress(str) {
  // if it's a valid ipv6 address, and if its a mapped ipv4 address,
  // then clean it up. otherwise return the original string.
  if (IP_ADDRESS.IPv6.isValid(str)) {
    const addr = IP_ADDRESS.IPv6.parse(str);
    if (addr.isIPv4MappedAddress()) return addr.toIPv4Address().toString();
  }
  return str === "::1" ? "127.0.0.1" : str;
}

module.exports = {
  getInfoData,
  teamplateHTML,
  createOTP,
  validateObjectId,
  cleanupAddress,
};
