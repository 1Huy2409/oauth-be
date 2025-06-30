import UserRouter from "./user.route.js";
import AuthRouter from "./auth.route.js";
export default (app) => {
  const userRoute = new UserRouter();
  const authRoute = new AuthRouter();
  app.use("/api/v1/users", userRoute.getRoute());
  app.use("/api/v1/auth", authRoute.getRoute());
};
