import * as React from 'react';

function CloseIcon(props: React.SVGProps<SVGSVGElement> & { stroke?: string }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M1 11L11 1M11 11L1 1"
        stroke={`${props.stroke}`}
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default CloseIcon;
