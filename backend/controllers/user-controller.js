const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({}, "-password").populate("places");
    res.status(200).json({
      status: "success",
      data: allUsers.map((u) => u.toObject({ getters: true })),
    });
  } catch (err) {
    return next(new HttpError("Can not get the users", 500));
  }
};

const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return next(
        new HttpError("Invalid input, please check your input data", 422)
      );
    }
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const error = new HttpError("User with that e-mail already exists", 401);
      return next(error);
    }
    const newUser = await User.create({
      name,
      email,
      image: req.file.path,
      password: await bcrypt.hash(password, 12),
      places: [],
    });

    let token;
    // here you can sign something (usualy id and email)
    token = jwt.sign(
      { userId: newUser._id.toString(), email: newUser.email },
      "secretjs",
      { expiresIn: "1h" }
    );
    res.status(201).json({
      status: "success",
      token: token,
      userId: newUser._id,
      email: newUser.email,
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Can not sign up right now", 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new HttpError("Wrong email or password", 401);
      return next(error);
    }
    if (await bcrypt.compare(user.password, password)) {
      const error = new HttpError("Wrong email or password", 401);
      return next(error);
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      "secretjs",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      status: "success",
      message: "logged in",
      token: token,
      email: user.email,
      userId: user._id,
    });
  } catch (err) {
    return next(new HttpError("Can not login right now", 500));
  }
};

module.exports = {
  getAllUsers,
  signup,
  login,
};
