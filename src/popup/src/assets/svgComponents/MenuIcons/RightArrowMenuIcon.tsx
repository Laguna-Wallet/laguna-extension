import { SVGProps } from 'react';

const RightArrowMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={6}
    height={10}
    fill={props.fill || '#111'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="m1 9 4-4-4-4"
      stroke={props.stroke || '#777E91'}
      fill={props.fill || '#111'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default RightArrowMenuIcon;
