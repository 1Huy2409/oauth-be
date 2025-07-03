import {
  ConflictRequestError,
  AuthFailureError,
  BadRequestError,
  NotFoundError,
} from "../handlers/error.response.js";
import { randomToken } from "../utils/token.util.js";
import { mailService } from "../services/mail.service.js";
export default class AuthService {
  constructor(User, AuthUtil) {
    this.userModel = User;
    this.authUtil = AuthUtil;
  }
  register = async (data) => {
    const existingEmail = await this.userModel.findOne({ email: data.email });
    if (existingEmail) {
      throw new ConflictRequestError("This email already exist");
    }
    const existingUsername = await this.userModel.findOne({
      username: data.username,
    });
    if (existingUsername) {
      throw new ConflictRequestError("This username already exist");
    }
    const hashedPassword = await this.authUtil.hashPassword(data.password);
    const newUser = new this.userModel({
      fullname: data.fullname,
      email: data.email,
      username: data.username,
      password: hashedPassword,
      loginMethod: "local",
      role: "user",
    });
    await newUser.save();
    const { id, fullname, email, username, role } = newUser;
    const user = { id, fullname, email, username, role };
    if (!user) {
      throw new BadRequestError("Client Bad Request!");
    }
    return user;
  };
  login = async (data) => {
    const user = await this.userModel.findOne({ username: data.username });
    if (user) {
      const { id, email, username, fullname, role } = user;
      const check = await this.authUtil.comparePassword(
        data.password,
        user.password
      );
      if (!check) {
        throw new BadRequestError("Password is incorrect!");
      } else {
        const accessToken = this.authUtil.signAccessToken({
          id,
          email,
          username,
          role,
        });
        const refreshToken = this.authUtil.signRefreshToken({
          id,
          email,
          username,
          role,
        });
        const dataUser = { id, fullname, email, username, role };
        return {
          data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: dataUser,
          },
          msg: "Login successfully!",
        };
      }
    } else {
      throw new BadRequestError("Username not found!");
    }
  };
  googleLogin = async (user) => {
    if (!user) {
      throw new BadRequestError("This user doesnt exist!");
    }
    const findUser = await this.userModel.findOne({ email: user.email });
    if (!findUser) {
      throw new BadRequestError("This user doesnt exist!");
    }
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    console.log(payload);
    const accessToken = this.authUtil.signAccessToken(payload);
    const refreshToken = this.authUtil.signRefreshToken(payload);
    const data = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return data;
  };
  facebookLogin = async (user) => {
    if (!user) {
      throw new BadRequestError("This user doesnt exist!");
    }
    const findUser = await this.userModel.findOne({ email: user.email });
    if (!findUser) {
      throw new BadRequestError("This user doesnt exist!");
    }
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const accessToken = this.authUtil.signAccessToken(payload);
    const refreshToken = this.authUtil.signRefreshToken(payload);
    const data = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return data;
  };
  logout = async (token, res) => {
    if (!token)
    {
      throw new AuthFailureError("Refresh Token not found!")
    }
    res.clearCookie("refreshToken");
  }
  refreshToken = async (req) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const { id, email, username, role } =
        this.authUtil.verifyRefreshToken(refreshToken);
      const newPayload = { id, email, username, role };
      const newAccessToken = this.authUtil.signAccessToken(newPayload);
      const newRefreshToken = this.authUtil.signRefreshToken(newPayload);
      return {
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
        msg: "This is new access token!",
      };
    } else {
      throw new AuthFailureError("Refresh token not found!");
    }
  };
  forgotPasswordService = async (email) => {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundError("Email not found!");
    }
    const token = randomToken();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetToken = token;
    user.passwordResetExpiration = expires;
    await user.save();

    const objectMail = {
      emailFrom: process.env.SMTP_USER,
      emailTo: email,
      emailSubject: "RESET PASSWORD",
      emailText: `Use this OTP code to reset your password: ${token}. This OTP code will expire in 10 minutes.`,
    };
    console.log(objectMail);
    try {
      await mailService.sendEmail(objectMail);
      return {
        success: true,
        message: "Send mail successfully!",
      };
    } catch (error) {
      console.error("Mail error:", error);
      return {
        success: false,
        errMessage: error.message,
      };
    }
  };
  resetPasswordService = async (data) => {
    const user = await this.userModel.findOne({
      email: data.email,
      passwordResetToken: data.passwordResetToken,
      passwordResetExpiration: { $gt: new Date() },
    });
    if (!user) {
      return false;
    }

    const hashedNewPassword = await this.authUtil.hashPassword(
      data.newPassword
    );
    user.password = hashedNewPassword;
    user.passwordResetToken = null;
    user.passwordResetExpiration = null;
    await user.save();
    return true;
  };
}
