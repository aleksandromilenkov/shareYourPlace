const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./routes/places-routes");

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/places", placesRoutes);

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
