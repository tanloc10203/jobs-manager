"use strict";

const { Ok } = require("../responses/success.response");
const {
  isAdminFirstStartApplication,
} = require("../respository/permission.res");
const PermissionService = require("../services/permission.service");
const { BadRequestError } = require("../responses/error.response");
const { ForbiddenRequestError } = require("../responses/error.response");

class PermissionController {
  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  checkAPIKey = async (req, res) => {
    const ip = req.ipClient;

    return new Ok({
      message: "Check Start Application Success",
      metadata: {
        ...(await isAdminFirstStartApplication()),
        ip,
      },
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  createAdmin = async (req, res) => {
    const checkAdmin = await isAdminFirstStartApplication();

    if (checkAdmin.start) {
      throw new ForbiddenRequestError("Bạn không được phép truy cập.");
    }

    const ip = req.ipClient;

    const body = req.body;

    if (!body.email || !body.password || !body.fullName) {
      throw new BadRequestError("Missing body data email, password, fullName");
    }

    return new Ok({
      message: "Create Admin Success",
      metadata: {
        ...(await PermissionService.createAdmin({
          email: body.email,
          password: body.password,
          fullName: body.fullName,
          ipAddress: ip,
        })),
      },
    }).send(res);
  };
}

module.exports = new PermissionController();
