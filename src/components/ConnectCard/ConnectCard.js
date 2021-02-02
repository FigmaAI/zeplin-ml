import React from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";

export default function ConnectCard({
  accountName,
  accountEmail,
  description,
  onConnect,
  onDisconnect,
  isConnected,
  buttonIcon,
  authenticating,
}) {
  let buttonText = "Connect";
  if (isConnected) {
    buttonText = "Disconnect";
  } else if (authenticating) {
    buttonText = "Connecting…";
  }

  const buttonStartIcon = authenticating ? (
    <CircularProgress color="inherit" size={18} />
  ) : (
    buttonIcon
  );

  return (
    <Box marginBottom={4}>
      <Card variant="outlined">
        <CardContent>
          <Typography component="h3" variant="h6" gutterBottom>
            {isConnected ? "Connected to" : "Connect"} {accountName} account
          </Typography>
          <Typography color="textSecondary">
            {isConnected ? (
              <span>
                Connected to account <strong>{accountEmail}</strong>.
              </span>
            ) : (
              description
            )}
          </Typography>

          <Box marginTop={3}>
            <Button
              size="small"
              variant="outlined"
              color={isConnected ? "secondary" : "primary"}
              onClick={isConnected ? onDisconnect : onConnect}
              startIcon={buttonStartIcon}
              disableElevation
              disableFocusRipple
              disabled={authenticating}
            >
              {buttonText}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
