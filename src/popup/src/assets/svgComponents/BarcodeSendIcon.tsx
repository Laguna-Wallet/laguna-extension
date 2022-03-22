import { SVGProps } from 'react';

const BarcodeSendIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M21 8V5a2 2 0 0 0-2-2h-3M8 3H5a2 2 0 0 0-2 2v3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3M3 12h18"
      stroke="#11171D"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BarcodeSendIcon;
