import React from "react";

import { Typography, Box, Paper } from "@material-ui/core";

export default function HomeCard({ title, image, reverse, disableImageBorder }) {
  return (
    <Box marginTop={8}>
      <Paper variant="outlined">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexWrap="wrap"
          flexDirection={reverse ? "row-reverse" : "row"}
          padding={4}
        >
          <Typography component="h3" variant="h5" align="center">
            {title}
          </Typography>
          <Box
            border={!disableImageBorder ? "2px solid #f5f5f5" : ""}
            borderRadius={4}
          >
            {image}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
