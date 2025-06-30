import { NotFoundError, ConflictRequestError } from "../handlers/error.response.js";
export default class UserService {
    constructor(User, AuthUil) {
        this.userModel = User;
        this.authUtil = AuthUil;
    }
    getMe = async (id) => {
        const user = this.userModel.findOne({_id: id})
        if (!user)
        {
            throw new NotFoundError("User not found!");
        }
        return user;
    }
}