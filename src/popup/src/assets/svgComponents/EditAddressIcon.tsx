import { SVGProps } from 'react';

const EditAddressIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={45} height={45} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M30.55 4.3a1.875 1.875 0 0 1 2.65 0l7.5 7.5a1.872 1.872 0 0 1 0 2.65L16.327 38.827a1.875 1.875 0 0 1-1.326.549H7.5A1.875 1.875 0 0 1 5.625 37.5V30c0-.497.198-.974.55-1.326l18.749-18.75L30.549 4.3zm-4.3 9.602L9.375 30.777v4.848h4.848L31.098 18.75l-4.848-4.848zm7.5 2.196 2.973-2.973-4.848-4.848-2.973 2.973 4.848 4.848z"
      fill={props.fill || '#999'}
    />
  </svg>
);

export default EditAddressIcon;
