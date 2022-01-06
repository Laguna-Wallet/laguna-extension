import * as React from 'react';
import { SVGProps } from 'react';

const ActiveImportIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={101} height={100} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 20.833c0-9.205 7.462-16.666 16.667-16.666H64.43c4.42 0 8.66 1.755 11.785 4.881l6.903 6.904A16.667 16.667 0 0 1 88 27.737v51.43c0 9.204-7.462 16.666-16.667 16.666H29.667C20.462 95.833 13 88.371 13 79.167V20.832Zm66.667 12.5v45.834a8.333 8.333 0 0 1-8.334 8.333H29.667a8.333 8.333 0 0 1-8.334-8.334V20.834a8.333 8.333 0 0 1 8.334-8.333h29.166v8.333c0 6.904 5.597 12.5 12.5 12.5h8.334ZM79.204 25a8.333 8.333 0 0 0-1.978-3.156l-6.904-6.903a8.333 8.333 0 0 0-3.155-1.979v7.871A4.167 4.167 0 0 0 71.333 25h7.871Z"
      fill="url(#a)"
    />
    <path
      d="M48.905 37.816a4.153 4.153 0 0 0-1.351.904l-12.5 12.5a4.167 4.167 0 1 0 5.892 5.893l5.387-5.387v19.107a4.167 4.167 0 0 0 8.334 0V51.726l5.387 5.387a4.167 4.167 0 0 0 5.892-5.893l-12.5-12.5a4.168 4.168 0 0 0-4.54-.904Z"
      fill="url(#b)"
    />
    <defs>
      <linearGradient
        id="a"
        x1={110.897}
        y1={-46.759}
        x2={1.41}
        y2={-40.042}
        gradientUnits="userSpaceOnUse">
        <stop stopColor="#1CC3CE" />
        <stop offset={1} stopColor="#B9E260" />
      </linearGradient>
      <linearGradient
        id="b"
        x1={77.343}
        y1={16.667}
        x2={28.715}
        y2={19.908}
        gradientUnits="userSpaceOnUse">
        <stop stopColor="#1CC3CE" />
        <stop offset={1} stopColor="#B9E260" />
      </linearGradient>
    </defs>
  </svg>
);

export default ActiveImportIcon;
