import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useParams } from "react-router-dom";
export default function Post() {
  let { id } = useParams();

  fetch("/api/v1/getnote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: id,
    }),
  }).then((response) =>
    response.json().then((data) => {
      document.getElementById("name").innerHTML = data.name;
      document.getElementById("username").innerHTML = "By " + data.uname;
      var md0 = require("md0");

      var markdown = data.text
      var option = {
        codeIndex: true,
        codeHeight: 0,
        titleAnchor: true,
        catalog: false,
      };
      document.getElementById("text").innerHTML = md0(markdown, option);
    })
  );

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
        <Typography variant="h4" id="name" />
        <span style={{ opacity: "60%" }} id="username"/>
        <Typography variant="body1" id="text" style={{ paddingTop: "20px" }} />
        <div id="text" />
      </div>
    </div>
  );
}
