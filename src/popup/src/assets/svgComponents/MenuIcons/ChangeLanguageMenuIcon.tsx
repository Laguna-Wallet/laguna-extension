import * as React from "react";
import { SVGProps } from "react";

const ChangeLanguageMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"
      stroke="#777E91"
      strokeWidth={2}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 12h18"
      stroke="#777E91"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21c1.657 0 3-4.03 3-9s-1.343-9-3-9-3 4.03-3 9 1.343 9 3 9z"
      stroke="#777E91"
      strokeWidth={2}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChangeLanguageMenuIcon;
