import { SVGProps } from "react";

const EthereumIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={32} height={32} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)">
      <path
        d="M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16Z"
        fill="#627EEA"
      />
      <path d="M16.086 6.957v6.686l5.651 2.525-5.65-9.211Z" fill="#fff" fillOpacity={0.602} />
      <path d="m16.086 6.957-5.651 9.211 5.651-2.525V6.957Z" fill="#fff" />
      <path d="M16.086 20.501v4.543l5.655-7.823-5.655 3.28Z" fill="#fff" fillOpacity={0.602} />
      <path d="M16.086 25.044V20.5l-5.651-3.28 5.651 7.824Z" fill="#fff" />
      <path d="m16.086 19.45 5.651-3.282-5.65-2.523v5.804Z" fill="#fff" fillOpacity={0.2} />
      <path d="m10.435 16.168 5.651 3.281v-5.805l-5.651 2.524Z" fill="#fff" fillOpacity={0.602} />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default EthereumIcon;
