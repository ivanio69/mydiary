import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Fab from "@material-ui/core/Fab";
import { Result, Modal } from "antd";
import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useParams } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import "./css/post.css";
import getCookie from "./functions/getCookie";

export default function Post() {
  let { id } = useParams();
  const [share, setShare] = React.useState(false);

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
          document.getElementById(
            "fab"
          ).innerHTML = ReactDOMServer.renderToString(
            <a href={"/post/" + id + "/edit"}>
              {" "}
              <Fab
                color="primary"
                aria-label="edit"
                style={{ position: "fixed", bottom: 20, right: 20 }}
              >
                <EditIcon />
              </Fab>
            </a>
          );
        }
        document.getElementById("name").innerHTML = data.name;
        document.getElementById("username").innerHTML =
          'By  <a href="/user/' + data.user_id + '">' + data.uname + "</a>";
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
      <Modal
        footer={null}
        title="Share account"
        onCancel={() => setShare(false)}
        visible={share}
      >
        Share this link to this post:
        <br />
        {window.location.href}{" "}
      </Modal>
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
          <span style={{ float: "right" }}>
            {" "}
            <Button color="primary" onClick={() => setShare(true)}>
              Share
            </Button>
          </span>
          <Typography variant="h4" id="name" style={{ color: "#ffffffff" }} />

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
