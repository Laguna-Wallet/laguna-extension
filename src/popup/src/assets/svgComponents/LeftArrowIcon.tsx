import { SVGProps } from 'react';

const LeftArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={6} height={10} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M5 1 1 5l4 4"
      stroke={props.stroke || '#090A0B'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LeftArrowIcon;
