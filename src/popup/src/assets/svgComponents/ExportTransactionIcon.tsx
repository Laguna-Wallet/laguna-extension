import * as React from 'react';
import { SVGProps } from 'react';

const ExportTransactionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={15} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M7.058 1.933a.625.625 0 0 1 .884 0l2.5 2.5a.625.625 0 1 1-.884.884L8.125 3.884V10.5a.625.625 0 1 1-1.25 0V3.884L5.442 5.317a.625.625 0 1 1-.884-.884l2.5-2.5zm-3.933 9.192c.345 0 .625.28.625.625V13h7.5v-1.25a.625.625 0 1 1 1.25 0V13c0 .69-.56 1.25-1.25 1.25h-7.5c-.69 0-1.25-.56-1.25-1.25v-1.25c0-.345.28-.625.625-.625z"
      fill="#fff"
    />
  </svg>
);

export default ExportTransactionIcon;
