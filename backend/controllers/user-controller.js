const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
let DUMMY_USERS = [
  {
    id: "u1",
    name: "Max",
    password: "testest",
    email: "maxasd@hee.com",
  },
  {
    id: "u2",
    name: "Manuel",
    password: "testest2",
    email: "manuelzxc@hee.com",
  },
];

const getAllUsers = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: DUMMY_USERS,
  });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid input, please check your input data", 422)
    );
  }
  const { name, email, password } = req.body;
  const user = DUMMY_USERS.find((u) => u.email === email);
  if (user) {
    const error = new HttpError("User with that e-mail already exists", 401);
    return next(error);
  }
  const newUser = { id: uuidv4(), name, email, password };
  DUMMY_USERS.push(newUser);
  res.status(201).json({
    status: "success",
    data: newUser,
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find((u) => u.email === email);
  if (!user || user.password !== password) {
    const error = new HttpError("Wrong email or password", 401);
    return next(error);
  }
  res.status(200).json({
    status: "success",
    message: "logged in",
  });
};

module.exports = {
  getAllUsers,
  signup,
  login,
};
