import React from "react";
import { alerts, Button, Input, validate } from "../components";
import axios from "axios";
export default function Home() {
  const [email, setEmail] = React.useState(null);
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
          validate(email, "email")
            .then((email) => {
              validate(password, "password").then((password) => {
                axios
                  .post("https://api.mydiary.tech/api/v1/login", {
                    email,
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
                  .catch(() => {
                    setLoading(false);
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
          Login into Mydiary account
        </h2>
        <p style={{ margin: "15px 0" }}>Welcome back! Nice to see you again!</p>
        <Input
          placeholder="Your email"
          onChange={(e) => {
            setEmail(e.target.value);
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
        </Button>{" "}
      </form>
    </>
  );
}
