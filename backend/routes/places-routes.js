const express = require("express");
const HttpError = require("../models/http-error");
const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
} = require("../controllers/places-controller");

const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.post("/", createPlace);

module.exports = router;
