import { NotFoundError, ConflictRequestError } from "../handlers/error.response.js";

export default class UserService {
    constructor(User, AuthUtil) {
        this.userModel = User;
        this.authUtil = AuthUtil;
    }
    getAllUsers = async () => {
        const users = await this.userModel.find({});
        return users;
    }
    getUserById = async (id) => {
        const user = await this.userModel.findOne({_id: id});
        if (!user)
        {
            throw new NotFoundError("User not found!");
        }
        return user;
    }
    addUser = async (user) => {
        const hashedPassword = await this.authUtil.hashPassword(user.password)
        // check email exist
        const emailExisting = await this.userModel.findOne({email: user.email});
        if (emailExisting)
        {
            throw new ConflictRequestError("This email already exists!")
        }
        const usernameExisting = await this.userModel.findOne({username: user.username});
        if (usernameExisting)
        {
            throw new ConflictRequestError("This username already exists!")
        }
        const newUser = new this.userModel(
            {
                fullname: user.fullname,
                age: user.age,
                email: user.email,
                username: user.username,
                password: hashedPassword,
                role: "User"
            }
        )
        await newUser.save();
        return newUser;
    }
    putUser = async (id, data) => {
        const user = await this.userModel.findOne({_id: id});
        if (user)
        {
            const emailExisting = await this.userModel.findOne({email: data.email, _id: {$ne: id}});
            if (emailExisting)
            {
                throw new ConflictRequestError("This email already exists!");
            }
            const usernameExisting = await this.userModel.findOne({username: data.username, _id: {$ne: id}});
            if (usernameExisting)
            {
                throw new ConflictRequestError("This username already exists!");
            }
            const hashedPassword = await this.authUtil.hashPassword(data.password);
            // update user information
            user.fullname = data.fullname;
            user.age = data.age;
            user.email = data.email;
            user.username = data.username;
            user.password = hashedPassword;
            await user.save();
            return user;
        }
        else {
            throw new NotFoundError("User not found!");
        }
    }
    deleteUser = async (id) => {
        const user = await this.userModel.findOne({_id: id});
        if (!user)
        {
            throw new NotFoundError("User not found!");
        }
        await this.userModel.deleteOne({_id: id});
        await this.voteModel.deleteOne({userId: id});
        return user;
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
