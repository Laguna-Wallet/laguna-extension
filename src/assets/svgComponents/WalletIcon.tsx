import * as React from 'react';
import { SVGProps } from 'react';

const WalletIcon = (props: SVGProps<SVGSVGElement> & { stroke?: string }) => (
  <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1 3v13.5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2H2.5A1.5 1.5 0 0 1 1 3v0a1.5 1.5 0 0 1 1.5-1.5H15"
      stroke={props.stroke || '#fff'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default WalletIcon;
