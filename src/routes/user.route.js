import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import AuthUtil from "../utils/auth.util.js";
import UserController from "../controllers/user.controller.js";
import UserService from "../services/user.service.js"
import User from "../models/user.model.js";

export default class UserRouter {
  constructor() {
    this.router = Router();
    this.userController = new UserController(new UserService(User, new AuthUtil()));
    this.authMiddleware = new AuthMiddleware();
    this.setupRoutes();
  }
  setupRoutes() {
    // [GET] gell all users (Admin)
    // this.router.get('/', asyncHandler(this.userController.getAllUsers))
    this.router.get('/me', asyncHandler(this.authMiddleware.checkAuth), asyncHandler(this.userController.getMe));
  }
  getRoute() {
    return this.router;
  }
}
