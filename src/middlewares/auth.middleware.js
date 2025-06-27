import jwt from "jsonwebtoken";
import { AuthFailureError } from "../handlers/error.response.js";

export default class AuthMiddleware {
    constructor() {

    }
    checkAuth = async (req, res, next) => {
        try
        {
            const bearerToken = req.headers['authorization'];
            if (!bearerToken) {
                throw new AuthFailureError("You 're not authenticated!");
            }
            const token = bearerToken.split(' ')[1];
            console.log(token)
            try
            {
                var decoded = jwt.verify(token, process.env.JWT_KEY);
                req.user = decoded;
                next();
            }
            catch(err)
            {
                console.log("Vao day")
                throw err;
            }
        }
        catch (error)
        {
            next(error);
        }
    }
}