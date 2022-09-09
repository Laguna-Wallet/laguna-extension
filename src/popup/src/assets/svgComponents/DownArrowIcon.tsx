import { SVGProps } from "react";

const DownArrowIcon = (props: SVGProps<SVGSVGElement> & { fill?: string }) => (
  <svg width={10} height={7} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M4.773 4.296 8.486.583l1.06 1.06-4.773 4.774L0 1.644 1.06.584l3.713 3.712Z"
      fill={props?.fill || "#000"}
    />
  </svg>
);

export default DownArrowIcon;
