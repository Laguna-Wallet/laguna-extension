import { SVGProps } from "react";

const AddBigIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={94}
    height={94}
    viewBox="0 0 94 94"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M49.7548 43.7224L70.8748 43.7224L70.8747 49.7555L49.7548 49.7555V70.8754H43.7218V49.7555L22.6018 49.7555L22.6018 43.7224L43.7218 43.7224L43.7218 22.6025H49.7548L49.7548 43.7224Z"
      fill={props.fill || "white"}
    />
  </svg>
);

export default AddBigIcon;
