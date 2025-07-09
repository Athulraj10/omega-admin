const Response = require("./Response");
const Joi = require("@hapi/joi");
const Helper = require("./Helper");
const Constants = require("../services/Constants");

module.exports = {
  /**
   * @description This function is used to validate Admin Login fields.
   * @param req
   * @param res
   */
  loginValidation: (req, res, callback) => {
    const schema = Joi.object({
      email: Joi.string().trim().required(),
      password: Joi.string().trim().required(),
      device_code: Joi.string().trim().required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log(error);
      return Response.validationErrorResponseData(res, res.__(Helper.validationMessageKey("loginValidation", error)));
    }
    return callback(true);
  },
  logoutAndBlockValidation: (req, res, callback) => {
    const schema = Joi.object({
      id: Joi.string().trim().required(),
      action_type: Joi.string().valid("logout", "block").required(),
    });
    const { error } = schema.validate(req);
    if (error) {
      console.log(error)
      return Response.validationErrorResponseData(
        res,
        res.__(Helper.validationMessageKey("logoutAndBlockValidation", error))
      );
    }
    return callback(true);
  },
};
