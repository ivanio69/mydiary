import React from "react";
import { useParams } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Button from "./lib/Button";
import { message } from "antd";
import TextField from "@material-ui/core/TextField";
import ReactDOMServer from "react-dom/server";
import { Result } from "antd";
import getCookie from "./functions/getCookie";

export default function EditPost() {
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
          document.getElementById("name").value = data.name;
          document.getElementById("text").value = data.text;
        } else {
          document.getElementById(
            "error"
          ).innerHTML = ReactDOMServer.renderToString(
            <Result
              status="403"
              title="403"
              subTitle="Sorry, you are not authorized to access this page."
            />
          );
        }
      });
    }
  });

  return (
    <div style={{ background: "#2e2e2e", height: "100vh" }}>
      <AppBar position="relative" style={{ zIndex: 1 }}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Mydiary
          </Typography>
        </Toolbar>
      </AppBar>{" "}
      <div id="error">
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            const noteName = document.getElementById("name").value;
            const noteText = document.getElementById("text").value;
            fetch("/api/v1/editpost", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: id,
                name: noteName,
                text: noteText,
              }),
            }).then((response) =>
              response.json().then((data) => {
                const response = data;
                if ((response.ok = 1)) {
                  message.success("Edited");
                  window.location.href = "/post/" + id;
                } else {
                  message.error("Something went wrong...");
                }
              })
            );
          }}
        >
          <TextField
            id="name"
            style={{ width: "40vw", margin: "1vw 2vw", fontSize: "50px" }}
            label=""
          />
          <br />
          <TextField
            style={{ width: "96vw", margin: "1vw 2vw" }}
            id="text"
            rows={20}
            label=""
            multiline
          />
          <Button
            type="submit"
            style={{ margin: "2vw", padding: "10px 15px", float: "right" }}
            variant="contained"
            color="primary"
          >
            Save it!
          </Button>
        </form>
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            fetch("/api/v1/rmpost", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: id,
                email: getCookie("email"),
              }),
            }).then((response) =>
              response.json().then((data) => {
                const response = data;
                if ((response.ok = 1)) {
                  message.success("Removed");
                  window.location.href = "/";
                } else {
                  message.error("Something went wrong...");
                }
              })
            );
          }}
        >
          <Button
            type="submit"
            style={{ margin: "2vw", float: "left" }}
            variant="contained"
            color="secondary"
          >
            Remove{" "}
          </Button>
        </form>
      </div>
    </div>
  );
}
