import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export default class AuthUtil {
  constructor() {}
  // hash password by bcrypt
  hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };
  // compare hashPassword
  comparePassword = async (inputPassword, hashedPassword) => {
    const check = await bcrypt.compare(inputPassword, hashedPassword);
    return check;
  };
  // gen accesstoken
  signAccessToken = (data) => {
    const token = jwt.sign(data, process.env.JWT_KEY, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRE,
    });
    return token;
  };
  // gen refreshtoken
  signRefreshToken = (data) => {
    const token = jwt.sign(data, process.env.JWT_KEY, {
      algorithm: "HS256",
    });
    return token;
  };
  // verify refreshToken
  verifyRefreshToken = (token) => {
    try {
      const payload = jwt.verify(token, process.env.JWT_KEY);
      return payload;
    } catch (err) {
      throw err;
    }
  };
  verifyAccessToken = (token) => {
    try {
      const payload = jwt.verify(token, process.env.JWT_KEY);
      return payload;
    } catch (err) {
      throw err;
    }
  }
}