"use strict";

const { Ok } = require("../responses/success.response");
const {
  isAdminFirstStartApplication,
} = require("../respository/permission.res");

const { BadRequestError } = require("../responses/error.response");
const { ForbiddenRequestError } = require("../responses/error.response");
const RoleService = require("../services/role.service");

class RoleController {
  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  create = async (req, res) => {
    const body = req.body;

    if (!body.name || !body.desc || !body.permissions?.length) {
      throw new BadRequestError("Missing body data name, desc, permissions");
    }

    return new Ok({
      message: "Create Permission Success",
      metadata: await RoleService.create({
        name: body.name,
        permissions: body.permissions,
        desc: body.desc,
      }),
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  updatePermission = async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    if (!body.name || !body.slug || !body.desc) {
      throw new BadRequestError("Missing body data name, slug, desc");
    }

    return new Ok({
      message: "Create Permission Success",
      metadata: true,
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  getAllPermission = async (req, res) => {
    const filters = req.query;

    return new Ok({
      message: "Get All Permission Success",
      metadata: true,
    }).send(res);
  };
}

module.exports = new RoleController();
