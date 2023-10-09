const express = require("express");
const fs = require("fs");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "./config.env" });
const app = express();

// parse the json body
app.use(express.json({ limit: "10kb" }));

// serve static files: (return a file)
// express.static needs an absolute path to the folder from which you want to serve files
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);

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
  // if image uploading:
  // multer adds file object to the request when uploading images
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
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
