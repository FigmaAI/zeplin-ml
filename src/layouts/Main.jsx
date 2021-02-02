import React from "react";

import { Container } from "@material-ui/core";

import Header from "../components/Header";

function Main({ children, maxWidth = "sm" }) {
  return (
    <Container maxWidth={maxWidth}>
      <Header />

      {children}
    </Container>
  );
}

export default Main;
