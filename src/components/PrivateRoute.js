import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useAuth } from "../providers/AuthProvider";

// import CircularProgress from "@material-ui/core/CircularProgress";
// import { Box } from "@material-ui/core";

export default function PrivateRoute({ children, ...rest }) {
  // const { isAuthenticatingGoogle, isAllConnected } = useAuth();
  const { isAllConnected } = useAuth();

  // if (isAuthenticatingGoogle) {
  //   return (
  //     <Box position="absolute" left="50%" top="50%" translate="-50%">
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAllConnected ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
