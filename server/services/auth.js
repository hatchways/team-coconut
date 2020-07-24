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
    const { token, cookieConfig } = this._createTokenAndCookieConfig(
      newUser._id
    );

    return { newUser: { name, email }, token, cookieConfig };
  }

  async signInUser({ email }) {
    const user = await User.findOne({ email }, "email name");
    const { token, cookieConfig } = this._createTokenAndCookieConfig(user._id);
    return { user, token, cookieConfig };
  }

  _createTokenAndCookieConfig(userId) {
    //creating token for user
    const tokenPayload = {
      user: {
        id: userId,
      },
    };
    const token = createToken(tokenPayload);
    //creating cookie config
    const cookieConfig = getCookieConfig();
    return { token, cookieConfig };
  }
};
