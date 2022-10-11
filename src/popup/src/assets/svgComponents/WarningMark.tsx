import * as React from "react";
import { SVGProps } from "react";

const WarningMark = (props: SVGProps<SVGSVGElement>) => (
  <svg width={11} height={10} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M5.173 5.926a.5.5 0 0 1-.5-.5v-1.5a.5.5 0 0 1 1 0v1.5a.5.5 0 0 1-.5.5ZM4.423 7.176a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z"
      fill="#FB5A5A"
    />
    <path
      d="M4.288.534a1 1 0 0 1 1.77 0l4.172 7.927a1 1 0 0 1-.885 1.465H1.001a1 1 0 0 1-.885-1.465L4.288.534Zm5.057 8.392L5.173 1 1.001 8.926h8.344Z"
      fill="#FB5A5A"
    />
  </svg>
);

export default WarningMark;
