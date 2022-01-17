import { SVGProps } from 'react';

const ExchangeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M3.67 2.504a.583.583 0 0 1 .826 0l2.333 2.333a.583.583 0 0 1-.825.825L4.667 4.325v6.758a.583.583 0 1 1-1.167 0V4.325L2.163 5.662a.583.583 0 1 1-.825-.825L3.67 2.504zm5.663 7.17V2.917a.583.583 0 0 1 1.167 0v6.759l1.338-1.338a.583.583 0 0 1 .825.825l-2.334 2.333a.583.583 0 0 1-.825 0L7.171 9.162a.583.583 0 1 1 .825-.825l1.337 1.338z"
      fill="#0D0D0D"
    />
  </svg>
);

export default ExchangeIcon;
