import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import AuthController from "../controllers/auth.controller.js";
import AuthService from "../services/auth.service.js";
import AuthUtil from "../utils/auth.util.js";
import User from "../models/user.model.js";
import Validate from "../middlewares/validate.js";
import AuthValidator from "../validators/auth.validator.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import passport from "../configs/passport.config.js";
import { Passport } from "passport";
export default class AuthRouter {
  constructor() {
    this.router = Router();
    this.authController = new AuthController(
      new AuthService(User, new AuthUtil())
    );
    this.authValidator = new AuthValidator();
    this.authMiddleware = new AuthMiddleware();
    this.setupRoutes();
  }
  setupRoutes() {
    // [POST] /register
    this.router.post(
      "/register",
      Validate(this.authValidator.registerValidate),
      asyncHandler(this.authController.register)
    );
    // [POST] /login
    this.router.post(
      "/login",
      Validate(this.authValidator.loginValidate),
      asyncHandler(this.authController.login)
    );
    // [GET] /google
    this.router.get(
      "/google",
      passport.authenticate("google", {
        scope: ["email", "profile"],
        session: false,
      })
    );
    // [GET] /google/callback
    this.router.get(
      "/google/callback",
      passport.authenticate("google", { failureRedirect: "/login" }),
      asyncHandler(this.authController.googleLogin)
    );
    // [GET] /facebook
    this.router.get(
      "/facebook",
      passport.authenticate("facebook", {
        scope: ["email", "public_profile"],
        session: false,
      })
    );
    // [GET] /facebook/callback
    this.router.get(
      "/facebook/callback",
      passport.authenticate("facebook", { failureRedirect: "/login" }),
      asyncHandler(this.authController.facebookLogin)
    );
    // [POST] /processNewToken
    this.router.post(
      "/processNewToken",
      asyncHandler(this.authController.refreshToken)
    );
    // [POST] /logout
    this.router.post(
      "/logout",
      asyncHandler(this.authMiddleware.checkAuth),
      asyncHandler(this.authController.logout)
    );
    // [POST] /forgot-password
    this.router.post(
      "/forgot-password",
      asyncHandler(this.authController.forgotPasswordController)
    );
    // [POST] /reset-password
    this.router.post(
      "/reset-password",
      asyncHandler(this.authController.resetPasswordController)
    );
  }
  getRoute() {
    return this.router;
  }
}
