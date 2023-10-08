const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
dotenv.config({ path: "./config.env" });
const app = express();

// UPLOADING IMAGES:
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
app.use(upload.single("image"));

// parse the json body
app.use(express.json({ limit: "10kb" }));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, PATCH, POST, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// Only run if no response was sent to the client
app.use((req, res, next) => {
  const error = new HttpError("404 Page not found", 404);
  return next(error);
});

// special error handling middleware function by epxress (4 parameters)
// this function will execute if any middleware before this function yielded an error
app.use((error, req, res, next) => {
  // if response is already thrown:
  console.log(error);
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500).json({
    message: error.message || "Something went wrong",
  });
});

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("db connected");
    app.listen(5000, () => {
      console.log("Server started on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
