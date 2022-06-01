import * as React from 'react';

const RightBigArrowIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M1.027 8.813h11.47l-5.012 5.01c-.4.401-.4 1.058 0 1.459a1.022 1.022 0 0 0 1.448 0L15.7 8.515c.4-.4.4-1.047 0-1.448L8.933.301a1.023 1.023 0 1 0-1.448 1.448l5.011 5.01H1.026A1.03 1.03 0 0 0 0 7.786a1.03 1.03 0 0 0 1.027 1.027z"
        fill="#18191A"
      />
    </svg>
  );
};

export default RightBigArrowIcon;
