import React from "react";
import Button from "./lib/Button";

function Home() {
  return (
    <>
      <div className="gradient">
        <div
          style={{
            position: "relative",
            top: "15vh",
            marginLeft: "5vw",
          }}
        >
          <span className="header" style={{ fontSize: 75 }}>
            Mydiary
          </span>
          <br />
          <span className="header" style={{ fontSize: 55 }}>
            Save here
          </span>
          <br />
          <span className="header" style={{ fontSize: 55 }}>
            Open anywere
          </span>
        </div>
        <div
          style={{
            width: "90%",
            textAlign: "left",
            top: "20vh",
            margin: "auto",
            position: "relative",
          }}
        >
          <h2 style={{ color: "#ffffff" }}>
            Sign up for your personal notes storage
          </h2>

          <Button
            onClick={() => (window.location.href = "/register")}
            style={{ margin: 10, padding: "10px 15px", fontSize: 20 }}
          >
            Create account
          </Button>
          {/* <Button
            onClick={() => (window.location.href = "/login")}
            style={{ margin: 10 }}
          >
            Login
          </Button> */}
        </div>
      </div>
    </>
  );
}

export default Home;
