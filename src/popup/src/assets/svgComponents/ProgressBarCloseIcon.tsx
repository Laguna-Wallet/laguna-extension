import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M12 10.667 16.667 6 18 7.333 13.333 12 18 16.667 16.667 18 12 13.333 7.333 18 6 16.667 10.667 12 6 7.333 7.333 6 12 10.667z"
      fill="#777E91"
    />
  </svg>
);

export default SvgComponent;
