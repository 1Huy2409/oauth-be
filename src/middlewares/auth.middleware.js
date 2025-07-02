import jwt from "jsonwebtoken";
import { AuthFailureError } from "../handlers/error.response.js";

export default class AuthMiddleware {
    constructor() {

    }
    checkAuth = async (req, res, next) => {
        try {
            const bearerToken = req.headers['authorization'];
            if (!bearerToken) {
                throw new AuthFailureError("You 're not authenticated!");
            }
            const token = bearerToken.split(' ')[1];
            console.log(token)
            try {
                var decoded = jwt.verify(token, process.env.JWT_KEY);
                req.user = decoded;
                next();
            }
            catch (err) {
                throw new AuthFailureError("Token is expired")
            }
        }
        catch (error) {
            next(error);
        }
    }

    checkAdmin = async (req, res, next) => {
        this.checkAuth(req, res, async (err) => {
            if (err) return next(err);
            try {
                if (req.user.role == "admin") {
                    next();
                }
                else {
                    throw new AuthFailureError("You 're not allowed to do that!");
                }
            }
            catch (error) {
                next(error);
            }
        })
    }

    checkUpdateProfile = async (req, res, next) => {
        this.checkAuth(req, res, async (err) => {
            if (err) return next(err);
            // check role == "Admin" || id = req.params.id
            try
            {
                const id = req.params.id;
                if (req.user.role == "admin")
                {
                    next();
                }                
                else
                {
                    if (id == req.user.id)
                    {
                        next();
                    }
                    else
                    {
                        throw new AuthFailureError("You're not allowed to do that!");
                    }
                }
            }
            catch (error)
            {
                next(error);
            }
        })
    }
}
