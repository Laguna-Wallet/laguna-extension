import * as React from 'react';
import { SVGProps } from 'react';

const KusamaIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={36} height={37} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={18} cy={18.5} r={18} fill="#000" />
    <path
      d="M27.656 12.302c-.346-.292-.759-.69-1.511-.79-.706-.099-1.424.406-1.91.74-.486.334-1.404 1.314-1.784 1.613-.379.298-1.35.576-2.915 1.578-1.564 1.002-7.7 5.208-7.7 5.208l1.598.022-7.121 3.915h.712L6 25.42s.905.256 1.664-.256v.234s8.478-3.567 10.116-2.643l-.999.313c.087 0 1.697.113 1.697.113.04.357.151.699.329 1.004.177.304.415.563.696.759.972.682.992 1.059.992 1.059s-.506.22-.506.497c0 0 .745-.242 1.438-.22.439.017.875.091 1.297.22 0 0-.053-.299-.725-.497-.672-.2-1.338-.981-1.664-1.407a2.06 2.06 0 0 1-.378-.936 2.116 2.116 0 0 1 .105-1.012c.233-.646 1.045-1.002 2.722-1.925 1.977-1.095 2.43-1.905 2.709-2.537.28-.633.692-1.89.925-2.48.293-.76.652-1.166.951-1.408.3-.241 1.631-.774 1.631-.774s-1.018-.945-1.344-1.222z"
      fill="#fff"
    />
  </svg>
);

export default KusamaIcon;