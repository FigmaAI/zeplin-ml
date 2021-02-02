import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthProvider } from "./providers/AuthProvider";
import { StoreProvider } from "./providers/StoreProvider";

import Connect from "./pages/Connect";
import Create from "./pages/Create";
import Home from "./pages/Home";
import Predict from "./pages/Predict";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <Switch>
            <Route exact path="/home" children={<Home />} />
            <Route exact path="/" children={<Connect />} />
            <PrivateRoute exact path="/create" children={<Create />} />
            <Route exact path="/predict" children={<Predict />} />
          </Switch>
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
