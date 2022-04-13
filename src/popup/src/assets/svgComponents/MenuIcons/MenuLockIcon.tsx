import { SVGProps } from 'react';

const MenuLockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={13} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M6.6 1.525a2.296 2.296 0 0 1 2.287 2.288V6.1H4.312V3.813A2.296 2.296 0 0 1 6.6 1.525ZM10.413 6.1V3.813A3.821 3.821 0 0 0 6.6 0a3.821 3.821 0 0 0-3.812 3.813V6.1h-.763C1.183 6.1.5 6.783.5 7.625v6.1c0 .842.683 1.525 1.525 1.525h9.15c.842 0 1.525-.683 1.525-1.525v-6.1c0-.842-.683-1.525-1.525-1.525h-.763ZM2.024 7.625h9.15v6.1h-9.15v-6.1Z"
      fill="#fff"
    />
  </svg>
);

export default MenuLockIcon;
