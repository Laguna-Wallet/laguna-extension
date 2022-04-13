import * as React from 'react';
import { SVGProps } from 'react';

const SwitchAssetIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M18 9h2m-2 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m2 6a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m-4 0H4m6 0h10"
      stroke="#111827"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SwitchAssetIcon;
