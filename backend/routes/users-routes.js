const express = require("express");
const { check } = require("express-validator");
const {
  getAllUsers,
  login,
  signup,
} = require("../controllers/user-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", getAllUsers);
router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);
router.post("/login", login);

module.exports = router;
