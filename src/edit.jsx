import * as React from "react"

function SvgComponent(props) {
  return (
    <svg width={14} height={14} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M13.479 2.872L11.08.474a1.75 1.75 0 00-2.327-.06L.879 8.287a1.75 1.75 0 00-.5 1.06l-.375 3.648a.875.875 0 00.875.954h.078l3.65-.333a1.75 1.75 0 001.058-.499l7.875-7.875a1.68 1.68 0 00-.061-2.371zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706z"
        fill="currentColor"
      />
    </svg>
  )
}

export default SvgComponent
