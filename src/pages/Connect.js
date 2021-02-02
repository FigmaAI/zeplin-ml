import React from "react";
import { useHistory } from "react-router-dom";

import { Button } from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";

import { useAuth } from "../providers/AuthProvider";

import Main from "../layouts/Main";

import ZeplinConnectCard from "../components/ZeplinConnectCard";
// import GoogleConnectCard from "../components/GoogleConnectCard";

function Connect() {
  const history = useHistory();
  const { isAllConnected } = useAuth();


  const onCreate = () => {
    history.push("/create");
  };

  return (
    <Main>
      <ZeplinConnectCard />
      {/* <GoogleConnectCard /> */}

      {isAllConnected && (
        <Button
          onClick={onCreate}
          size="large"
          variant="contained"
          color="primary"
          endIcon={<ArrowForward />}
          fullWidth
          disableElevation
        >
          Next step
        </Button>
      )}
    </Main>
  );
}

export default Connect;
