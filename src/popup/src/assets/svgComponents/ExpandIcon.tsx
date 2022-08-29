import { SVGProps } from "react";

const ExpandIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1 5V1m0 0h4M1 1l5 5m11-1V1m0 0h-4m4 0-5 5M1 13v4m0 0h4m-4 0 5-5m11 5-5-5m5 5v-4m0 4h-4"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ExpandIcon;
