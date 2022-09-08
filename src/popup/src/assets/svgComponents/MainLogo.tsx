import { SVGProps } from "react";

const MainLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg width={165} height={165} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.001 33.53C15.62 36.11 27.841 48.493 29.852 64h34.08V43.355H19.766L64.002 0h-29.79L.002 33.53Z"
      fill={props.fill || "#0A0B0D"}
    />
  </svg>
);

export default MainLogo;
