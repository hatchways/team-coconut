const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { createToken } = require("../utils/token");
const { getCookieConfig } = require("../utils/cookie");

module.exports = class AuthService {
  async signUpUser({ name, email, password }) {
    const user = new User({
      name,
      email,
    });
    //generating salt and hashing password
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);

    const newUser = await user.save();

    //creating token for user
    const tokenPayload = {
      user: {
        id: newUser._id,
      },
    };
    const token = createToken(tokenPayload);
    const cookieConfig = getCookieConfig();

    return { newUser: { name, email }, token, cookieConfig };
  }
};
