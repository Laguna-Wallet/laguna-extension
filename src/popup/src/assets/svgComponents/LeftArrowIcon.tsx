import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg width={8} height={12} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.249.351a1.2 1.2 0 0 1 0 1.698L3.297 6 7.25 9.951a1.2 1.2 0 1 1-1.698 1.697l-4.8-4.8a1.2 1.2 0 0 1 0-1.697l4.8-4.8a1.2 1.2 0 0 1 1.698 0Z"
      fill="#11171D"
    />
  </svg>
);

export default SvgComponent;
