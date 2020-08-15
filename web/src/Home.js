import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

function Home() {
  return (
    <div>
      <div className="gradient">
      <Typography
        variant="h3"
        style={{
          width: "90%",
          textAlign: "center",
          top: "20vh",
          margin: "auto",
          position: "relative",
          color:"#ffffff  "
        }}
      >
        Mydiary - store your notes
      </Typography>
      <div
        style={{
          width: "90%",
          textAlign: "center",
          top: "25vh",
          margin: "auto",
          position: "relative",
        }}
      >
        <Button
          variant="contained"
          onClick={() => (window.location.href = "/register")}
          style={{ margin: 10 }}
          color="primary"
        >
          Create account
        </Button>
        <Button
          variant="outlined"
          onClick={() => (window.location.href = "/login")}
          style={{ margin: 10, color:'#ffffff' ,borderColor:"#ffffff"}}
          color="primary"
        >
          Login
        </Button>
      </div>
      </div>
    </div>
  );
}

export default Home;
