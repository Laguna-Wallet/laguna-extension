import { SVGProps } from "react";

const BarcodeSendIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
  <path d="M26.25 10V6.25C26.25 4.86875 25.1313 3.75 23.75 3.75H20" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M10 3.75H6.25C4.86875 3.75 3.75 4.86875 3.75 6.25V10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M3.75 20V23.75C3.75 25.1313 4.86875 26.25 6.25 26.25H10" stroke="#18191A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M20 26.25H23.75C25.1313 26.25 26.25 25.1313 26.25 23.75V20" stroke="#18191A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M3.75 15H26.25" stroke="#18191A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default BarcodeSendIcon;
