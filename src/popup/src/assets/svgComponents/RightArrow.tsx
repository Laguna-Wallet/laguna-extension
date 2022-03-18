import * as React from 'react';

function RightArrow(props: React.SVGProps<SVGSVGElement> | { stroke: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="prefix__h-6 prefix__w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke={props.stroke || 'currentColor'}
      {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );
}

export default RightArrow;
