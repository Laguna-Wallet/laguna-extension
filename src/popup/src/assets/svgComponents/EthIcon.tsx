import * as React from "react";
import { SVGProps } from "react";

const EthIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)">
      <path
        d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z"
        fill="#627EEA"
      />
      <path d="M12.065 5.217v5.015l4.238 1.894-4.238-6.909Z" fill="#fff" fillOpacity={0.602} />
      <path d="m12.065 5.217-4.24 6.909 4.24-1.894V5.217Z" fill="#fff" />
      <path d="M12.065 15.375v3.408l4.24-5.868-4.24 2.46Z" fill="#fff" fillOpacity={0.602} />
      <path d="M12.065 18.783v-3.408l-4.24-2.46 4.24 5.868Z" fill="#fff" />
      <path d="m12.065 14.587 4.238-2.461-4.238-1.893v4.354Z" fill="#fff" fillOpacity={0.2} />
      <path d="m7.826 12.126 4.239 2.46v-4.353l-4.24 1.893Z" fill="#fff" fillOpacity={0.602} />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default EthIcon;
