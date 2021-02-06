import React from "react";
import { css, StyleSheet } from "aphrodite/no-important";
import "./index.css";
import anime from "animejs/lib/anime.es";
import { BsBrightnessHighFill, BsBrightnessHigh } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

export const theme = {
  colors:
    localStorage.getItem("theme") === "1"
      ? {
          primary: "#224EFF",
          secondary: "#2289FF",
          text1: "#ffffff",
          text2: "#C1C1C1",
          error: "#FF2020",
          background: "#181a1b",
          background2: "#363A3C",
        }
      : {
          primary: "#224EFF",
          secondary: "#2289FF",
          text1: "#000000",
          text2: "#C1C1C1",
          error: "#FF2020",
          background: "#ffffff",
          background2: "#CECECE",
        },
};

const styles = StyleSheet.create({
  buttonUnset: {
    ":hover": {
      transform: "translateY(-10px);",
      boxShadow: "0 0 35px 10px " + theme.colors.primary,
    },
    boxShadow: "0 0 45px 3px " + theme.colors.primary,

    transition: ".3s",
    padding: 10,
    margin: 10,
    borderRadius: 15,
  },
  buttonOutline: {
    background: "transparent",
    border: "2px solid " + theme.colors.primary,
    color: theme.colors.text1,
  },
  buttonOutlineDanger: {
    ":hover": {
      boxShadow: "0 0 35px 10px " + theme.colors.error,
    },
    boxShadow: "0 0 45px 3px " + theme.colors.error,
    background: "transparent",
    border: "2px solid " + theme.colors.error,
    color: theme.colors.text1,
  },
  buttonSolid: {
    border: "none",
    backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
    color: "#ffffff",
  },
  buttonWhite: {
    ":hover": {
      boxShadow: "0 0 35px 10px #FFFFFF",
    },
    border: "none",
    background: "#FFFFFF",
    boxShadow: "0 0 45px 3px #FFFFFF",
    color: "#000000",
  },
  buttonWide: {
    width: 300,
  },

  // Input(s)

  inputUnset: {
    ":focus": {
      transform: "translateY(-10px)",
      boxShadow: "0 0 35px 10px " + theme.colors.primary,
    },
    transition: ".3s",
    minWidth: 300,
    border: "none",
    padding: 10,
    margin: 10,
    borderRadius: 15,
  },
  inputDefault: {
    "::placeholder": {
      color: theme.colors.text2,
    },
    color: "#ffffff",
    backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
    boxShadow: "0 0 45px 3px " + theme.colors.primary,
  },
  inputOutline: {
    border: "3px solid " + theme.colors.primary,
    boxShadow: "0 0 45px 3px " + theme.colors.primary,
  },

  // Alerts
  error: {
    color: "#ffffff",
    position: "fixed",
    top: -50,
    left: 0,
    width: "100vw",
    padding: 10,
    background: theme.colors.error,
  },

  body: {
    background: theme.colors.background,
    color: theme.colors.text1,
  },

  card: {
    ":hover": {
      transform: "translateY(-10px);",
      boxShadow: "0 0 35px 10px " + theme.colors.primary,
    },
    transition: ".3s",
    borderRadius: 15,
    backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
    padding: 15,
    margin: 10,
    width: 350,
    display: "inline-block",
    height: 150,
    textOverflow: "elipsis",
    whiteSpace: "normal",
    overflow: "hidden",
    zIndex: 5,
    boxShadow: "0 0 45px 3px " + theme.colors.primary,
  },
});
document
  .getElementsByTagName("body")[0]
  .setAttribute("class", css(styles.body));

export const Button = (props) => {
  const filteredProps = { ...props };
  delete filteredProps.className;
  delete filteredProps.outline;
  delete filteredProps.white;
  delete filteredProps.wide;
  return (
    <button
      className={css(
        styles.buttonUnset,
        props.className,
        props.outline
          ? styles.buttonOutline
          : props.white
          ? styles.buttonWhite
          : styles.buttonSolid,
        props.wide ? styles.buttonWide : null,
        props.outline
          ? props.danger
            ? styles.buttonOutlineDanger
            : styles.buttonSolidDanger
          : null
      )}
      {...filteredProps}
    >
      {props.children}
    </button>
  );
};

