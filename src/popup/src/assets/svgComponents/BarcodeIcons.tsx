import { SVGProps } from 'react';

const BarcodeIcons = (props: SVGProps<SVGSVGElement>) => (
  <svg width={25} height={25} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M6.733 11.833h5.333V6.5H6.733v5.333zm1.333-4h2.667V10.5H8.066V7.833zM6.733 18.5h5.333v-5.334H6.733V18.5zm1.333-4h2.667v2.666H8.066V14.5zm5.334-8v5.333h5.333V6.5H13.4zm4 4h-2.667V7.833H17.4V10.5zm1.333 6.666H17.4V18.5h1.333v-1.334zm-4-4H13.4V14.5h1.333v-1.334zm1.334 1.334h-1.334v1.333h1.334V14.5zm-1.334 1.334H13.4v1.333h1.333v-1.334zm1.334 1.332h-1.334V18.5h1.334v-1.334z"
      fill="#18191A"
    />
    <path
      d="M17.4 15.834h-1.334v1.333H17.4v-1.334zm0-2.668h-1.334V14.5H17.4v-1.334zm1.333 1.334H17.4v1.333h1.333V14.5z"
      fill="#18191A"
    />
  </svg>
);

export default BarcodeIcons;
