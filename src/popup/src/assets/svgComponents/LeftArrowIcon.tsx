import { SVGProps } from "react";

const LeftArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={10} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m8.51 15-7-7 7-7"
      stroke={props.stroke || "#11171D"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LeftArrowIcon;
