const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/UserModel");

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({}, "-password");
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
      image:
        "https://play-lh.googleusercontent.com/aAZvy2vK1GUeB0JR3pjEvhCYZ-nci12JciXr7Xy2oj5EvweA_ZMvWCmQyQsY-1NQXUoF",
      password,
      places: [],
    });

    res.status(201).json({
      status: "success",
      data: newUser.toObject({ getters: true }),
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
    if (!user || user.password !== password) {
      const error = new HttpError("Wrong email or password", 401);
      return next(error);
    }
    res.status(200).json({
      status: "success",
      message: "logged in",
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
