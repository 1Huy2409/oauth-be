import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import AuthService from "../services/auth.service.js";
const authService = new AuthService();

// passport use strategy here
export default passport;