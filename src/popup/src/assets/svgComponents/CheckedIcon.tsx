import { SVGProps } from 'react';

const CheckedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={18} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 11.17 1.83 7 .41 8.41 6 14 18 2 16.59.59 6 11.17Z" fill={props.fill || '#68DD65'} />
  </svg>
);

export default CheckedIcon;
