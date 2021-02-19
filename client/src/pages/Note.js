import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import {
  Input,
  Button,
  theme,
  alerts,
  closeModalAnimation,
  openModalAnimation,
} from "../components";
import ReactModal from "react-modal";
import LoadingOverlay from "react-loading-overlay";

export default function Note() {
  const { id } = useParams();
  const [note, setNote] = useState({});
  const [user, setUser] = useState({});
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [noteName, setNoteName] = React.useState("");
  const [noteBody, setNoteBody] = React.useState("");
  useEffect(() => {
    axios.post("https://api.mydiary.tech/api/v1/getNote", { id }).then((r) => {
      if (r.data.note) {
        setNote(r.data);
        setNoteBody(r.data.note.body);
        setNoteName(r.data.note.name);
      } else {
        window.location.href = "/account";
      }
    });
    if (localStorage.getItem("token")) {
      axios
        .get("https://api.mydiary.tech/api/v1/user", {
          headers: { token: localStorage.getItem("token") },
        })
        .then((r) => {
          setLoading(false);
          setUser(r.data);
        })
        .catch((err) => {
          setLoading(false);
          alerts.error(err);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  return (
    <>
      <LoadingOverlay
        active={loading}
        styles={{ wrapper: (base) => ({ ...base, height: "100vh" }) }}
        spinner
      >
        <div style={{ padding: 20 }}>
          <h1 style={{ color: theme.colors.primary }}>
            {note.note ? note.note.name : "Loading..."}
          </h1>
          <p>
            By{" "}
            <a
              style={{ color: theme.colors.primary }}
              href={"/user/" + (note.user ? note.user.username : null)}
            >
              {note.user ? note.user.name : null}
            </a>
          </p>
          <Markdown>{note.note ? note.note.body : "Loading..."}</Markdown>
        </div>
        <div style={{ position: "fixed", right: 20, bottom: 20 }}>
          {note.user ? (
            user.username === note.user.username ? (
              <Button
                onClick={() => {
                  setEditModalOpen(true);
                }}
              >
                Edit
              </Button>
            ) : (
              <Button>Login</Button>
            )
          ) : null}
        </div>

        <ReactModal
          onAfterOpen={() => {
            openModalAnimation();
          }}
          id="modal"
          isOpen={editModalOpen}
          onRequestClose={() => {
            closeModalAnimation(setEditModalOpen);
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
          <h1 style={{ margin: 10 }}>Change this note</h1>
          <p style={{ margin: 10 }}>What we're changing today?</p>
          <Input
            type="text"
            style={{
              margin: "10px 0px",
              width: window.innerWidth > 720 ? null : "100%",
            }}
            value={noteName}
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
            value={noteBody}
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
              margin: "15px 0px",
              width: window.innerWidth > 720 ? null : "100%",
            }}
            onClick={() => {
              setLoading(true);

              axios
                .post(
                  "https://api.mydiary.tech/api/v1/updateNote",
                  {
                    uuid: note.note.uuid,
                    noteName,
                    noteBody,
                  },
                  { headers: { token: localStorage.getItem("token") } }
                )
                .then((r) => {
                  setLoading(true);
                  window.location.reload();
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
              margin: 0,
              width: window.innerWidth > 720 ? null : "100%",
            }}
            onClick={() => {
              axios
                .post(
                  "https://api.mydiary.tech/api/v1/removeNote",
                  {
                    uuid: note.note.uuid,
                  },
                  { headers: { token: localStorage.getItem("token") } }
                )
                .then((r) => {
                  setLoading(true);

                  window.location.href = "/account";
                })
                .catch((err) => {
                  setLoading(false);
                  alerts.error(err);
                });
            }}
            wide
            outline
            danger
          >
            Remove
          </Button>
          <br />
          <Button
            style={{
              margin: "10px 0",
              width: window.innerWidth > 720 ? null : "100%",
            }}
            onClick={() => {
              closeModalAnimation(setEditModalOpen);
            }}
            wide
            outline
          >
            Exit
          </Button>
        </ReactModal>
      </LoadingOverlay>
    </>
  );
}
