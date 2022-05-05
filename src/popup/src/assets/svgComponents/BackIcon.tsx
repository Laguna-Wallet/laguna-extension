import { SVGProps } from 'react';

const BackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
  <path d="M14 8.04297L10 12.043L14 16.043" 
   stroke={props.stroke || '#18191A'}
   strokeWidth="1.5" 
   strokeLinecap="round" 
   strokeLinejoin="round"/>
  </svg>
);

export default BackIcon;
