const { hashToken, insertToken } = require("../respository/token.res");
const { createOTP } = require("../utils");

class TokenService {
  static createToken = async (userId) => {
    const OTP = createOTP();

    const hashOTP = await hashToken(OTP);

    await insertToken({ token: hashOTP, userId });

    return OTP;
  };
}

module.exports = TokenService;
