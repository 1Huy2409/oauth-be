import { BadRequestError } from '../handlers/error.response.js';
export default class UserValidator {
    constructor() { };

    // validate user 
    checkUser = async (req, res, next) => {
        try {
            const user = req.body;
            if (!user.fullname || !user.email || !user.username || !user.password) {
                throw new BadRequestError("Please fill in all fields!");
            }
            // validate fullname
            if (user.fullname.trim().length < 10) {
                throw new BadRequestError("Full name must be at least 10 characters");
            }
            // validate email (regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const checkEmail = emailRegex.test(user.email);
            if (!checkEmail) {
                throw new BadRequestError("Invalid email format");
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
    }
}