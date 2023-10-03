const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

// parse the json body
app.use(express.json({ limit: "10kb" }));

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
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500).json({
    message: error.message || "Something went wrong",
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
