import { OK } from "../handlers/success.response.js";
export default class UserController {
  constructor(UserService) {
    this.userService = UserService;
  }
  getMe = async (req, res, next) => {
    const id = req.user.id;
    try {
      const user = await this.userService.getMe(id);
      new OK({
        message: "Get your account in4 successfully!",
        metadata: user,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
