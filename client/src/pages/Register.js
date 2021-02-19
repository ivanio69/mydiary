import React from "react";
import { alerts, Button, Input, validate } from "../components";
import axios from "axios";

export default function Home() {
  const [username, setUsername] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <form
        style={{
          width: 320,
          margin: "auto",
          marginTop: "20vh",
          padding: 0,
          textAlign: "center",
          borderRadius: 15,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          validate(username, "username")
            .then(() => {
              validate(password, "password").then(() => {
                axios
                  .post("https://api.mydiary.tech/api/v1/register", {
                    username,
                    name,
                    password: password,
                  })
                  .then((r) => {
                    setLoading(false);
                    if (r.data.status === 0) {
                      alerts.error(r.data.message);
                    } else if (r.data.status === 1) {
                      localStorage.setItem("token", r.data.token);
                      window.location.href = "/account";
                    }
                  })
                  .catch((err) => {
                    setLoading(false);
                    alerts.error(err);
                  });
              });
            })
            .catch((err) => {
              setLoading(false);
              alerts.error(err.error);
            });
        }}
      >
        <h2 style={{ padding: 0, margin: "15px 0px" }}>
          Create new Mydiary account
        </h2>
        <p style={{ margin: "15px 0" }}>Welcome to Mydiary! Hope you enjoy!</p>
        <Input
          placeholder="Your name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <br />
        <Input
          placeholder="Your username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <br />
        <Input
          placeholder="Your password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
        />
        <br />
        <Button style={{ width: loading ? 100 : 300 }}>
          {loading ? "Loading..." : "Login!"}
        </Button>
      </form>
    </>
  );
}
