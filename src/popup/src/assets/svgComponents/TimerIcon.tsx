import { SVGProps } from 'react';

const TimerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={54} height={54} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M27 47.25c9.941 0 18-8.059 18-18s-8.059-18-18-18-18 8.059-18 18 8.059 18 18 18z"
      stroke="#999"
      strokeWidth={4}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M25 29.25a2 2 0 1 0 4 0h-4zm4-9a2 2 0 1 0-4 0h4zm0 9v-9h-4v9h4z" fill="#999" />
    <path
      d="M47.25 13.5 42.75 9M22.5 4.5h9"
      stroke="#999"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default TimerIcon;
