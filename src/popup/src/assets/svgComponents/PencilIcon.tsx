import * as React from "react";
import { SVGProps } from "react";

const PencilIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 14"
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
  xmlSpace="preserve"
  {...props}>
    <path
      d="M9.504 1.839a.583.583 0 0 1 .825 0l2.333 2.333a.583.583 0 0 1 0 .825L5.08 12.58a.583.583 0 0 1-.412.171H2.333a.583.583 0 0 1-.583-.583V9.835c0-.155.061-.303.17-.413L7.755 3.59l1.75-1.75zM8.167 4.826l-5.25 5.25v1.509h1.508l5.25-5.25-1.508-1.509zm2.333.684.925-.925-1.508-1.509-.925.925L10.5 5.51z"
      // fill="#777E91"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
      }}
    />
  </svg>
);

export default PencilIcon;
