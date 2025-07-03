import {
  AuthFailureError,
  BadRequestError,
} from "../handlers/error.response.js";
import { OK } from "../handlers/success.response.js";
export default class AuthController {
  constructor(AuthService) {
    this.authService = AuthService;
  }

  register = async (req, res, next) => {
    const data = {
      fullname: req.body.fullname,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    };
    const newUser = await this.authService.register(data);
    new OK({
      message: "Register successfully! Please login!",
      metadata: {
        user: newUser,
      },
    }).send(res);
  };
  
  login = async (req, res, next) => {
    const credential = {
      username: req.body.username,
      password: req.body.password,
    };
    const { data, msg } = await this.authService.login(credential);
    const { accessToken, refreshToken, user } = data;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    });
    new OK({
      message: msg,
      metadata: {
        accessToken: accessToken,
        user: user,
      },
    }).send(res);
  };
  
  googleLogin = async (req, res, next) => {
    const { accessToken, refreshToken } = await this.authService.googleLogin(
      req.user
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    });
    const frontendURL = `http://localhost:5173/auth/callback?token=${accessToken}&user=${encodeURIComponent(
      JSON.stringify(req.user)
    )}`;
    res.redirect(frontendURL);
  };
  
  facebookLogin = async (req, res, next) => {
    const { accessToken, refreshToken } = await this.authService.facebookLogin(req.user)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    });
    const frontendURL = `http://localhost:5173/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(req.user))}`
    res.redirect(frontendURL)
  }
  
  refreshToken = async (req, res, next) => {
    const { data, msg } = await this.authService.refreshToken(req);
    if (data != null) {
      const { accessToken, refreshToken } = data;
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(Date.now() + 7 * 24 * 3600000),
      });
      new OK({
        message: msg,
        metadata: {
          accessToken: accessToken,
        },
      }).send(res);
    }
  };
  
  logout = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    await this.authService.logout(refreshToken, res)
    new OK({
      message: "Log out successfully!",
    }).send(res);
  };

  forgotPasswordController = async (req, res, next) => {
    const inputEmail = req.body.email;
    if (!inputEmail) {
      throw new BadRequestError("Please enter your email!");
    }
    const result = await this.authService.forgotPasswordService(inputEmail);
    if (result.success) {
      new OK({
        message: "Send mail successfully!",
        metadata: {},
      }).send(res);
    } else {
      throw new BadRequestError("Client bad request!");
    };
  }

  resetPasswordController = async (req, res, next) => {
    const { email, passwordResetToken, newPassword } = req.body;
    const data = { email, passwordResetToken, newPassword };
    const result = await this.authService.resetPasswordService(data);
    if (result) {
      new OK({
        message: "Reset password successfully!",
        metadata: {},
      }).send(res);
    } else {
      throw new BadRequestError("Client bad request!");
    }
  };
}
