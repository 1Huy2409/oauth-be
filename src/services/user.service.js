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
        const user = await this.userModel.findOne({ _id: id });
        if (!user) {
            throw new NotFoundError("User not found!");
        }

        // Kiểm tra email nếu có gửi lên
        if (data.email && data.email !== user.email) {
            const emailExisting = await this.userModel.findOne({ email: data.email, _id: { $ne: id } });
            if (emailExisting) {
                throw new ConflictRequestError("This email already exists!");
            }
            user.email = data.email;
        }

        // Kiểm tra username nếu có gửi lên
        if (data.username && data.username !== user.username) {
            const usernameExisting = await this.userModel.findOne({ username: data.username, _id: { $ne: id } });
            if (usernameExisting) {
                throw new ConflictRequestError("This username already exists!");
            }
            user.username = data.username;
        }

        // Chỉ update fullname nếu có gửi lên
        if (data.fullname) {
            user.fullname = data.fullname;
        }

        // Chỉ update password nếu có gửi lên
        if (data.password) {
            user.password = await this.authUtil.hashPassword(data.password);
        }

        // Có thể bổ sung các trường khác tương tự

        await user.save();
        return user;
    }
    deleteUser = async (id, currentId) => {
        if (currentId === id)
        {
            throw new ConflictRequestError("Cannot delete yourself!")
        }
        const user = await this.userModel.findOne({_id: id});
        if (!user)
        {
            throw new NotFoundError("User not found!");
        }
        if (user.role === 'Admin') {
            throw new ConflictRequestError("Cannot delete admin user!");
        }
        await this.userModel.deleteOne({_id: id});
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
