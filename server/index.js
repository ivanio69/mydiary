const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const uuid = require("uuid").v4;
dotenv.config();
const secret = "appSecretKey";
const rounds = 9921;
const keySize = 32;
const algorithm = "aes-256-cbc";
const salt = crypto.createHash("sha1").update(secret).digest("hex");
const jwtSecret = process.env.JWTSECRET;
mongoose.connect("mongodb://localhost:27017/mydiary", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  posts: Array,
  followers: Array,
});

function encrypt(data) {
  let iv = crypto.randomBytes(16);
  let key = crypto.pbkdf2Sync(secret, salt, rounds, keySize, "sha512");
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encryptedData = Buffer.concat([
    cipher.update(JSON.stringify(data)),
    cipher.final(),
  ]);
  return { iv: iv.toString("base64"), data: encryptedData.toString("base64") };
}

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("well, hi :)");
});

app.post("/api/v1/login", (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, same) => {
          delete user.password;
          if (same)
            jwt.sign({ user }, jwtSecret, (err, token) => {
              res.json({ status: 1, user, token });
            });
          else res.json({ status: 0, message: "Email or password is wrong!" });
        });
      } else res.json({ status: 0, message: "Email or password is wrong!" });
    });
  }
});

app.post("/api/v1/register", (req, res) => {
  if (req.body.password && req.body.email && req.body.name) {
    User.findOne({ email: req.body.email }, (err, exists) => {
      if (exists)
        res.json({ status: 0, message: "This email is already registered!" });
      else
        bcrypt.hash(req.body.password, 15, function (err, hashedPass) {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass,
            posts: [],
            followers: [],
          });

          newUser.save((err, user) => {
            delete user.password;
            jwt.sign({ user }, jwtSecret, (err, token) => {
              res.json({ status: 1, user, token });
            });
          });
        });
    });
  } else res.json({ status: 0, message: "There is not enough data!" });
});

app.post("/api/v1/getNote", (req, res) => {
  User.findOne({ "posts.uuid": req.body.id }, (err, user) => {
    if (user) {
      res.json({
        status: 1,
        note: user.posts.filter((e) => e.uuid === req.body.id)[0],
        user,
      });
    } else res.json({ status: 0, message: "This note not found!" });
  });
});

app.use((req, res, next) => {
  if (req.headers.token) {
    jwt.verify(req.headers.token, jwtSecret, (err, userData) => {
      if (err)
        res.json({
          status: 3,
          message:
            "There was an error decrypting token! Please clear your cache.",
          err,
        });
      else
        User.findOne({ email: userData.user.email }, (err, exists) => {
          if (exists) {
            req.user = exists;
            req.user.password = undefined;

            next();
          } else {
            res.json({ status: 3, message: "This account does not exist!" });
          }
        });
    });
  } else {
    res.json({ status: 3, message: "No token header presented" });
  }
});

app.get("/api/v1/user", (req, res) => {
  res.json(req.user);
});

app.post("/api/v1/createNote", (req, res) => {
  const id = uuid();
  User.updateOne(
    req.user,
    {
      $push: {
        posts: {
          name: req.body.noteName,
          body: req.body.noteBody,
          uuid: id,
        },
      },
    },
    (err, updated) => {
      res.json({
        status: 1,
        note: {
          name: req.body.noteName,
          body: req.body.noteBody,
          uuid: id,
        },
      });
    }
  );
});

app.post("/api/v1/removeNote", (req, res) => {
  User.updateOne(
    { "posts.uuid": req.body.uuid, email: req.user.email },
    {
      $pull: {
        posts: {
          uuid: req.body.uuid,
        },
      },
    },
    (err, updated) => {
      res.json({
        status: 1,
        updated,
      });
    }
  );
});

app.post("/api/v1/updateNote", (req, res) => {
  User.updateOne(
    { "posts.uuid": req.body.uuid, email: req.user.email },
    {
      $set: {
        "posts.$.name": req.body.noteName,
        "posts.$.body": req.body.noteBody,
      },
    },
    (err, updated) => {
      res.json({ status: 1, updated });
    }
  );
});

app.listen(3584, () => {
  console.info("Running on port 3584");
});
