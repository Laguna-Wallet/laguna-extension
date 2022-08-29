import * as React from "react";
import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg width={12} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M4.4 19.8H3.3l1.1-7.7H.55c-.638 0-.627-.352-.418-.726.209-.374.055-.088.077-.132C1.628 8.734 3.762 4.994 6.599 0h1.1L6.6 7.7h3.85c.54 0 .617.363.518.561l-.077.165C6.556 16.006 4.4 19.8 4.4 19.8Z"
      fill="url(#a)"
    />
    <defs>
      <linearGradient
        id="a"
        x1={14.362}
        y1={-11}
        x2={-1.729}
        y2={-10.33}
        gradientUnits="userSpaceOnUse">
        <stop stopColor="#1CC3CE" />
        <stop offset={1} stopColor="#B9E260" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgComponent;
