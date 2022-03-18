import { SVGProps } from 'react';

const UploadFinishedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={51} height={40} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M50.049.722a2.874 2.874 0 0 1 .235 4.033L20.062 39.041a2.823 2.823 0 0 1-2.117.959c-.81 0-1.58-.349-2.118-.959L.716 21.898a2.874 2.874 0 0 1 .235-4.033 2.817 2.817 0 0 1 4 .237L15.536 30.11a3.21 3.21 0 0 0 4.817 0L46.049.959a2.817 2.817 0 0 1 4-.237Z"
      fill="url(#a)"
    />
    <defs>
      <linearGradient
        id="a"
        x1={66.57}
        y1={-22.222}
        x2={-7.485}
        y2={-15.142}
        gradientUnits="userSpaceOnUse">
        <stop stopColor="#d7cce2" />
        <stop offset={1} stopColor="#f5decc" />
      </linearGradient>
    </defs>
  </svg>
);

export default UploadFinishedIcon;
