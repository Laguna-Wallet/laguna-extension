import { SVGProps } from "react";

const AutoLockTimerMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
      stroke="#777E91"
      strokeWidth={2}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M11 13a1 1 0 1 0 2 0h-2zm2-4a1 1 0 1 0-2 0h2zm0 4V9h-2v4h2z" fill="#777E91" />
    <path
      d="m21 6-2-2m-9-2h4"
      stroke="#777E91"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AutoLockTimerMenuIcon;
