const express = require("express");
const HttpError = require("../models/http-error");
const { check } = require("express-validator");
const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");
const protect = require("../middleware/check-auth");

const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.post(
  "/",
  protect,
  fileUpload.single("image"),
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").notEmpty(),
  ],
  createPlace
);

router.patch(
  "/:pid",
  protect,
  [check("title").notEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);
router.delete("/:pid", protect, deletePlace);

module.exports = router;
