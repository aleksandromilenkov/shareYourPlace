const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsFromAddress = require("../util/getLocation");
const Place = require("../models/PlaceModel");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empile State",
    description: "scy scraper big",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIP0NXvv5YbGKbuGsC425k3eh5ZX7y8dH5og&usqp=CAU",
    address: "New York, New York, USA",
    location: {
      lat: 40.74854,
      lng: -73.98732,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Emp. State",
    description: "scy scraper big",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIP0NXvv5YbGKbuGsC425k3eh5ZX7y8dH5og&usqp=CAU",
    address: "New York, New York, USA",
    location: {
      lat: 40.74854,
      lng: -73.98732,
    },
    creator: "u2",
  },
  {
    id: "p2",
    title: "Rockfeler Center",
    description: "scy scraper big",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIP0NXvv5YbGKbuGsC425k3eh5ZX7y8dH5og&usqp=CAU",
    address: "New York, New York, USA",
    location: {
      lat: 40.93233,
      lng: -73.98732,
    },
    creator: "u2",
  },
];

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors, "ERROR IN CREATE PLACE METHOD IN PLACES CONTROLLER");
      return next(
        new HttpError("Invalid input, please check your input data", 422)
      );
    }
    const { title, description, image, address, creator } = req.body;
    const coords = getCoordsFromAddress(address);
    const newPlace = {
      title,
      description,
      image,
      location: coords,
      address,
      creator,
    };
    await Place.create(newPlace);
    res.status(201).json({
      status: "success",
      data: newPlace.toObject({ getters: true }),
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
    await Place.findOneAndDelete(pid);
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
