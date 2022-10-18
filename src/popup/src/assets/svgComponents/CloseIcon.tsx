import { SVGProps } from "react";

const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={15} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m1.51 13 12-12m-12 0 12 12"
      stroke="#11171D"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CloseIcon;
