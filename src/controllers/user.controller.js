import { OK } from "../handlers/success.response.js";
export default class UserController {
  constructor(UserService) {
    this.userService = UserService;
  }
  getAllUsers = async (req, res, next) => {
    const users = await this.userService.getAllUsers();
    new OK({
      message: "Get all users successfully!",
      metadata: users,
    }).send(res);
  };
  getUserById = async (req, res, next) => {
    const id = req.params.id;
    const user = await this.userService.getUserById(id);
    new OK({
      message: "Get user by id successfully!",
      metadata: user,
    }).send(res);
  };
  addUser = async (req, res, next) => {
    const user = req.body;
    const newUser = await this.userService.addUser(user);
    new OK({
      message: "Add user successfully!",
      metadata: newUser,
    }).send(res);
  };
  putUser = async (req, res, next) => {
    const id = req.params.id;
    const user = req.body;
    const updatedUser = await this.userService.putUser(id, user);
    new OK({
      message: "Updated user successfully!",
      metadata: updatedUser,
    }).send(res);
  };
  deleteUser = async (req, res, next) => {
    const id = req.params.id;
    const currentId = req.user.id;
    const deletedUser = await this.userService.deleteUser(id, currentId);
    new OK({
      message: "Deleted user successfully!",
      metadata: deletedUser,
    }).send(res);
  };
  getMe = async (req, res, next) => {
    const id = req.user.id;
    const user = await this.userService.getMe(id);
    new OK({
      message: "Get your account in4 successfully!",
      metadata: user,
    }).send(res);
  };
}
