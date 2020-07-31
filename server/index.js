//uuid
const { v4: uuidv4 } = require("uuid");
// Express
const path = require("path");
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
    emailUpdates: Boolean,
  });
  const User = mongoose.model("User", schema);

  //actual version
  app.get("/api/ver", (req, res) => {
    res.json({ version: "0.1.0" });
  });

  // V1
  //new account
  app.post("/api/v1/register", (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      pass: md5(req.body.pass),
      notes: [],
      emailUpdates: req.body.emailUpdates,
    });
    User.findOne({ email: req.body.email }, function (err, resp) {
      if (resp === null) {
        user.save(function (err, data) {
          if (err) return console.error(err);
          res.send({ data, status: 1, message: "Registered sucsessfully" });
        });
      } else res.json({ message: "Email is alredy in use!" });
    });
  });

  //login
  app.post("/api/v1/login", (req, res) => {
    User.findOne({ email: req.body.email, pass: md5(req.body.pass) }, function (
      err,
      data
    ) {
      if (data === null)
        res.json({ status: 0, message: "Password or email is incorrect!" });
      else res.send({ data, message: "Logged in!", status: 1 });
    });
  });

  app.get("/api/v1/rmaccount", (req, res) => {
    User.deleteOne({ email: req.body.email }, (err, resp) => {
      res.send(resp);
    });
  });

  app.post("/api/v1/addpost", (req, res) => {
    const id = uuidv4();
    let a = {};
    a.snippet = "";
    if (req.body.text.length < 50) {
      a.snippet = req.body.text;
    } else {
      for (let i = 0; i < 50; i++) {
        a.snippet += req.body.text.charAt(i);
      }
      a.snippet += "...";
    }
    User.updateOne(
      { email: req.body.email },
      {
        $push: {
          notes: {
            name: req.body.name,
            snippet: a.snippet,
            text: req.body.text,
            id,
          },
        },
      },
      (err, resp) => {
        res.send({
          name: req.body.name,
          snippet: a.snippet,
          text: req.body.text,
          id,
          status: 1,
          message:"Saved!"
        });
      }
    );
  });
  app.post("/api/v1/rmpost", (req, res) => {
    User.updateOne(
      { email: req.body.email },
      { $pull: { notes: { id: req.body.id } } },
      (err, resp) => {
        res.send(resp);
      }
    );
  });

  app.post("/api/v1/notes", (req, res) => {
    User.findOne({ email: req.body.email }, (err, u) => {
      res.send(u.notes);
    });
  });

  
  app.post("/api/v1/getnote", (req, res) => {
    User.findOne({ "notes.id": req.body.id }, (err, u) => {
      res.send(u.notes[0]);
    });
  });

  app.use(express.static(path.join(__dirname, "/../web/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../web/build/index.html"));
  });

  app.listen(80, () => {
    console.log("Sevrer started!");
  });
});
