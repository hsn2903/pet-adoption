const express = require("express");
const debug = require("debug")("app:server");
const debugError = require("debug")("app:error");

// construct express app
const app = express();
// body parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// define routes
app.use("/api/pet", require("./routes/api/pet"));

// handle errors
app.use((req, res, next) => {
  debugError("Page not found!");
  res.status(404).json({ error: "Page not found!" });
});
//
app.use((err, req, res, next) => {
  debugError(err);
  res.status(500).json({ message: err.message });
});

// start listenning for requests
const port = process.env.PORT || 5001;
app.listen(port, () => {
  debug(`App running on port ${port}`);
});
