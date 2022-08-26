import * as React from "react";

function CheckMarkIcon(props: React.SVGProps<SVGSVGElement> | { fill: string }) {
  return (
    <svg
      width="94"
      height="94"
      viewBox="0 0 94 94"
      fill={props.fill || "none"}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M77.165 24.387a3.531 3.531 0 0 1 .289 4.956L40.318 71.472a3.469 3.469 0 0 1-2.602 1.178 3.469 3.469 0 0 1-2.602-1.178L16.546 50.408a3.531 3.531 0 0 1 .29-4.957 3.461 3.461 0 0 1 4.914.292l15.966 18.112L72.25 24.678a3.461 3.461 0 0 1 4.915-.291z"
        fill={props.fill || "#18191A"}
      />
    </svg>
  );
}

export default CheckMarkIcon;
