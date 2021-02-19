import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, theme } from "../components";
import LoadingOverlay from "react-loading-overlay";
const mdFilter = /`|#|\*|_|-|\(\)|\[|\]|/gm;

export default function User() {
  const { username } = useParams();
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    axios
      .post("https://api.mydiary.tech/api/v1/getUser", { username })
      .then((r) => {
        console.log(r.data);
        setUser(r.data.user);
        if (r.data.status === 0) {
          window.location.href = "/404";
        }
        setLoading(false);
      });
  }, [username]);
  return (
    <LoadingOverlay
      active={loading}
      styles={{ wrapper: (base) => ({ ...base, height: "100vh" }) }}
      spinner
    >
      <div style={{ margin: 20 }}>
        {user ? (
          <>
            <h1>{user.name}</h1>
            <p style={{ color: theme.colors.primary }}>@{user.username}</p>
            <div
              style={{
                textAlign: "center",
                margin: 25,
              }}
            >
              {user.posts
                ? user.posts.length > 0
                  ? user.posts.map((e) => {
                      return (
                        <Card
                          title={e.name}
                          onClick={() => {
                            window.location.href = "/note/" + e.uuid;
                          }}
                          body={e.body.replace(mdFilter, "")}
                        />
                      );
                    })
                  : "This user haven't posted yet!"
                : "Loading..."}
            </div>
          </>
        ) : null}
      </div>
    </LoadingOverlay>
  );
}
