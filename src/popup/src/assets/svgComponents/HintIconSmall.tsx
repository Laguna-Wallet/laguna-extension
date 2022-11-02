import * as React from "react";
import { SVGProps } from "react";

const HintIconSmall = (props: SVGProps<SVGSVGElement>) => (
  <svg width={13} height={13} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.91 6.5a6.4 6.4 0 1 1-12.8 0 6.4 6.4 0 0 1 12.8 0Zm-5.6-3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0Zm-1.6 2.4a.8.8 0 1 0 0 1.6v2.4a.8.8 0 0 0 .8.8h.8a.8.8 0 0 0 0-1.6V6.5a.8.8 0 0 0-.8-.8h-.8Z"
      fill="#62768A"
    />
  </svg>
);

export default HintIconSmall;
