import React from "react";
import { Button, theme } from "../components";
import anime from "animejs/lib/anime.es";

export default function Home() {
  React.useEffect(() => {
    anime({
      targets: "#heading",
      loop: true,
      duration: 2500,
      keyframes: [{ fontSize: 490 }, { fontSize: 500 }],
      easing: "easeInOutQuad",
    });
  });
  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <h1
        id="heading"
        style={{
          width: "100vw",
          fontSize: 500,
          color: theme.colors.primary,
        }}
      >
        401
      </h1>
      <p>Looks like you don't have premossion to view this!!</p>
      <Button
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Go home!
      </Button>
    </div>
  );
}
