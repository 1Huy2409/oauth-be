import UserRouter from "./user.route.js";
export default (app) => {
    // route for user
    const userRoute = new UserRouter();
    app.use('/api/v1/users', userRoute.getRoute());
}