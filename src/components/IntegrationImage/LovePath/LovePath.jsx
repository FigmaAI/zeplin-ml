import React from "react";

import { Box } from "@material-ui/core";

function LovePath() {
  return (
    <Box marginX={1}>
      <svg width="57" height="26" viewBox="0 0 38 17">
        <defs>
          <linearGradient
            id="a"
            x1="35.626%"
            x2="56.471%"
            y1="53.179%"
            y2="52%"
          >
            <stop offset="0%" stopColor="#FFCB03" />
            <stop offset="100%" stopColor="#f4b913" />
          </linearGradient>
        </defs>
        <path
          fill="none"
          fillRule="evenodd"
          stroke="url(#a)"
          strokeDasharray="1,2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M0 12.558c12.035 5.308 18.719 1.963 20.053-10.034.785-7.061-9.904 2.949-4.952 2.825 4.952-.124-8.59-9.382-4.855-.946C14.954 15.04 29.336 13.174 36 7.5"
          transform="translate(1 1)"
        />
      </svg>
    </Box>
  );
}

export default LovePath;
