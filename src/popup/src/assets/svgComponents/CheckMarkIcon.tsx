import * as React from "react"

function CheckMarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={51} height={40} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M50.049.722a2.874 2.874 0 01.235 4.033L20.062 39.041a2.823 2.823 0 01-2.117.959c-.81 0-1.58-.349-2.118-.959L.716 21.898a2.874 2.874 0 01.235-4.033 2.817 2.817 0 014 .237L15.536 30.11a3.21 3.21 0 004.817 0L46.049.959a2.817 2.817 0 014-.237z"
        fill="url(#prefix__paint0_linear_4185_21151)"
      />
      <defs>
        <linearGradient id="prefix__paint0_linear_4185_21151" x1={66.57} y1={-22.222} x2={-7.485} y2={-15.142} gradientUnits="userSpaceOnUse">
          <stop stopColor="#1CC3CE" />
          <stop offset={1} stopColor="#B9E260" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default CheckMarkIcon
