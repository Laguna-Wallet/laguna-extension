import * as React from "react";
import { SVGProps } from "react";

const BarcodeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={12} height={12} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M9.333 7.333v4m-2-2h4M2 4.667h1.333c.737 0 1.334-.597 1.334-1.334V2c0-.736-.597-1.333-1.334-1.333H2C1.264.667.667 1.264.667 2v1.333c0 .737.597 1.334 1.333 1.334Zm6.667 0H10c.736 0 1.333-.597 1.333-1.334V2c0-.736-.597-1.333-1.333-1.333H8.667C7.93.667 7.333 1.264 7.333 2v1.333c0 .737.597 1.334 1.334 1.334ZM2 11.333h1.333c.737 0 1.334-.597 1.334-1.333V8.667c0-.737-.597-1.334-1.334-1.334H2c-.736 0-1.333.597-1.333 1.334V10c0 .736.597 1.333 1.333 1.333Z"
      stroke="#11171D"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BarcodeIcon;
