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
        document.getElementById("text").innerHTML = data.text;
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
        <Typography variant="h4" id="name"></Typography>{" "}
        <Typography variant="body1" id="text" style={{paddingTop:'20px'}}></Typography>{" "}
        <div id="text"></div>
      </div>
    </div>
  );
}
