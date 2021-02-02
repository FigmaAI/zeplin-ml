import React from "react";

import { Box, Link } from "@material-ui/core";

import IntegrationImage from "../IntegrationImage";

export default function Header() {
  return (
    <Box textAlign="center" marginBottom={6} marginTop={8}>
      <Box position="absolute" right={16} top={16}>
        <Link
          style={{ marginRight: 12 }}
          href="https://github.com/mertkahyaoglu/zeplin-google-slides"
          target="_blank"
          rel="noopener"
        >
          <img
            src="/github.svg"
            width="24"
            alt="mertkahyaoglu/zeplin-google-slides"
          />
        </Link>
        {/*<Link
          href="https://www.producthunt.com/"
          target="_blank"
          rel="noopener"
        >
          <img src="/producthunt.svg" width="24" alt="Product Hunt " />
        </Link>
        */}
      </Box>

      <IntegrationImage />
      <h1>Zeplin ML</h1>
      <p>Object detection from Zeplin projects based on machine learning</p>
    </Box>
  );
}
