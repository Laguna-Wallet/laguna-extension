import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg width={12} height={12} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M.667 3.333V.667m0 0h2.666m-2.666 0L4 4m7.333-.667V.667m0 0H8.667m2.666 0L8 4M.667 8.667v2.666m0 0h2.666m-2.666 0L4 8m7.333 3.333L8 8m3.333 3.333V8.667m0 2.666H8.667"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgComponent;
