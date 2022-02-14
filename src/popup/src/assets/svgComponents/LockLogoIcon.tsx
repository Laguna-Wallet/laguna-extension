import * as React from 'react';
import { SVGProps } from 'react';

const LockLogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={56} height={56} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M28 9.333c3.845 0 7 3.155 7 7v7H21v-7c0-3.845 3.155-7 7-7zm11.667 14v-7C39.667 9.91 34.422 4.666 28 4.666S16.333 9.911 16.333 16.333v7H14a4.667 4.667 0 0 0-4.667 4.666v18.667A4.667 4.667 0 0 0 14 51.333h28a4.667 4.667 0 0 0 4.667-4.667V27.999A4.667 4.667 0 0 0 42 23.333h-2.333zM14 27.999h28v18.667H14V27.999z"
      fill="#999"
    />
  </svg>
);

export default LockLogoIcon;
