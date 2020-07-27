// Schema

// Express
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
const app = express();
app.use(bodyParser.json());
mongoose.connect("mongodb://localhost:27017/mydiary", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  const schema = new mongoose.Schema({
    name: String,
    pass: String,
    email: String,
    notes: Array,
  });
  const User = mongoose.model("User", schema);
  //Home route
  app.get("/", (req, res) => {
    res.send("Welcome to Mydiary api!");
  });

  // V1
  //new account
  app.post("/api/v1/register", (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      pass: md5(req.body.pass),
      notes: [],
    });
    user.save(function (err, callback) {
      if (err) return console.error(err);
      res.send(callback);
    });
  });

  //login
  app.get("/api/v1/login", (req, res) => {
    User.findOne({ email: req.body.email, pass: md5(req.body.pass) }, function (
      err,
      resp
    ) {
      res.send(resp);
    });
  });

  app.listen(3452, () => {
    console.log("Sevrer started!");
  });
});