import {
  AuthFailureError,
  BadRequestError,
} from "../handlers/error.response.js";
export default class AuthValidator {
  constructor() {}

  // validate register
  registerValidate = async (req, res, next) => {
    try {
      const user = req.body;
      if (!user.fullname || !user.email || !user.username || !user.password) {
        throw new BadRequestError("Nhập thiếu thông tin!");
      }
      // validate fullname
      if (user.fullname.trim().length < 10) {
        throw new BadRequestError("Name must be at least 10 characters");
      }
      // validate email (regex and duplicate email)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const checkEmail = emailRegex.test(user.email);
      if (!checkEmail) {
        throw new BadRequestError("Email is invalid");
      }
      // validate username
      if (user.username.trim().length < 5) {
        throw new BadRequestError("Username must be at least 5 characters");
      }
      // validate password (minlength = 5)
      if (user.password.trim().length < 5) {
        throw new BadRequestError("Password must be at least 5 characters");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
  loginValidate = async (req, res, next) => {
    try {
      const user = req.body;
      if (!user.username) {
        throw new BadRequestError("Please enter username");
      }
      if (!user.password) {
        throw new BadRequestError("Please enter password");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
