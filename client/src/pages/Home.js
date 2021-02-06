import axios from "axios";
import React from "react";
import { Button, theme } from "../components";
export default function Home() {
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState({});
  React.useEffect(() => {
    axios
      .get("https://api.mydiary.tech/api/v1/user", {
        headers: { Token: localStorage.getItem("token") },
      })
      .then((r) => {
        if (r.data.name) {
          setLoggedIn(true);
          setUser(r.data);
        } else setLoggedIn(false);
      });
  }, []);
  return (
    <>
      <div
        style={{
          margin: "5vh",
          marginTop: window.innerWidth > 720 ? "23vh" : 50,
        }}
      >
        <h1
          style={{
            fontSize: 50,
            margin: 10,
            display: "inline-block",
            background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Mydiary
        </h1>
        <br />
        <h1
          style={{
            fontSize: 35,
            margin: 10,
            display: "inline-block",
            background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Save here
        </h1>
        <br />
        <h1
          style={{
            fontSize: 35,
            margin: 10,
            display: "inline-block",
            background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Open everywhere
        </h1>
        <br />
        <p style={{ margin: 10 }}>
          Sign up for your persoanal notes storage now. It is completly free.
        </p>
        {isLoggedIn ? (
          <Button
            onClick={() => {
              window.location.href = "/account";
            }}
          >
            Countinue as {user.name}
          </Button>
        ) : (
          <>
            <Button
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              Create account
            </Button>{" "}
            or{" "}
            <Button
              onClick={() => {
                window.location.href = "/login";
              }}
              outline
            >
              Login
            </Button>
          </>
        )}
      </div>
    </>
  );
}
