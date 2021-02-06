import { css, StyleSheet } from "aphrodite";
import axios from "axios";
import React from "react";
import {
  alerts,
  Button,
  Card,
  Input,
  theme,
  closeModalAnimation,
  openModalAnimation,
} from "../components";
import { RiAddFill } from "react-icons/ri";
import ReactModal from "react-modal";
import LoadingOverlay from "react-loading-overlay";

export default function Account(props) {
  const phrases = [
    "What is weather outside?",
    "How is it going?",
    "You look amasing!",
    "What will we do today?",
    "How much amasing things will happen today?",
    "Did you wash your hands?",
  ];
  const mdFilter = /`|#|\*|_|-|\(\)|\[|\]|/gm;

  const [user, setUser] = React.useState({});
  const [noteName, setNoteName] = React.useState("");
  const [noteBody, setNoteBody] = React.useState("");
  const [phrase] = React.useState(
    phrases[Math.floor(Math.random() * phrases.length)]
  );
  const [newPostModalOpen, setNewPostModalOpen] = React.useState(
    props.newnote ? true : false
  );
  const [loading, setLoading] = React.useState(true);
  window.onload = () => {
    setLoading(false);
  };
  const styles = StyleSheet.create({
    scroll: {
      "::-webkit-scrollbar": { height: 10 },
      "::-webkit-scrollbar-track": {
        background: theme.colors.background2,
      },
      "::-webkit-scrollbar-thumb": { background: theme.colors.primary },
      padding: window.innerWidth > 720 ? 45 : "45px 0",
      zinde: 1,
      whiteSpace: "nowrap",
      overflowX: "auto",
      overflowY: "hidden",
      textAlign: "center",
    },
  });
  const horizontalScroll = (e) => {
    e.preventDefault();
    document.getElementById("scroll").scrollTo({
      top: 0,
      left: document.getElementById("scroll").scrollLeft + e.deltaY,
      behaviour: "smooth",
    });
  };
  React.useEffect(() => {
    axios
      .get("https://api.mydiary.tech/api/v1/user", {
        headers: { token: localStorage.getItem("token") },
      })
      .then((r) => {
        setLoading(false);
        if (r.data.status === 3) {
          alerts.error(r.data.message);
        } else {
          setUser(r.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        alerts.error(err);
      });
  }, []);
  return (
    <>
      <LoadingOverlay
        active={loading}
        styles={{ wrapper: (base) => ({ ...base, height: "100vh" }) }}
        spinner
      >
        {/*Modal*/}
        <ReactModal
          onAfterOpen={() => {
            openModalAnimation();
          }}
          id="modal"
          isOpen={newPostModalOpen}
          onRequestClose={() => {
            closeModalAnimation(setNewPostModalOpen);
          }}
          style={{
            overlay: {
              background: theme.colors.background,
              opacity: 0,
              transform: "translateY(-100px)",
            },
            content: {
              top: 0,
              left: 0,
              background: theme.colors.background,
              border: "none",
              width: "100vw",
              height: "100vh",
            },
          }}
        >
          <h1 style={{ margin: 10 }}>Create new note</h1>
          <p style={{ margin: 10 }}>What's will it be today?</p>
          <Input
            style={{
              margin: "10px 0px",
              width: window.innerWidth > 720 ? null : "100%",
            }}
            placeholder="What is name of this note?"
            onChange={(e) => {
              setNoteName(e.target.value);
            }}
          />
          <br />
          <textarea
            onChange={(e) => {
              setNoteBody(e.target.value);
            }}
            outline
            style={{
              height: 300,
              borderRadius: 15,
              padding: 10,
              color: theme.colors.text1,
              background: "transparent",
              margin: "10px 0px",
              width: window.innerWidth > 720 ? "50vw" : "100%",
            }}
            placeholder="What is name of this note?"
          />
          <br />
          <Button
            style={{
              margin: 0,
              width: window.innerWidth > 720 ? null : "100%",
            }}
            onClick={() => {
              setLoading(true);

              axios
                .post(
                  "https://api.mydiary.tech/api/v1/createNote",
                  {
                    noteName,
                    noteBody,
                  },
                  { headers: { token: localStorage.getItem("token") } }
                )
                .then((r) => {
                  window.location.href = "/note/" + r.data.note.uuid;
                })
                .catch((err) => {
                  setLoading(false);
                  alerts.error(err);
                });
            }}
            wide
          >
            Save!
          </Button>
          <br />
          <Button
            style={{
              margin: "10px 0",
              width: window.innerWidth > 720 ? null : "100%",
            }}
            onClick={() => {
              closeModalAnimation(setNewPostModalOpen);
            }}
            wide
            outline
          >
            Exit{" "}
          </Button>
        </ReactModal>

        {/*Body*/}
        <div
          className="body"
          style={{
            width: window.innerWidth > 720 ? "50vw" : "100vw",
            margin: "auto",
          }}
        >
          <h3 style={{ padding: 20 }}>
            Welcome back,{" "}
            <span style={{ color: theme.colors.primary }}>{user.name}!</span>
          </h3>
          <p style={{ padding: 20, paddingTop: 0 }}>{phrase}</p>
          <h2 style={{ marginLeft: 20 }}>My notes</h2>
          <div
            id="scroll"
            style={{ scrollSnapType: "x mandatory " }}
            className={css(styles.scroll)}
            onWheel={horizontalScroll}
          >
            {user.posts
              ? user.posts.length > 0
                ? user.posts.map((e) => (
                    <div
                      style={{
                        width: window.innerWidth > 720 ? null : "100%",
                        scrollSnapAlign:
                          window.innerWidth > 720 ? null : "start",
                        display: "inline-block",
                      }}
                    >
                      <Card
                        onClick={() => {
                          window.location.href = "/note/" + e.uuid;
                        }}
                        title={e.name}
                        body={e.body.replace(mdFilter, "")}
                      />
                    </div>
                  ))
                : "No notes here yet!"
              : null}
          </div>
        </div>
        <Button
          onClick={() => {
            setNewPostModalOpen(true);
          }}
          style={{
            position: "fixed",
            bottom: 15,
            right: 15,
            width: 50,
            height: 50,
            borderRadius: "50%",
            fontSize: "1.5em",
          }}
        >
          <RiAddFill />
        </Button>
      </LoadingOverlay>
    </>
  );
}
