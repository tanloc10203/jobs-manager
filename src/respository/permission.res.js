const { ForbiddenRequestError } = require("../responses/error.response");
const { findUserIsAdmin } = require("./user.res");

/**
 * @description Kiểm tra ứng dụng đã tài khoản admin chưa. Nếu chưa có nghĩa là lần đầu khởi tạo ứng dụng. Bắt buộc phải tạo tài khoản admin
 *
 * @returns
 */
const isAdminFirstStartApplication = async () => {
  /* 
    Tìm kiếm xem api đã được tạo chưa. API key chỉ được sử dụng 1 lần.
    Nếu chưa nghĩa là lần đầu tạo. Thì phải đi đăng ký làm admin.
  */
  const apiKeyStore = await findUserIsAdmin();

  console.log(apiKeyStore);

  if (apiKeyStore.length > 1) {
    throw new ForbiddenRequestError("You are not allowed...");
  }

  if (apiKeyStore.length == 0) {
    return {
      start: false,
    };
  }

  return {
    start: true,
  };
};

module.exports = {
  isAdminFirstStartApplication,
};
