const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsFromAddress = require("../util/getLocation");
const Place = require("../models/PlaceModel");
const User = require("../models/UserModel");
const fs = require("fs");

const getPlaceById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const place = await Place.findById(pid);
    if (!place) {
      const error = new HttpError("Can't find place with that id.", 404);
      error.code = 404;
      return next(error);
    }
    res.json({
      status: "success",
      data: place.toObject({ getters: true }), // convert to js object and _id to id
    });
  } catch (err) {
    return next(new HttpError("Could not find the place"), 500);
  }
};

const getPlacesByUserId = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const userPlaces = await Place.find({ creator: uid });
    if (!userPlaces.length) {
      const error = new HttpError(
        "Can't find place created by that user.",
        404
      );
      return next(error);
    }
    res.status(200).json({
      status: "success",
      data: userPlaces.map((place) => place.toObject({ getters: true })),
    });
  } catch (err) {
    return next(new HttpError("Could not find the place for this user"), 500);
  }
};

const createPlace = async (req, res, next) => {
  try {
    console.log(
      req.body.title,
      req.body.address,
      req.body.description,
      req.body.creator,
      req.body.lat,
      req.body.lng
    );
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors, "ERROR IN CREATE PLACE METHOD IN PLACES CONTROLLER");
      return next(
        new HttpError("Invalid input, please check your input data", 422)
      );
    }
    const { title, description, address, lat, lng } = req.body;
    const newPlace = {
      title,
      description,
      image: req?.file?.path || "123",
      location: {
        lat,
        lng,
      },
      address,
      creator: {
        _id: req.userId,
      },
    };
    const user = await User.findById(req.userId);
    console.log(user);
    if (!user) {
      return next(
        new HttpError("We couldnt find user for the provided ID"),
        404
      );
    }
    const place = await Place.create(newPlace);
    user.places.push(place); // establishing connection with the PlaceModel
    await user.save();
    res.status(201).json({
      status: "success",
      data: place,
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Can't create place", 500));
  }
};

const updatePlace = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return next(
        new HttpError("Invalid input, please check your input data", 422)
      );
    }
    const { title, description } = req.body;
    const { pid } = req.params;
    const place = await Place.findById(pid);
    if (place.creator.toString() !== req.userId) {
      return next(new HttpError("You are not allowed to edit this place", 401));
    }
    const thePlace = await Place.findByIdAndUpdate(
      pid,
      { title, description },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      data: thePlace.toObject({ getters: true }),
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Can't update the place", 500));
  }
};

const deletePlace = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const place = await Place.findById(pid).populate("creator");
    if (!place) {
      return next(new HttpError("Couldnt find place for this ID", 404));
    }
    if (place.creator.id !== req.userId) {
      return next(
        new HttpError("You are not allowed to delete this place", 401)
      );
    }
    const imagePath = place.image;
    await Place.deleteOne(place);
    place.creator.places.pull(place); // remove the place from the User's array of places
    await place.creator.save();
    fs.unlink(imagePath, (err) => console.log(err));
    res.status(200).json({
      status: "success",
      message: "Place deleted.",
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Can't delete the place", 500));
  }
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
