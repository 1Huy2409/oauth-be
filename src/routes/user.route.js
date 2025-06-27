import { Router } from "express"
import asyncHandler from "../middlewares/asyncHandler.js";
export default class UserRouter {
    constructor() {
        this.router = Router()
        this.setupRoutes()
    }
    setupRoutes()
    {
        // [GET] gell all users (Admin)
        // this.router.get('/', asyncHandler(this.userController.getAllUsers))
    }
    getRoute()
    {
        return this.router
    }
}