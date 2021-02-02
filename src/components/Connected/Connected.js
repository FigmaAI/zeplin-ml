import React from "react";
import { Avatar, Chip, Box } from "@material-ui/core";

export default function Connected() {
  return (
    <Box>
      <Chip
        avatar={<Avatar src="zeplin.png" />}
        label="Zeplin"
        onDelete={() => console.log()}
      />
      <Chip
        avatar={
          <Avatar src="google.png" />
        }
        label="Google"
        onDelete={() => console.log()}
      />
    </Box>
  );
}
