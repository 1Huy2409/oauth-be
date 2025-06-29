import { BadRequestError } from '../handlers/error.response.js';
export default class UserValidator {
    constructor() { };

    // validate user 
    checkUser = async (req, res, next) => {
        try {
            const user = req.body;
            if (!user.fullname || !user.age || !user.email || !user.username || !user.password) {
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
            // validate age (number)
            const age = parseInt(user.age);
            if (isNaN(age) || age <= 0 || age > 100) {
                throw new BadRequestError("Age is invalid");
            }
            // validate username
            if (user.username.trim().length < 10) {
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