import * as React from 'react';
import { SVGProps } from 'react';

const BarcodeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={30} height={30} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M3.75 13.75h10v-10h-10v10Zm2.5-7.5h5v5h-5v-5ZM3.75 26.25h10v-10h-10v10Zm2.5-7.5h5v5h-5v-5ZM16.25 3.75v10h10v-10h-10Zm7.5 7.5h-5v-5h5v5ZM26.25 23.75h-2.5v2.5h2.5v-2.5ZM18.75 16.25h-2.5v2.5h2.5v-2.5ZM21.25 18.75h-2.5v2.5h2.5v-2.5ZM18.75 21.25h-2.5v2.5h2.5v-2.5ZM21.25 23.75h-2.5v2.5h2.5v-2.5ZM23.75 21.25h-2.5v2.5h2.5v-2.5ZM23.75 16.25h-2.5v2.5h2.5v-2.5ZM26.25 18.75h-2.5v2.5h2.5v-2.5Z"
      fill="#000"
    />
  </svg>
);

export default BarcodeIcon;
