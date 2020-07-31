import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Post from "./Post";
import Account from "./Account";
import Register from "./Register";
import Login from "./Login";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/account">
        <Account />
      </Route>
      <Route path="/post/:id" children={<Post />} />
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
