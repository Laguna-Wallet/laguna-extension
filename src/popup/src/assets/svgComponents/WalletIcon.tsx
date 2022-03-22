import { SVGProps } from 'react';

const WalletIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M16.595 13.125a.376.376 0 0 0 0 .75.375.375 0 1 0 0-.75"
      stroke={props.stroke}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 5v13.5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2H4.5A1.5 1.5 0 0 1 3 5v0a1.5 1.5 0 0 1 1.5-1.5H17"
      stroke={props.stroke}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default WalletIcon;
