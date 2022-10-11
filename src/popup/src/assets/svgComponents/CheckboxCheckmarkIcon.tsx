import { SVGProps } from "react";

const CheckBoxCheckMarkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={10} height={7} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m1.712 3.566 2.193 2.193L8.692.97"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CheckBoxCheckMarkIcon;
