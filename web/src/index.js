import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import { Result } from "antd";
import Post from "./Post";
import Account from "./Account";
import Register from "./Register";
import User from "./User.js";
import EditPost from "./EditPost";
import Login from "./Login";
import * as serviceWorker from "./serviceWorker";
import getCookie from "./functions/getCookie";
ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/register">
        <Register />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>

      <Route exact path="/user/:id" children={<User />} />
      <Route exact path="/post/:id" children={<Post />} />
      <Route exact path="/post/:id/edit" children={<EditPost />} />
      {getCookie("email").length > 0 ? (
        <>
          <Route exact path="/">
            <Account />
          </Route>
        </>
      ) : (
        <Route exact path="/">
          <Home />
        </Route>
      ) }
      <Route exact path="*" status={404}>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
        />{" "}
      </Route>
    </Switch>
  </Router>,
  document.getElementById("root")
);

serviceWorker.unregister();
