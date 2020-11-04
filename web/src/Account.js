import React from "react";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import { Modal, message } from "antd";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import ReactDOMServer from "react-dom/server";
import getCookie from "./functions/getCookie";
import setCookie from "./functions/setCookie";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/lifecats/mydiary">
        Mydiary{" "}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  name: {
    fontWeight: 300,
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },
  button: {
    position: "fixed",
    bottom: 20,
    right: 20,
  },
  newpostname: {
    marginBottom: 10,
    width: "50%",
  },
  newposttext: {
    marginBottom: 20,
    width: "100%",
  },
}));

function Cardz() {
  const classes = useStyles();
  fetch("/api/v1/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: getCookie("email"),
    }),
  }).then((response) =>
    response.json().then((data) => {
      if (data.length > 0) {
        document.getElementById("notes").innerHTML = null;
      }
      let display_notes = data.reverse();

      display_notes.map(
        (card) =>
          (document.getElementById(
            "notes"
          ).innerHTML += ReactDOMServer.renderToString(
            <Grid item key={card} xs={12} sm={6} md={4}>
              <a href={"/post/" + card.id} style={{ color: "back" }}>
                <Card className={classes.card}>
                  <CardContent
                    style={{ color: "back" }}
                    className={classes.cardContent}
                  >
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.name}
                    </Typography>
                    <Typography>{card.snippet}</Typography>
                  </CardContent>

                  <CardActions>
                    {" "}
                    <Button size="small" color="primary">
                      View
                    </Button>
                  </CardActions>
                </Card>
              </a>
            </Grid>
          ))
      );
    })
  );
  return (
    <h1 style={{ margin: "auto" }}>
      Oh, looks like here's too empty. Very empty...
    </h1>
  );
}

export default function Album() {
  const classes = useStyles();

  const [newpost, setNewpost] = React.useState(false);
  const [share, setShare] = React.useState(false);
  return (
    <React.Fragment>
      <CssBaseline />
      <Modal
        footer={null}
        title="New note"
        onCancel={() => setNewpost(false)}
        visible={newpost}
      >
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            setNewpost(false);
            const noteName = document.getElementById("noteName").value;
            const noteText = document.getElementById("noteText").value;
            fetch("/api/v1/addpost", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: noteName,
                uname: getCookie("name"),
                user_id: getCookie("id"),
                text: noteText,
                email: getCookie("email"),
              }),
            }).then((response) =>
              response.json().then((data) => {
                const response = data;
                if (response.status === 1) {
                  message.success(response.message);
                } else {
                  message.error(response.message);
                }
              })
            );
          }}
        >
          <TextField
            id="noteName"
            className={classes.newpostname}
            label="Name of your art"
          />
          <TextField
            className={classes.newposttext}
            id="noteText"
            rows={4}
            label="Write some goodies"
            multiline
          />
          <p>Markdown supported.</p>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Save it!
          </Button>
        </form>
      </Modal>
      <Modal
        footer={null}
        title="Share account"
        onCancel={() => setShare(false)}
        visible={share}
      >
        Share this link to your account:
        <br />
        https://mydiary.ga/user/{getCookie("id")}
      </Modal>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            style={{ flexGrow: 1 }}
            color="inherit"
            noWrap
          >
            Mydiary - <span className={classes.name}>{getCookie("name")} </span>
          </Typography>
          <Button
            onClick={() => {
              setCookie("name", null, -10);
              setCookie("email", null, -10);
              window.location.href = "/";
            }}
            color="inherit"
          >
            <ExitToAppIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              {getCookie("name")}{" "}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Welcome back!{" "}
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => setNewpost(true)}
                    color="primary"
                  >
                    New note
                  </Button>
                </Grid>
                <Button color="primary" onClick={() => setShare(true)}>
                  Share
                </Button>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container id="notes" spacing={4}>
            <Cardz />
          </Grid>
        </Container>
      </main>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setNewpost(true)}
        className={classes.button}
      >
        <AddIcon />
      </Fab>
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Mydiary
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Fork repository here, help this project!{" "}
        </Typography>
        <Copyright />
      </footer>
    </React.Fragment>
  );
}
