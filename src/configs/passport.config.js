import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import AuthService from "../services/auth.service.js";
import dotenv from 'dotenv'
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as FacebookStrategy } from 'passport-facebook';
import AuthService from "../services/auth.service.js"
const authService = new AuthService();
import User from "../models/user.model.js";
dotenv.config()
// passport use strategy here
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, cb) {
    try{
      const user = await User.findOne({'providers.google.id' : profile.id})
      if (!user)
      {
        const newUser = new User ({
          fullname: profile._json.name,
          username: profile._json.email,
          email: profile._json.email,
          password: '',
          loginMethod: 'google'
        })
        await newUser.save()
        return cb(null, newUser)
      }
      return cb(null, user)
    }
    catch (err)
    {
        return cb(err)
    }
  }
));
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  },
  async function(accessToken, refreshToken, profile, cb) {
    try{
      const user = await User.findOne({'providers.facebook.id' : profile.id})
      if (!user)
      {
        const newUser = new User ({
          fullname: profile._json.name,
          username: profile._json.email,
          email: profile._json.email,
          password: '',
          loginMethod: 'facebook',
        })
        await newUser.save()
        return cb(null, newUser)
      }
      return cb(null, user)
    }
    catch (err)
    {
        return cb(err)
    }
  }
));
passport.serializeUser(function(user, cb) {
  cb(null, user)
})

passport.deserializeUser(function(user, cb){
  cb(null, user)
})
export default passport;