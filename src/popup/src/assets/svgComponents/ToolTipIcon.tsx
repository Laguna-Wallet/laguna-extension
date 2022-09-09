import { SVGProps } from "react";

const ToolTipIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0ZM7.8 3.8a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM6.2 6.2a.8.8 0 1 0 0 1.6v2.4a.8.8 0 0 0 .8.8h.8a.8.8 0 0 0 0-1.6V7a.8.8 0 0 0-.8-.8h-.8Z"
      fill="#62768A"
    />
  </svg>
);

export default ToolTipIcon;
