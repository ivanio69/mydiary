//uuid
const { v4: uuidv4 } = require("uuid");
// Express
const path = require("path");
const morgan = require("morgan");
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
  console.log("Connected to DB...");
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

  app.use(morgan("combined"));

  app.use(express.static(path.join(__dirname, "/../web/build")));

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
    try {
      User.findOne({ email: req.body.email }, function (err, resp) {
        if (err) {
          res.json({ message: err.message, err });
        } else {
          if (resp === null) {
            user.save(function (err, data) {
              if (err) return console.error(err);
              res.send({ data, status: 1, message: "Registered sucsessfully" });
            });
          } else res.json({ message: "Email is alredy in use!" });
        }
      });
    } catch (err) {
      console.error("POST/register error: ", err);
      res.json({
        message: err.message,
        err,
      });
    }
  });

  //login
  app.post("/api/v1/login", (req, res) => {
    try {
      User.findOne(
        { email: req.body.email, pass: md5(req.body.pass) },
        function (err, data) {
          if (err) {
            res.json({ message: err.message, err });
          } else {
            if (data === null)
              res.json({
                status: 0,
                message: "Password or email is incorrect!",
              });
            else res.send({ data, message: "Logged in!", status: 1 });
          }
        }
      );
    } catch (err) {
      console.error("POST/login error: ", err);
      res.json({
        message: err.message,
        err,
      });
    }
  });

  app.get("/api/v1/rmaccount", (req, res) => {
    try {
      User.deleteOne({ email: req.body.email }, (err, resp) => {
        if (err) {
          res.json({ message: err.message, err });
        } else {
          res.send(resp);
        }
      });
    } catch (err) {
      console.error("GET/rmaccount error: ", err);
      res.json({
        message: err.message,
        err,
      });
    }
  });

  app.post("/api/v1/addpost", (req, res) => {
    const id = uuidv4();
    let a = {};
    a.snippet = "";

    // the for loop was repeating forever since s kept getting reassigned.  String.replace() with the RegEx seems to work
    const s = req.body.text.replace(/[#`*\[\]\{\}_\\\(\)+-.!]/g, "");

    if (s.length < 50) {
      a.snippet = s;
    } else {
      for (let i = 0; i < 50; i++) {
        a.snippet += s.charAt(i);
      }
      a.snippet += "...";
    }
    try {
      User.updateOne(
        { email: req.body.email },
        {
          $push: {
            notes: {
              email: req.body.email,
              uname: req.body.uname,
              name: req.body.name,
              snippet: a.snippet,
              text: req.body.text,
              id,
            },
          },
        },
        (err, resp) => {
          if (err) {
            res.json({ message: err.message, err });
          } else {
            res.send({
              email: req.body.email,
              uname: req.body.uname,
              name: req.body.name,
              snippet: a.snippet,
              text: req.body.text,
              id,
              status: 1,
              message: "Saved!",
            });
          }
        }
      );
    } catch (err) {
      console.error("POST/addpost error: ", err);
      res.json({
        message: err.message,
        err,
      });
    }
  });

  app.post("/api/v1/editpost", (req, res) => {
    try {
      User.update(
        { "notes.id": req.body.id },
        {
          $set: {
            "notes.$.name": req.body.name,
            "notes.$.text": req.body.text,
          },
        },
        (err, resp) => {
          if (err) {
            res.json({ message: err.message, err });
          } else {
            res.send(resp);
          }
        }
      );
    } catch (err) {
      console.error("POST/editpost error: ", err);
      res.json({
        message: err.message,
        err,
      });
    }
  });

  app.post("/api/v1/rmpost", (req, res) => {
    try {
      User.updateOne(
        { email: req.body.email },
        { $pull: { notes: { id: req.body.id } } },
        (err, resp) => {
          if (err) {
            res.json({ message: err.message, err });
          } else {
            res.send(resp);
          }
        }
      );
    } catch (err) {
      console.error("POST/rmpost error: ", err);
      res.json({
        message: err.message,
        err,
      });
    }
  });

  app.post("/api/v1/notes", (req, res) => {
    try {
      User.findOne({ email: req.body.email }, (err, u) => {
        if (err) {
          res.json({ message: err.message, err });
        } else {
          res.send(u.notes);
        }
      });
    } catch (err) {
      console.error("POST/notes error: ", err);
      res.json({
        message: err.message,
        err,
      });
    }
  });

  app.post("/api/v1/getnote", (req, res) => {
    try {
      User.findOne({ "notes.id": req.body.id }, (err, u) => {
        if (err) {
          res.json({ message: err.message, err });
        } else {
          if (u == null) {
            res.sendStatus(404);
          } else res.send(u.notes.find((x) => x.id === req.body.id));
        }
      });
    } catch (err) {
      console.error("POST /getnote error: ", err);
      res.json({
        message: err.message,
        err,
      });
    }
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../web/build/index.html"));
  });

  app.listen(8081, () => {
    console.log("Sevrer started!");
  });
});
