import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import UserController from "../controllers/user.controller.js";
import UserValidator from "../validators/user.validator.js";
import AuthUtil from "../utils/auth.util.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import UserService from "../services/user.service.js";
import User from "../models/user.model.js";
export default class UserRouter {
    constructor() {
        this.router = Router()
        this.userController = new UserController(new UserService(User, new AuthUtil()));
        this.userValidator = new UserValidator();
        this.AuthMiddleware = new AuthMiddleware();
        this.setupRoutes()
    }
    setupRoutes() {
        // [GET] gell all users (Admin)
        this.router.get('/', asyncHandler(this.AuthMiddleware.checkAuth), asyncHandler(this.userController.getAllUsers))
        // [GET] get profile (Admin and User)
        this.router.get('/me', asyncHandler(this.AuthMiddleware.checkAuth), asyncHandler(this.userController.getMe));
        // [POST] create new user (Admin)
        this.router.post('/', asyncHandler(this.AuthMiddleware.checkAdmin), asyncHandler(this.userValidator.checkUser), asyncHandler(this.userController.addUser));
        // [DELETE] delete user by id (Admin)
        this.router.delete('/:id', asyncHandler(this.AuthMiddleware.checkAdmin), asyncHandler(this.userController.deleteUser));
        // [GET] get user by id
        this.router.get('/:id', asyncHandler(this.AuthMiddleware.checkAdmin), asyncHandler(this.userController.getUserById));
        // [PUT] update user by id (Admin || User with same id)
        this.router.put('/:id', asyncHandler(this.AuthMiddleware.checkUpdateProfile), asyncHandler(this.userValidator.checkUser), asyncHandler(this.userController.putUser));
    }
    getRoute() {
        return this.router
    }
}
