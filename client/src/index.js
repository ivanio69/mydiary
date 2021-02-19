import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeSwitch } from "./components";
// Pages imports
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import User from "./pages/User";
import E404 from "./pages/E404";
import E401 from "./pages/E401";
import Note from "./pages/Note";

ReactDOM.render(
  <Router>
    <ThemeSwitch />
    <Switch>
      <Route path="/login" children={<Login />} />
      <Route path="/note/:id" children={<Note />} />
      <Route path="/user/:username" children={<User />} />
      <Route path="/account" children={<Account />} />
      <Route path="/account/newnote" children={<Account newnote />} />
      <Route path="/register" children={<Register />} />
      <Route path="/401" children={<E401 />} />
      <Route path="/" exact children={<Home />} />
      <Route path="*" exact children={<E404 />} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
