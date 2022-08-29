import * as React from "react";
import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
  <path d="M12.5 10.6669L17.1669 6L18.5 7.33312L13.8331 12L18.5 16.6669L17.1669 18L12.5 13.3331L7.83312 18L6.5 16.6669L11.1669 12L6.5 7.33312L7.83312 6L12.5 10.6669Z" fill="#18191A"/>
  </svg>
);

export default SvgComponent;
