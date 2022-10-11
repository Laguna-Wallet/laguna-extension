import * as React from "react";
import { SVGProps } from "react";

const ConnectedSitesMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0z"
      stroke="#777E91"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"
      stroke="#777E91"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ConnectedSitesMenuIcon;
