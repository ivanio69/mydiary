import React from "react";
import Button from "./lib/Button";

function Home() {
  return (
    <div className="home">
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
          <span>
            Or <a href="/login">log in your existing account</a>
          </span>
          <p>Also read mode about mydiary by scrolling down</p>{" "}
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 35 }}>
        <div className="secure ca">
          <h3>Secure</h3>
          <p>
            We keep your data in secret by enctypting it. No one can access your
            data without your password and email compination
          </p>
        </div>
        <div className="free ca">
          <h3>Free</h3>
          <p>
            Mydiary will be free and open source while i own it. We will not
            ever sell your data to anyone.
          </p>
        </div>
        <div className="useful ca">
          <h3>useful</h3>
          <p>
            You can make lists, notes for schools and friends, documentation for
            your projects and write down your hometask.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
