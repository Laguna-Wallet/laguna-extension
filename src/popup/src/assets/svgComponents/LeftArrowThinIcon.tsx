import { SVGProps } from 'react';

const LeftArrowThinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M10 12.667 5.333 8 10 3.333"
      stroke={props.stroke || '#11171D'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LeftArrowThinIcon;
