const permissionModel = require("../models/permission.model");
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

const findByName = async (name) => {
  return await permissionModel.findOne({ name });
};

const findBySlug = async (slug) => {
  return await permissionModel.findOne({ slug });
};

const insertPermission = async ({ name, slug, desc }) => {
  const insert = new permissionModel({
    name,
    slug,
    desc,
  });

  return await insert.save();
};

const getAll = async (filters = {}) => {
  return await permissionModel.find().lean();
};

module.exports = {
  isAdminFirstStartApplication,
  findByName,
  findBySlug,
  insertPermission,
  getAll,
};
