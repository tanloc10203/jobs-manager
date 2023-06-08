"use strict";

const _ = require("lodash");
const OtpGenerator = require("otp-generator");
const { Types } = require("mongoose");
const { BadRequestError } = require("../responses/error.response");
const IP_ADDRESS = require("ipaddr.js");
const { formatTimeMoongoes } = require("../helpers/format.helper");

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
  verifyAdmin: ({ timeLogin, device, ip, urlVerify }) => {
    const time = formatTimeMoongoes(timeLogin);

    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <html lang="en">

      <head></head>
      <body style="background-color:#fff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
      <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em">
        <tr style="width:100%">
          <td>
            <table style="border:1px solid rgb(0,0,0, 0.1);border-radius:3px;overflow:hidden" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
              <tbody>
                <tr>
                  <td><img src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/yelp-header.png" width="620" style="display:block;outline:none;border:none;text-decoration:none" />
                    <table width="100%" style="padding:20px 40px;padding-bottom:0" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td>
                            <h3 style="font-size:22px;font-weight:bold; text-align:center; line-height: 1.5">Chúng tôi nhận thấy một lần đăng nhập gần đây vào tài khoản quản trị của bạn.</h3>
                            
                            <p style="font-size:16px;line-height:24px;margin:16px 0"><b>Thời gian: </b>${time}</p>
                            <p style="font-size:16px;line-height:24px;margin:16px 0"><b>Thiết bị: </b>${device}</p>
                            <p style="font-size:16px;line-height:24px;margin:16px 0"><b>Địa chỉ ip: </b>${ip}</p>
                            <p style="font-size:16px;line-height:24px;margin:16px 0;margin-top:-5px; color: red">* Nếu đó  là bạn vui lòng click vào link này để tiếp tục. <a href="${urlVerify}" style="font-size:16px;line-height:24px;margin:16px 0;margin-top:-5px">Đó là tôi</a> </p>
                           
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table style="padding:45px 0 0 0" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
              <tbody>
                <tr>
                  <td><img src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/yelp-footer.png" width="620" style="display:block;outline:none;border:none;text-decoration:none" /></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>
      </body>

    </html>
    `;
  },
  inforAdmin: ({ displayName, timeReg, codeAdmin, apiKey }) => {
    const time = formatTimeMoongoes(timeReg);

    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <html lang="en">
      <body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,&quot;Helvetica Neue&quot;,Ubuntu,sans-serif">
        <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px">
          <tr style="width:100%">
            <td>
              <table style="padding:0 48px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                <tbody>
                  <tr>
                    <td>
                      <h3 style="color: #656ee8">Xin chào, ${displayName}</h3>
                      <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                      <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Xin chúc mừng, bấy giờ bạn đã trở thành admin của website</p>
                      <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Các thông tin sau khi đăng ký admin</p>
                      <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                      <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left"><b>Thời gian đăng ký:</b> ${time}</p>
                      <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left"><b>CODE:</b> ${codeAdmin}</p>
                      <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left"><b>API KEY:</b> ${apiKey}</p>
                    
                      <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </table>
      </body>
    
    </html>
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
