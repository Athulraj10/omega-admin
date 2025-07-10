const bcrypt = require("bcrypt");
const Response = require("../../services/Response");
const {
  ACTIVE,
  SUCCESS,
  BAD_REQUEST,
  FAIL,
  INTERNAL_SERVER,
  DELETE,
  ROLES
} = require("../../services/Constants");
const { makeRandomNumber, AppName } = require("../../services/Helper");
// const Mailer = require("../../services/Mailer");
const { User, Otp } = require("../../models");
const formatUserData = require("../../services/formatUserData");
const { issueAdmin } = require("../../services/Admin_jwtToken");
const { loginValidation, logoutAndBlockValidation } = require("../../services/AdminValidation");

module.exports = {
  login: async (req, res) => {
    try {
      const requestParams = req.body;
      console.log("login", requestParams);
      loginValidation(requestParams, res, async (validate) => {
        if (validate) {
          console.log("login validate", validate);
          let user = null;
          let browser_ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
          const system_ip = req.clientIp;
          {
            console.log("not google login");
            let isPassword = false; // FIXED: Initialize as false for security
            const filters = [];

            if (requestParams.email) {
              filters.push({ email: requestParams.email.toLowerCase() });
            }
            if (requestParams.mobile_no) {
              filters.push({ mobile_no: requestParams.mobile_no });
            }

            // if (requestParams.device_code) {
            //   filters.push({ device_code: requestParams.device_code.toLowerCase() });
            // }

            let user;

            if (filters.length > 0) {
              user = await User.findOne({
                $and: [
                  { $or: filters },
                  { role: { $ne: ROLES.USER.name } }
                ]
              })
                .populate("currency_id")
                .sort({ last_login: -1 });
            }
console.log({user})
            if (user) {
              if (user.email_verify === null) {
                Response.errorResponseWithoutData(res, res.locals.__("emailNotVerified"), FAIL);
              } else {
                if (user?.status === ACTIVE) {
                  // FIXED: Always require password validation
                  if (requestParams.password && user.password) {
                    const comparePassword = await bcrypt.compare(requestParams.password, user.password);
                    isPassword = comparePassword; // Set based on actual comparison result
                    console.log('🔐 Password comparison result:', { 
                      provided: !!requestParams.password, 
                      stored: !!user.password, 
                      match: comparePassword 
                    });
                  } else {
                    // FIXED: If no password provided or user has no password, authentication fails
                    isPassword = false;
                    console.log('❌ Password validation failed:', { 
                      provided: !!requestParams.password, 
                      stored: !!user.password 
                    });
                  }
                  if (isPassword) {
                    const payload = {
                      id: user._id,
                      role: user.role,
                      level: user.roleLevel,
                      exp: Math.floor(Date.now() / 1000) +
                        60 * 60 * 6 * process.env.SUPER_ADMIN_TOKEN_EXP
                    };

                    const token = issueAdmin(payload);
                    const meta = { token };

                    tokenUpdate = {
                      $set: {
                        last_login: new Date(),
                        token: token,
                        device_code: requestParams.device_code,
                        "ip_address.system_ip": system_ip,
                        "ip_address.browser_ip": browser_ip,
                      },
                    };

                    // await User.updateOne({ _id: user?._id }, tokenUpdate);
                    const updatedUser = await User.findOneAndUpdate({ _id: user?._id }, tokenUpdate, { new: true });


                    let userData = formatUserData(user)

                    return Response.successResponseData(
                      res,
                      userData,
                      SUCCESS,
                      res.locals.__("loginSucceeded"),
                      meta
                    );
                  } else {
                    return Response.errorResponseWithoutData(res, res.locals.__("emailPasswordNotMatch"), FAIL);
                  }
                } else {
                  if (user?.status === DELETE) {
                    Response.errorResponseWithoutData(res, res.locals.__("accountIsDeleted"), FAIL);
                  } else {
                    Response.errorResponseWithoutData(res, res.locals.__("accountIsInactive"), FAIL);
                  }
                }
              }
            } else {
              Response.errorResponseWithoutData(res, res.locals.__("userNotExist"), FAIL);
            }
          }
        }
      });

      // const user = await User.findOne({ username:requestParams.username });
      // res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return Response.errorResponseData(res, res.__("internalError"), INTERNAL_SERVER);
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const reqParam = req.body;
      forgotPasswordValidation(reqParam, res, async (validate) => {
        if (validate) {
          const minutesLater = new Date();
          const restTokenExpire = minutesLater.setMinutes(minutesLater.getMinutes() + 60);
          const otp = await makeRandomNumber(4);
          let user = await User.findOne({ email: reqParam.email }, { name: 1, status: 1 });

          if (user) {
            const locals = {
              appName: AppName,
              otp,
            };
            if (user?.status === ACTIVE) {
              await Otp.deleteMany({ user_id: user._id });
              await Otp.create({
                user_id: user._id,
                otp: otp,
                code_expiry: restTokenExpire,
              });

              // await Mailer.sendMail(reqParam.email, "Forgot Password", forgotTemplate, locals);

              return Response.successResponseData(res, res.locals.__("forgotPasswordEmailSendSuccess"), SUCCESS);
            } else {
              Response.errorResponseWithoutData(res, res.locals.__("accountIsInactive"), FAIL);
            }
          } else {
            Response.errorResponseWithoutData(res, res.locals.__("emailNotExists"), FAIL);
          }
        }
      });
    } catch (error) {
      return Response.errorResponseData(res, error.message, INTERNAL_SERVER);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const reqParam = req.body;
      resetPassValidation(reqParam, res, async (validate) => {
        if (validate) {
          const valid = await Otp.findOne({ otp: reqParam.otp }, { otp: 1, user_id: 1, code_expiry: 1 }).populate(
            "user_id",
            "email name password"
          );
          if (valid && reqParam.email === valid.user_id?.email) {
            if (valid.code_expiry != null) {
              if (valid.code_expiry.getTime() >= Date.now()) {
                const passCheck = await bcrypt.compare(reqParam.password, valid?.user_id?.password);
                if (!passCheck) {
                  const hashPass = bcrypt.hashSync(reqParam?.password, 10);
                  await User.findByIdAndUpdate(valid?.user_id?._id, {
                    $set: { password: hashPass },
                  });
                  await Otp.findByIdAndDelete(valid._id);
                  return Response.successResponseWithoutData(res, res.locals.__("PasswordResetSuccessfully"), SUCCESS);
                } else {
                  return Response.errorResponseWithoutData(
                    res,
                    res.locals.__("existingPasswordNotAllowed"),
                    BAD_REQUEST
                  );
                }
              } else {
                return Response.errorResponseWithoutData(res, res.locals.__("otpExpired"), BAD_REQUEST);
              }
            } else {
              return Response.errorResponseWithoutData(res, res.locals.__("invalidOtp"), BAD_REQUEST);
            }
          } else {
            return Response.errorResponseWithoutData(res, res.locals.__("invalidOtp"), BAD_REQUEST);
          }
        }
      });
    } catch (error) {
      return Response.errorResponseData(res, error.message, INTERNAL_SERVER);
    }
  },

  logout: async (req, res) => {
    try {
      const requestParams = req.body;
      console.log({ requestParams })
      logoutAndBlockValidation(requestParams, res, async (validate) => {
        if (validate) {
          let browser_ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
          console.log(requestParams)
          const system_ip = req.clientIp;
          await User.updateOne(
            { _id: requestParams.id },
            {
              $set: {
                token: null,
                "ip_address.system_ip": system_ip,
                "ip_address.browser_ip": browser_ip,
              },
            }
          );
          return Response.successResponseWithoutData(res, res.locals.__("logoutSuccessfully"), SUCCESS);
        }
      });
    } catch (error) {
      return Response.errorResponseWithoutData(res, res.locals.__("internalError"), INTERNAL_SERVER);
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { id, name, email, password, userName, first_name, last_name } = req.body;
      if (!id || !name || !email) {
        return Response.errorResponseWithoutData(res, "Missing required fields", FAIL);
      }
      const updateData = { name, email };
      if (userName) updateData.userName = userName;
      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (password) {
        const bcrypt = require("bcryptjs");
        updateData.password = await bcrypt.hash(password, 10);
      }
      const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
      if (!updatedUser) {
        return Response.errorResponseWithoutData(res, "User not found", FAIL);
      }
      const userData = formatUserData(updatedUser);
      return Response.successResponseData(res, userData, SUCCESS, "Profile updated successfully");
    } catch (error) {
      return Response.errorResponseData(res, error.message, INTERNAL_SERVER);
    }
  },
};
