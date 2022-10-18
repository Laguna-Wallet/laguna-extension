import { SVGProps } from "react";

const HintIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={21} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.111 10a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 1 1 19.2 0Zm-8.4-4.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Zm-2.4 3.6a1.2 1.2 0 0 0 0 2.4v3.6a1.2 1.2 0 0 0 1.2 1.2h1.2a1.2 1.2 0 1 0 0-2.4V10a1.2 1.2 0 0 0-1.2-1.2h-1.2Z"
      fill="#62768A"
    />
  </svg>
);

export default HintIcon;
