import * as React from "react";
import { SVGProps } from "react";

const EthSuccessIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={130} height={130} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={65.25} cy={65.25} r={46.25} fill="#F5F3FF" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M65 103.4c21.207 0 38.4-17.193 38.4-38.4 0-21.208-17.193-38.4-38.4-38.4-21.208 0-38.4 17.192-38.4 38.4 0 21.207 17.192 38.4 38.4 38.4Zm17.794-44.606a4.8 4.8 0 0 0-6.788-6.788L60.2 67.81l-6.206-6.206a4.8 4.8 0 0 0-6.788 6.789l9.6 9.6a4.8 4.8 0 0 0 6.788 0l19.2-19.2Z"
      fill="#6366F1"
    />
    <circle
      cx={65}
      cy={65}
      r={59}
      stroke="#6366F1"
      strokeWidth={12}
      strokeLinejoin="round"
      strokeDasharray="2 28"
    />
  </svg>
);

export default EthSuccessIcon;
