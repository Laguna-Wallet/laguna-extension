import { SVGProps } from 'react';

const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m19 19-6-6m2-5A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
      stroke="#11171D"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SearchIcon;
