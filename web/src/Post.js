import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Fab from "@material-ui/core/Fab";
import { message, Result } from "antd";
import React from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useParams } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import './post.css'
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default function Post() {
  let { id } = useParams();

  fetch("/api/v1/getnote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: id,
    }),
  }).then((response) => {
    if (response.status === 404) {
      document.getElementById(
        "error"
      ).innerHTML = ReactDOMServer.renderToString(
        <Result
          status="404"
          title="Whoops!"
          subTitle="Looks like this note is not created yet. Or removed. only owner knows..."
        />
      );
    } else {
      response.json().then((data) => {
        if (getCookie("email") === data.email) {
          let r = {}
            r.rempost = (id) => {
              fetch("/api/v1/rmpost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: getCookie("email"),
                  id: id,
                }),
              }).then((response) =>
                response.json().then((data) => {
                  if (data.length > 0) {
                    message.success("Removed post!");
                    window.location.href = "/account";
                  }
                })
              );
            };
          
          document.getElementById(
            "fab"
          ).innerHTML = ReactDOMServer.renderToString(
            <Fab
              color="secondary"
              aria-label="add"
              onClick={(e) => {
                r.rempost(id);
              }}
              style={{ position: "fixed", bottom: 20, right: 20 }}
            >
              <DeleteForeverIcon />
            </Fab>
          );
        }
        document.getElementById("name").innerHTML = data.name;
        document.getElementById("username").innerHTML = "By " + data.uname;
        var md0 = require("md0");
        var markdown = data.text;
        var option = {
          codeIndex: true,
          codeHeight: 0,
          titleAnchor: true,
          catalog: false,
        };
        document.getElementById("text").innerHTML = md0(markdown, option);
      });
    }
  });

  return (
    <div>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Mydiary
          </Typography>
        </Toolbar>
      </AppBar>
      <CssBaseline />
      <div style={{ margin: "25px" }}>
        <div id="error">
          <Typography variant="h4" id="name" />
          <span style={{ opacity: "60%" }} id="username" />
          <Typography
            variant="body1"
            id="text"
            style={{ paddingTop: "20px" }}
          />
          <div id="text" />
        </div>
      </div>
      <div id="fab" />
    </div>
  );
}
