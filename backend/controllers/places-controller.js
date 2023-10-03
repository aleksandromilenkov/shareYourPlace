const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

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

const getPlaceById = (req, res, next) => {
  console.log("GET Request in Places");
  const { pid } = req.params;
  const place = DUMMY_PLACES.find((p) => p.id === pid);
  if (!place) {
    const error = new HttpError("Can't find place with that id.", 404);
    error.code = 404;
    return next(error);
  }
  res.json({
    status: "success",
    data: place,
  });
};

const getPlacesByUserId = (req, res, next) => {
  const { uid } = req.params;
  const userPlaces = DUMMY_PLACES.filter((p) => p.creator === uid);
  if (!userPlaces.length) {
    const error = new HttpError("Can't find place created by that user.", 404);
    return next(error);
  }
  res.status(200).json({
    status: "success",
    data: userPlaces,
  });
};

const createPlace = (req, res, next) => {
  const { title, description, imageUrl, address, location, creator } = req.body;
  if (
    !title ||
    !description ||
    !imageUrl ||
    !address ||
    !Object.keys(location).length ||
    !creator
  ) {
    return next(new HttpError("Please provide all info", 401));
  }
  const newPlace = {
    title,
    description,
    imageUrl,
    address,
    location,
    creator,
    id: uuidv4(),
  };
  DUMMY_PLACES.push(newPlace);
  res.status(201).json({
    status: "success",
    data: newPlace,
  });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const { pid } = req.params;
  const placeToUpdate = { ...DUMMY_PLACES.find((p) => p.id === pid) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === pid);
  placeToUpdate.title = title;
  placeToUpdate.description = description;
  DUMMY_PLACES[placeIndex] = placeToUpdate;
  res.status(200).json({
    status: "success",
    data: DUMMY_PLACES,
  });
};

const deletePlace = (req, res, next) => {
  const { pid } = req.params;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== pid);
  res.status(200).json({
    status: "success",
    message: "Place deleted.",
  });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
