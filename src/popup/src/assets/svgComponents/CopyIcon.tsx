import { SVGProps } from "react";

const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M0 1.8C0 1.08203 0.58203 0.5 1.3 0.5H7.8C8.51797 0.5 9.1 1.08203 9.1 1.8V4.4H11.7C12.418 4.4 13 4.98203 13 5.7V12.2C13 12.918 12.418 13.5 11.7 13.5H5.2C4.48203 13.5 3.9 12.918 3.9 12.2V9.6H1.3C0.582029 9.6 0 9.01797 0 8.3V1.8ZM5.2 9.6V12.2H11.7V5.7H9.1V8.3C9.1 9.01797 8.51797 9.6 7.8 9.6H5.2ZM7.8 8.3V1.8L1.3 1.8V8.3H7.8Z"
      fill={props.fill || "white"}
    />
  </svg>
);

export default CopyIcon;
