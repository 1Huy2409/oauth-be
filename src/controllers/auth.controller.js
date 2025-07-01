import {
  AuthFailureError,
  BadRequestError,
} from "../handlers/error.response.js";
import { OK } from "../handlers/success.response.js";
export default class AuthController {
  constructor(AuthService) {
    this.authService = AuthService;
  }
  // auth register controller
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
  // auth login controller
  login = async (req, res, next) => {
    const credential = {
      username: req.body.username,
      password: req.body.password,
    };
    const { data, msg } = await this.authService.login(credential);
    const { accessToken, refreshToken, user } = data;
    // store refreshToken in http only cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(Date.now() + 365 * 24 * 3600000),
    });
    new OK({
      message: msg,
      metadata: {
        accessToken: accessToken,
        user: user
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
    // new OK({
    //   message: "Login successfully!",
    //   metadata: accessToken,
    // }).send(res);
    const frontendURL = `http://localhost:5173/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(req.user))}`
    res.redirect(frontendURL)
  };
  facebookLogin = async (req, res, next) => {
        const { accessToken, refreshToken } = await this.authService.facebookLogin(req.user)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            expires: new Date(Date.now() + 7 * 24 * 3600000),
        });
        new OK({
            message: "Login successfully!",
            metadata: accessToken
        }).send(res)
    }
  // auth refreshToken controller
  refreshToken = async (req, res, next) => {
    try {
      // check data then return http status code
      const { data, msg } = await this.authService.refreshToken(req);
      if (data != null) {
        const { accessToken, refreshToken } = data;
        // store refreshToken in http only cookies
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          expires: new Date(Date.now() + 365 * 24 * 3600000),
        });
        new OK({
          message: msg,
          metadata: {
            accessToken: accessToken,
          },
        }).send(res);
      }
    } catch (error) {
      next(error);
    }
  };
  // auth logout controller
  logout = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        res.clearCookie("refreshToken");
        new OK({
          message: "Log out successfully!",
        }).send(res);
      } else {
        throw new AuthFailureError("Refresh token not found!");
      }
    } catch (error) {
      next(error);
    }
  };
}
