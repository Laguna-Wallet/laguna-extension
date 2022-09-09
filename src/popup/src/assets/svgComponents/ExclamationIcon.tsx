import * as React from "react";
import { SVGProps } from "react";

const Exclamation = (props: SVGProps<SVGSVGElement>) => (
  <svg width={4} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m.12.837.387 10.151h2.965L3.88.837H.12Zm0 13.18c0 1.032.849 1.698 1.88 1.698s1.87-.666 1.87-1.697c0-1.032-.839-1.698-1.87-1.698-1.031 0-1.88.666-1.88 1.698Z"
      fill="#000"
    />
  </svg>
);

export default Exclamation;
