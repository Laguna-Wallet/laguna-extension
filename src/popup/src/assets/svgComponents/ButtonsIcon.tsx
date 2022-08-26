import * as React from "react";

function ButtonsIcon(props: React.SVGProps<SVGSVGElement> & { fill?: string }) {
  return (
    <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M.5 1.6A1.1 1.1 0 011.6.5h5.5a1.1 1.1 0 011.1 1.1v2.2h2.2a1.1 1.1 0 011.1 1.1v5.5a1.1 1.1 0 01-1.1 1.1H4.9a1.1 1.1 0 01-1.1-1.1V8.2H1.6A1.1 1.1 0 01.5 7.1V1.6zm4.4 6.6v2.2h5.5V4.9H8.2v2.2a1.1 1.1 0 01-1.1 1.1H4.9zm2.2-1.1V1.6H1.6v5.5h5.5z"
        fill={props.fill}
      />
    </svg>
  );
}

export default ButtonsIcon;
