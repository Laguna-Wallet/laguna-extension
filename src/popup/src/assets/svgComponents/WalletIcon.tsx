import { SVGProps } from "react";

const WalletIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
  <path d="M20.7439 16.4062C20.4851 16.4075 20.2764 16.6175 20.2764 16.8762C20.2764 17.135 20.4864 17.345 20.7451 17.3437C21.0039 17.3437 21.2139 17.1337 21.2139 16.875C21.2139 16.6162 21.0039 16.4062 20.7439 16.4062" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    stroke={props.stroke}
    />
  <path d="M3.75 6.25V23.125C3.75 24.5063 4.86875 25.625 6.25 25.625H23.75C25.1313 25.625 26.25 24.5063 26.25 23.125V10.625C26.25 9.24375 25.1313 8.125 23.75 8.125H5.625C4.59 8.125 3.75 7.285 3.75 6.25V6.25C3.75 5.215 4.59 4.375 5.625 4.375H21.25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    stroke={props.stroke}
    />
  </svg>
);

export default WalletIcon;
