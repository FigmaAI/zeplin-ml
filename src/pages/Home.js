import React from "react";
import { useHistory } from "react-router-dom";

import { Typography, Box, Button } from "@material-ui/core";

import Main from "../layouts/Main";
import HomeCard from "../components/HomeCard";
import Footer from "../components/Footer";
import { getToken } from "../services/hyperCLOVA";
import { CLOVA_TOKEN } from "../constants";

export default function Home() {
  const history = useHistory();

  const onClick = () => {
    history.push("/");
  };
  
  getToken(CLOVA_TOKEN);

  return (
    <Main maxWidth="md">
      <Box marginBottom={8}>
        <Typography
          component="h2"
          variant="h5"
          color="textSecondary"
          align="center"
          gutterBottom
        >
          <strong>Zeplin ML</strong> allows you to detect UI components from
          screens of your Zeplin projects autometically in 3 simple steps.
        </Typography>

        <HomeCard
          title="Connect Zeplin accounts"
          image={
            <img width="450" src="/connect.png" alt="Connect Zeplin accounts" />
          }
        />

        <HomeCard
          title="Select a Zeplin project"
          image={
            <img width="450" src="/select.png" alt="Select a Zeplin project" />
          }
          reverse
        />

        <HomeCard
          title="Predict with ML model"
          image={
            <img width="450" src="/created.png" alt="Predict with ML model" />
          }
        />

        <HomeCard
          title="Find the result! 🎉"
          image={
            <img width="250" src="/google-slide.png" alt="Find the result!" />
          }
          reverse
          disableImageBorder
        />

        <Box marginTop={4}>
          <Button
            onClick={onClick}
            size="large"
            variant="contained"
            color="primary"
            fullWidth
            disableElevation
          >
            Start Now
          </Button>
        </Box>
      </Box>
      <Footer />
    </Main>
  );
}
