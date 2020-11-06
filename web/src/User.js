import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Modal, Result } from "antd";
import Button from "./lib/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { useParams } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import ReactDOMServer from "react-dom/server";
import getCookie from "./functions/getCookie";
function Copyright() {
  return (
    <Typography variant="body2" style={{ color: "#ffffff" }} align="center">
      <b>{"Under Creative Commons 2.0. "}</b>
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
    background: "#424242",
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
  let { id } = useParams();
  const classes = useStyles();
  fetch("/api/v1/userdata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: id,
    }),
  }).then((response) =>
    response.json().then((data) => {
      if (data === null) {
        document.getElementById(
          "root"
        ).innerHTML = ReactDOMServer.renderToString(
          <Result
            status="404"
            title="404"
            subTitle="Sorry, user you visited does not exist."
          />
        );
      } else {
        if (data.notes.length > 0) {
          document.getElementById("notes").innerHTML = null;
        }
        document.getElementById("name").innerHTML = data.name;
        document.getElementById("reg_date").innerHTML =
          "Joined on " + data.registered;
        let display_notes = data.notes.reverse();
        display_notes.map(
          (card) =>
            (document.getElementById(
              "notes"
            ).innerHTML += ReactDOMServer.renderToString(
              <Grid item key={card} xs={12} sm={6} md={4}>
                <a href={"/post/" + card.id} style={{ color: "back" }}>
                  <Card className={classes.card}>
                    <CardContent
                      style={{ color: "#ffffff" }}
                      className={classes.cardContent}
                    >
                      <Typography
                        gutterBottom
                        variant="h5"
                        style={{ color: "#ffffff" }}
                        component="h2"
                      >
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
      }
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

  const [share, setShare] = React.useState(false);
  return (
    <React.Fragment>
      <CssBaseline />

      <Modal
        footer={null}
        title="Share account"
        onCancel={() => setShare(false)}
        visible={share}
        className="modla"
      >
        Share this link to this account:
        <br />
        {window.location.href}
      </Modal>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            style={{ flexGrow: 1 }}
            color="inherit"
            noWrap
          >
            {" "}
            <a href="/" style={{ color: "#000000" }}>
              Mydiary -{" "}
              <span className={classes.name}>{getCookie("name")} </span>
            </a>
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              gutterBottom
              style={{ color: "#ffffff" }}
              id="name"
            >
              ...
            </Typography>
            <div
              style={{ textAlign: "center", paddingTop: 20 }}
              id="reg_date"
            />
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item></Grid>
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

      <footer className={classes.footer}>
        <Typography
          variant="h6"
          align="center"
          style={{ color: "#ffffff" }}
          gutterBottom
        >
          Mydiary
        </Typography>

        <Copyright />
      </footer>
    </React.Fragment>
  );
}
