import * as React from 'react';
import { SVGProps } from 'react';

const AddressBookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={55} height={55} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M20.625 45.833V9.166m25.208 34.375V11.458a2.292 2.292 0 0 0-2.291-2.292H11.458a2.292 2.292 0 0 0-2.291 2.292V43.54a2.292 2.292 0 0 0 2.291 2.292h32.084a2.292 2.292 0 0 0 2.291-2.292z"
      stroke={props.stroke || '#999'}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AddressBookIcon;
