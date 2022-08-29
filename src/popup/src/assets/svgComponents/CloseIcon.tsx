import * as React from "react";
import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    fill={props.fill || "none"}
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="m4 12 8-8M4 4l8 8"
      stroke={props.stroke || "#11171D"}
      strokeWidth={props.strokeWidth || "none"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgComponent;
