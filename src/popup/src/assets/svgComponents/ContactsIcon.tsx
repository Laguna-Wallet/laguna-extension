import * as React from 'react';
import { SVGProps } from 'react';

const ContactsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={29} height={30} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)">
      <path
        d="M14.5 2.5C7.83 2.5 2.417 8.1 2.417 15S7.83 27.5 14.5 27.5h6.042V25H14.5c-5.244 0-9.667-4.575-9.667-10S9.256 5 14.5 5s9.667 4.575 9.667 10v1.788c0 .987-.858 1.962-1.813 1.962-.954 0-1.812-.975-1.812-1.962V15c0-3.45-2.707-6.25-6.042-6.25S8.458 11.55 8.458 15s2.707 6.25 6.042 6.25c1.668 0 3.19-.7 4.277-1.837a4.426 4.426 0 0 0 3.577 1.837c2.38 0 4.23-2 4.23-4.462V15c0-6.9-5.414-12.5-12.084-12.5zm0 16.25c-2.006 0-3.625-1.675-3.625-3.75s1.62-3.75 3.625-3.75c2.006 0 3.625 1.675 3.625 3.75s-1.62 3.75-3.625 3.75z"
        fill="#323232"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h29v30H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default ContactsIcon;
