import { SVGProps } from "react";

const ArrowsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m3 8.571 2.571 2.572M3 8.571 5.571 6M3 8.571h11.571M21 15.643l-2.572-2.572M21 15.643l-2.572 2.572M21 15.643H9.428"
      stroke={props.stroke}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArrowsIcon;
