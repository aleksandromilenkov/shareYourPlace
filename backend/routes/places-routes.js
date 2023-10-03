const express = require("express");
const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
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
];

const router = express.Router();

router.get("/:pid", (req, res, next) => {
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
});

router.get("/user/:uid", (req, res, next) => {
  const { uid } = req.params;
  const userPlaces = DUMMY_PLACES.filter((p) => p.creator == uid);
  if (!userPlaces.length) {
    const error = new HttpError("Can't find place created by that user.", 404);
    return next(error);
  }
  res.status(200).json({
    status: "success",
    data: userPlaces,
  });
});

module.exports = router;