export const Input = (props) => {
  const filteredProps = { ...props };
  delete filteredProps.className;
  delete filteredProps.outline;
  return (
    <input
      {...filteredProps}
      className={css(
        styles.inputUnset,
        props.outline ? styles.inputOutline : styles.inputDefault
      )}
    ></input>
  );
};

export const alerts = {
  error: (value) => {
    const node = document.createElement("div");
    const textNode = document.createTextNode(value);
    node.appendChild(textNode);
    node.setAttribute("class", css(styles.error));
    document.getElementsByTagName("body")[0].appendChild(node);
    anime({
      targets: node,
      translateY: 50,
      easing: "easeInOutCubic",
    }).finished.then(() => {
      setTimeout(() => {
        anime({
          targets: node,
          translateY: -50,
          easing: "easeInOutCubic",
        }).finished.then(() => {
          node.remove();
        });
      }, 2000);
    });
  },
};
export const validate = (value, type) => {
  return new Promise((resolve, reject) => {
    switch (type) {
      case "password":
        if (value)
          if (value.length < 8)
            reject({
              error: "Password must be at least 8 characters long!",
            });
          else {
            if (value.match(/\/|%|\^|\*|!/g)) {
              reject({
                error:
                  "Password must not contain following characters: \\ / % ^ * !",
              });
            } else {
              resolve(value);
            }
          }
        else reject({ error: "Password must be specified!" });
        break;
      case "email":
        if (value)
          if (value.match(/[a-z]@[a-z].[a-z]/g)) resolve(value);
          else reject({ error: "This does not look like legit email!" });
        else reject({ error: "Hey! Provide email please!" });
        break;
      default:
        return false;
    }
  });
};

export const ThemeSwitch = () => {
  return (
    <div
      style={{ position: "absolute", top: 10, right: 10, zIndex: 999999999 }}
    >
      {localStorage.getItem("theme") === "1" ? (
        <Button
          outline
          style={{ padding: "5px 10px", border: "none", boxShadow: "none" }}
          onClick={() => {
            localStorage.setItem("theme", 0);
            window.location.reload();
          }}
        >
          <BsBrightnessHighFill />
        </Button>
      ) : (
        <Button
          outline
          style={{ padding: "5px 10px", border: "none", boxShadow: "none" }}
          onClick={() => {
            localStorage.setItem("theme", 1);
            window.location.reload();
          }}
        >
          <BsBrightnessHigh />
        </Button>
      )}
      {localStorage.getItem("token") ? (
        <Button
          outline
          style={{ padding: "5px 10px", border: "none", boxShadow: "none" }}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          <FiLogOut />
        </Button>
      ) : null}
    </div>
  );
};

export const Card = (props) => {
  return (
    <div className={css(styles.card)} {...props}>
      <h3>{props.title}</h3>
      <p>{props.body}</p>
    </div>
  );
};

export const closeModalAnimation = (close) => {
  anime({
    targets: ".body",
    opacity: "100%",
    easing: "easeInOutCubic",
    translateY: 0,
    duration: 300,
  });

  anime({
    targets: ".ReactModal__Overlay",
    opacity: 0,
    translateY: -100,
    easing: "easeInOutCubic",
    duration: 300,
  }).finished.then(() => {
    close(false);
  });
};

export const openModalAnimation = () => {
  anime({
    targets: ".ReactModal__Overlay",
    opacity: "100%",
    easing: "easeInOutCubic",
    translateY: 0,
    duration: 300,
  });
  anime({
    targets: ".body",
    opacity: "100%",
    easing: "easeInOutCubic",
    translateY: 100,
    duration: 300,
  });
};
