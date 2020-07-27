import React from "react";
import "./App.css";
import { Alert } from "shards-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
/* eslint-disable */
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return true;
    }
  }
  return false;
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function hide() {
  setCookie("ospa", "ok", 60);
  document.getElementById("a").style.transform = "translate(0, -100px)";
}
class Home extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="alert">
          {getCookie("ospa") ? null : (
            <Alert
              theme="primary"
              id="a"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
              }}
            >
              It is open source project, so you can contribute on github: {""}
              <a
                href="https://github.com/lifecats/mydiary"
                target="_blank"
                style={{ color: "white", textDecoration: "underline" }}
              >
                lifecats/mydiary
              </a>
              <button
                className="ts"
                style={{
                  color: "white",
                  float: "right",
                  background: "transparent",
                  border: "none",
                }}
                onClick={hide}
              >
                nah
              </button>{" "}
            </Alert>
          )}
        </div>  
      </div>
    );
  }
}
export default Home;
