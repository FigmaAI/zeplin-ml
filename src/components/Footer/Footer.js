import React from "react";

import { Box, Link } from "@material-ui/core";

export default function Footer() {
  return (
    <Box marginBottom={2} display="flex">
      <Link
        style={{ marginRight: 16 }}
        href="mailto:mertkahyaoglu93@gmail.com"
        color="textSecondary"
      >
        Contact
      </Link>
      <Link
        style={{ marginRight: 16 }}
        href="https://github.com/mertkahyaoglu/zeplin-google-slides"
        target="_blank"
        rel="noopener"
        color="textSecondary"
      >
        GitHub
      </Link>
      <Link
        style={{ marginRight: 16 }}
        href="https://sites.google.com/view/privacy-policy-zeplinslides"
        target="_blank"
        rel="noopener"
        color="textSecondary"
      >
        Privacy Policy
      </Link>
    </Box>
  );
}
