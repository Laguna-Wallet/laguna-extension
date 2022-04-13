import { SVGProps } from 'react';

const HashtagIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m7 20 4-16m2 16 4-16M6 9h14M4 15h14"
      stroke="#111827"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HashtagIcon;
