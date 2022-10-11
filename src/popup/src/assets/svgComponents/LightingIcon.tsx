import { SVGProps } from "react";

const LightingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M11.4 22.8h-1.1l1.1-7.7H7.55c-.638 0-.627-.352-.418-.726.209-.374.055-.088.077-.132C8.628 11.734 10.762 7.994 13.599 3h1.1l-1.1 7.7h3.851c.539 0 .616.363.517.561l-.077.165A5276.85 5276.85 0 0 0 11.4 22.8z"
      fill={props.fill || "#B1B5C4"}
    />
  </svg>
);

export default LightingIcon;
