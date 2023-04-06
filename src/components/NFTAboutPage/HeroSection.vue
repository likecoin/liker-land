<!-- eslint-disable vue/max-attributes-per-line -->
<template>
  <section class="nft-hero-graph" style="opacity: 0">
    <svg
      class="max-w-[960px] w-full mx-auto"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 960 512"
    >
      <filter id="nft-hero-graph-blur">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <defs>
        <clipPath id="nft-hero-stroke-clip">
          <rect width="960" height="512" />
        </clipPath>
        <clipPath id="nft-hero-graph__circle-clip">
          <ellipse cx="565.2" cy="272" rx="109.5" ry="109" fill="none" />
        </clipPath>
        <radialGradient
          id="nft-hero-graph__circle-gradient-1"
          cx="-277.43"
          cy="198.48"
          fx="-277.43"
          fy="198.48"
          r="1"
          gradientTransform="translate(-14961.69 -145349.93) rotate(-44.8) scale(328.65 575.71) skewX(-.5)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".35" stop-color="#8af5e9" />
          <stop offset="1" stop-color="#33d875" stop-opacity="0" />
        </radialGradient>
        <radialGradient
          id="nft-hero-graph__circle-gradient-2"
          cx="-278.75"
          cy="195.17"
          fx="-278.75"
          fy="195.17"
          r="1"
          gradientTransform="translate(-5546.28 125830.06) rotate(138.37) scale(314.48 460.23) skewX(-.42)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#f1ff9a" />
          <stop offset=".87" stop-color="#71a988" stop-opacity=".24" />
        </radialGradient>
        <radialGradient
          id="nft-hero-graph__circle-gradient-3"
          cx="-273.14"
          cy="199.07"
          fx="-273.14"
          fy="199.07"
          r="1"
          gradientTransform="translate(44673.08 -40672.97) rotate(2.41) scale(154.95 214.92) skewX(.03)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".22" stop-color="#a5f0e7" />
          <stop offset="1" stop-color="#f7c7c7" stop-opacity="0" />
        </radialGradient>
        <clipPath id="nft-hero-graph__rect-clip">
          <rect
            x="706.7"
            y="174"
            width="200"
            height="199"
            rx="16"
            ry="16"
            fill="none"
          />
        </clipPath>
        <radialGradient
          id="nft-hero-graph__rect-gradient-1"
          cx="-276.9"
          cy="198.78"
          fx="-276.9"
          fy="198.78"
          r="1"
          gradientTransform="translate(-14961.69 -145349.93) rotate(-44.8) scale(328.65 575.71) skewX(-.5)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".35" stop-color="#8af5e9" />
          <stop offset="1" stop-color="#33d875" stop-opacity="0" />
        </radialGradient>
        <radialGradient
          id="nft-hero-graph__rect-gradient-2"
          cx="-279.33"
          cy="194.82"
          fx="-279.33"
          fy="194.82"
          r="1"
          gradientTransform="translate(-5546.28 125830.06) rotate(138.37) scale(314.48 460.23) skewX(-.42)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#f1ff9a" />
          <stop offset=".87" stop-color="#71a988" stop-opacity=".24" />
        </radialGradient>
        <radialGradient
          id="nft-hero-graph__rect-gradient-3"
          cx="-271.59"
          cy="199.03"
          fx="-271.59"
          fy="199.03"
          r="1"
          gradientTransform="translate(44673.08 -40672.97) rotate(2.41) scale(154.95 214.92) skewX(.03)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".22" stop-color="#a5f0e7" />
          <stop offset="1" stop-color="#f7c7c7" stop-opacity="0" />
        </radialGradient>
        <radialGradient
          id="nft-hero-e"
          cx="-1240.77"
          cy="-867.03"
          fx="-1240.77"
          fy="-867.03"
          r="1"
          gradientTransform="translate(-54385.62 -581507.97) rotate(-44.66) scale(298.03 -522.05)"
          xlink:href="#nft-hero-graph__circle-gradient-2"
        />
        <radialGradient
          id="nft-hero-f"
          cx="-1239.67"
          cy="-858.2"
          fx="-1239.67"
          fy="-858.2"
          r="1"
          gradientTransform="translate(-26853.86 502655.27) rotate(138.52) scale(285.26 -417.22)"
          xlink:href="#nft-hero-graph__circle-gradient-3"
        />
        <radialGradient
          id="nft-hero-g"
          cx="-1230.49"
          cy="-871.09"
          fx="-1230.49"
          fy="-871.09"
          r="1"
          gradientTransform="translate(181110.52 -161646.56) rotate(2.4) scale(140.86 -194.4)"
          xlink:href="#nft-hero-graph__circle-gradient-4"
        />
        <radialGradient
          id="nft-hero-h"
          cx="-1239.13"
          cy="-865.31"
          fx="-1239.13"
          fy="-865.31"
          r="1"
          gradientTransform="translate(764111.66 -947900.62) rotate(-16.65) scale(809.94 -797.1)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".5" stop-color="#8af5e9" />
          <stop offset="1" stop-color="#33d875" stop-opacity="0" />
        </radialGradient>
        <radialGradient
          id="nft-hero-i"
          cx="-1240.44"
          cy="-860.26"
          fx="-1240.44"
          fy="-860.26"
          r="1"
          gradientTransform="translate(-549324.6 969380.24) rotate(149.96) scale(775.1 -655.24)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#f1ff9a" />
          <stop offset=".73" stop-color="#71a988" stop-opacity=".24" />
        </radialGradient>
        <radialGradient
          id="nft-hero-j"
          cx="-1241.97"
          cy="-854.62"
          fx="-1241.97"
          fy="-854.62"
          r="1"
          gradientTransform="translate(-419484.4 302574.18) rotate(164.01) scale(392.16 -204.66)"
          xlink:href="#nft-hero-graph__circle-gradient-4"
        />
        <radialGradient
          id="nft-hero-k"
          cx="-1240.49"
          cy="-865.97"
          fx="-1240.49"
          fy="-865.97"
          r="1"
          gradientTransform="translate(-69239.69 -735538.03) rotate(-44.69) scale(377.21 -660.75)"
          xlink:href="#nft-hero-graph__circle-gradient-2"
        />
        <radialGradient
          id="nft-hero-l"
          cx="-1239.86"
          cy="-859.53"
          fx="-1239.86"
          fy="-859.53"
          r="1"
          gradientTransform="translate(-33628.81 636634.72) rotate(138.49) scale(361.02 -528.09)"
          xlink:href="#nft-hero-graph__circle-gradient-3"
        />
        <radialGradient
          id="nft-hero-m"
          cx="-1232.93"
          cy="-868.85"
          fx="-1232.93"
          fy="-868.85"
          r="1"
          gradientTransform="translate(229107.94 -204274.91) rotate(2.4) scale(178.19 -246.18)"
          xlink:href="#nft-hero-graph__circle-gradient-4"
        />
        <radialGradient
          id="nft-hero-n"
          cx="-1241.56"
          cy="-872.79"
          fx="-1241.56"
          fy="-872.79"
          r="1"
          gradientTransform="translate(-21124.55 -218006.25) rotate(-44.67) scale(111.41 -195.15)"
          xlink:href="#nft-hero-graph__circle-gradient-2"
        />
        <radialGradient
          id="nft-hero-o"
          cx="-1239.43"
          cy="-850.97"
          fx="-1239.43"
          fy="-850.97"
          r="1"
          gradientTransform="translate(-10739.71 187273.01) rotate(138.5) scale(106.63 -155.97)"
          xlink:href="#nft-hero-graph__circle-gradient-3"
        />
        <radialGradient
          id="nft-hero-p"
          cx="-1215.97"
          cy="-882.52"
          fx="-1215.97"
          fy="-882.52"
          r="1"
          gradientTransform="translate(66944.09 -61070.79) rotate(2.4) scale(52.65 -72.69)"
          xlink:href="#nft-hero-graph__circle-gradient-4"
        />
        <radialGradient
          id="nft-hero-q"
          cx="-1240.95"
          cy="-869.01"
          fx="-1240.95"
          fy="-869.01"
          r="1"
          gradientTransform="translate(-32897.28 -357390.03) rotate(-44.57) scale(183.01 -320.55)"
          xlink:href="#nft-hero-graph__circle-gradient-2"
        />
        <radialGradient
          id="nft-hero-r"
          cx="-1239.68"
          cy="-855.72"
          fx="-1239.68"
          fy="-855.72"
          r="1"
          gradientTransform="translate(-17101.84 308341.34) rotate(138.6) scale(175.19 -256.13)"
          xlink:href="#nft-hero-graph__circle-gradient-3"
        />
        <radialGradient
          id="nft-hero-s"
          cx="-1225.42"
          cy="-874.95"
          fx="-1225.42"
          fy="-874.95"
          r="1"
          gradientTransform="translate(111284.78 -99376.54) rotate(2.39) scale(86.63 -119.18)"
          xlink:href="#nft-hero-graph__circle-gradient-4"
        />
        <radialGradient
          id="nft-hero-t"
          cx="-1243.03"
          cy="-885.36"
          fx="-1243.03"
          fy="-885.36"
          r="1"
          gradientTransform="translate(-7940.71 -95900.11) rotate(-43.92) scale(48.56 -85.01)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".36" stop-color="#2ec0af" />
          <stop offset="1" stop-color="#33d875" stop-opacity="0" />
        </radialGradient>
        <radialGradient
          id="nft-hero-u"
          cx="-1239.17"
          cy="-835.17"
          fx="-1239.17"
          fy="-835.17"
          r="1"
          gradientTransform="translate(-5893.43 80726.09) rotate(139.25) scale(46.55 -67.84)"
          xlink:href="#nft-hero-graph__circle-gradient-3"
        />
        <radialGradient
          id="nft-hero-v"
          cx="-1185.59"
          cy="-908.29"
          fx="-1185.59"
          fy="-908.29"
          r="1"
          gradientTransform="translate(29496.57 -27075.95) rotate(2.34) scale(23.24 -31.26)"
          xlink:href="#nft-hero-graph__circle-gradient-4"
        />
        <radialGradient
          id="nft-hero-graph__circle-gradient-1"
          cx="-1074.62"
          cy="799.95"
          fx="-1074.62"
          fy="799.95"
          r="1"
          gradientTransform="translate(235368.94 52612.4) rotate(-8.69) scale(209.1 -109.37)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".36" stop-color="#8af5e9" />
          <stop offset="1" stop-color="#33d875" stop-opacity="0" />
        </radialGradient>
        <radialGradient
          id="nft-hero-graph__circle-gradient-2"
          cx="-1085.11"
          cy="801.78"
          fx="-1085.11"
          fy="801.78"
          r="1"
          gradientTransform="translate(-232315.17 33802.82) rotate(157.14) scale(209.58 -73.8)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#deff15" />
          <stop offset=".73" stop-color="#71a988" stop-opacity=".24" />
        </radialGradient>
        <radialGradient
          id="nft-hero-graph__circle-gradient-3"
          cx="-1069.78"
          cy="809.27"
          fx="-1069.78"
          fy="809.27"
          r="1"
          gradientTransform="translate(99405.85 54175.53) rotate(10.41) scale(100.46 -43.63)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".22" stop-color="#a5f0e7" />
          <stop offset="1" stop-color="#f7c7c7" stop-opacity="0" />
        </radialGradient>
        <radialGradient
          id="nft-hero-graph__circle-gradient-4"
          cx="-1075.04"
          cy="801.27"
          fx="-1075.04"
          fy="801.27"
          r="1"
          gradientTransform="translate(101743.74 296548.9) rotate(21.37) scale(188.44 -298.45)"
          xlink:href="#nft-hero-graph__circle-gradient-1"
        />
      </defs>
      <g filter="url(#nft-hero-graph-blur)">
        <g>
          <g
            class="nft-hero-graph__slide-1-circle nft-hero-graph__element"
            clip-path="url(#nft-hero-graph__circle-clip"
          >
            <rect x="455.2" y="162" width="220" height="220" fill="#fff" />
            <rect
              x="455.2"
              y="162"
              width="220"
              height="220"
              fill="url(#nft-hero-graph__circle-gradient-1)"
            />
            <rect
              x="455.2"
              y="162"
              width="220"
              height="220"
              fill="url(#nft-hero-graph__circle-gradient-2)"
            />
            <rect
              x="455.2"
              y="162"
              width="220"
              height="220"
              fill="url(#nft-hero-graph__circle-gradient-3)"
              fill-opacity=".3"
            />
          </g>
          <g
            class="nft-hero-graph__slide-1-square nft-hero-graph__element"
            clip-path="url(#nft-hero-graph__rect-clip)"
          >
            <rect x="696.7" y="162" width="220" height="220" fill="#fff" />
            <rect
              x="696.7"
              y="162"
              width="220"
              height="220"
              fill="url(#nft-hero-graph__rect-gradient-1)"
            />
            <rect
              x="696.7"
              y="162"
              width="220"
              height="220"
              fill="url(#nft-hero-graph__rect-gradient-2)"
            />
            <rect
              x="696.7"
              y="162"
              width="220"
              height="220"
              fill="url(#nft-hero-graph__rect-gradient-3)"
              fill-opacity=".3"
            />
          </g>
        </g>
        <g clip-path="url(#nft-hero-stroke-clip)">
          <path
            d="M864.73,378.53c-84.1-28.49-71.78-114.04-59.27-165.86,6.27-26-11.73-38.89-11.73-60.89s-83.78,176.1-135.79,189.69c-52.01,13.59-40.52-29.3-121.35-17.29-58.2,8.65-85.09,35.2-132.49,48.17-47.41,12.97-79.25,9.88-92.87-30.88-13.62-40.76-70.49,30.88-210.49,16.31"
            fill="none"
            stroke="#fff"
            stroke-linecap="round"
            stroke-width="32"
          />
          <path
            d="M864.73,378.53c-84.1-28.49-71.78-114.04-59.27-165.86,6.27-26-11.73-38.89-11.73-60.89s-83.78,176.1-135.79,189.69c-52.01,13.59-40.52-29.3-121.35-17.29-58.2,8.65-85.09,35.2-132.49,48.17-47.41,12.97-79.25,9.88-92.87-30.88-13.62-40.76-70.49,30.88-210.49,16.31"
            fill="none"
            stroke="url(#nft-hero-h)"
            stroke-linecap="round"
            stroke-width="32"
          />
          <path
            d="M864.73,378.53c-84.1-28.49-71.78-114.04-59.27-165.86,6.27-26-11.73-38.89-11.73-60.89s-83.78,176.1-135.79,189.69c-52.01,13.59-40.52-29.3-121.35-17.29-58.2,8.65-85.09,35.2-132.49,48.17-47.41,12.97-79.25,9.88-92.87-30.88-13.62-40.76-70.49,30.88-210.49,16.31"
            fill="none"
            stroke="url(#nft-hero-i)"
            stroke-linecap="round"
            stroke-width="32"
          />
          <path
            d="M864.73,378.53c-84.1-28.49-71.78-114.04-59.27-165.86,6.27-26-11.73-38.89-11.73-60.89s-83.78,176.1-135.79,189.69c-52.01,13.59-40.52-29.3-121.35-17.29-58.2,8.65-85.09,35.2-132.49,48.17-47.41,12.97-79.25,9.88-92.87-30.88-13.62-40.76-70.49,30.88-210.49,16.31"
            fill="none"
            stroke="url(#nft-hero-j)"
            stroke-linecap="round"
            stroke-opacity=".3"
            stroke-width="32"
          />
        </g>
        <g class="nft-hero-graph__system">
          <g class="nft-hero-graph__moon-3 nft-hero-graph__element">
            <ellipse cx="800.23" cy="168.13" rx="16.5" ry="16" fill="#fff" />
            <ellipse
              cx="800.23"
              cy="168.13"
              rx="16.5"
              ry="16"
              fill="url(#nft-hero-t)"
            />
            <ellipse
              cx="800.23"
              cy="168.13"
              rx="16.5"
              ry="16"
              fill="url(#nft-hero-u)"
            />
            <ellipse
              cx="800.23"
              cy="168.13"
              rx="16.5"
              ry="16"
              fill="url(#nft-hero-v)"
              fill-opacity=".3"
            />
          </g>
          <g class="nft-hero-graph__planet nft-hero-graph__element">
            <ellipse cx="593.23" cy="198.13" rx="126.5" ry="126" fill="#fff" />
            <ellipse
              cx="593.23"
              cy="198.13"
              rx="126.5"
              ry="126"
              fill="url(#nft-hero-k)"
            />
            <ellipse
              cx="593.23"
              cy="198.13"
              rx="126.5"
              ry="126"
              fill="url(#nft-hero-l)"
            />
            <ellipse
              cx="593.23"
              cy="198.13"
              rx="126.5"
              ry="126"
              fill="url(#nft-hero-m)"
              fill-opacity=".3"
            />
          </g>
          <g class="nft-hero-graph__moon-1 nft-hero-graph__element">
            <ellipse cx="284.11" cy="333.33" rx="37.37" ry="37.2" fill="#fff" />
            <ellipse
              cx="284.11"
              cy="333.33"
              rx="37.37"
              ry="37.2"
              fill="url(#nft-hero-n)"
            />
            <ellipse
              cx="284.11"
              cy="333.33"
              rx="37.37"
              ry="37.2"
              fill="url(#nft-hero-o)"
            />
            <ellipse
              cx="284.11"
              cy="333.33"
              rx="37.37"
              ry="37.2"
              fill="url(#nft-hero-p)"
              fill-opacity=".3"
            />
          </g>
          <g class="nft-hero-graph__moon-2 nft-hero-graph__element">
            <ellipse cx="845.23" cy="370.13" rx="61.5" ry="61" fill="#fff" />
            <ellipse
              cx="845.23"
              cy="370.13"
              rx="61.5"
              ry="61"
              fill="url(#nft-hero-q)"
            />
            <ellipse
              cx="845.23"
              cy="370.13"
              rx="61.5"
              ry="61"
              fill="url(#nft-hero-r)"
            />
            <ellipse
              cx="845.23"
              cy="370.13"
              rx="61.5"
              ry="61"
              fill="url(#nft-hero-s)"
              fill-opacity=".3"
            />
          </g>
        </g>
      </g>
      <g
        class="scale-[1.85] laptop:scale-[1]"
        style="transform-origin: left 60%"
      >
        <g class="nft-hero-graph__title">
          <polygon
            points="91.17 299 96.8 299 113.52 240.3 107.89 240.3 93.72 291.96 79.29 240.3 74.8 240.3 60.37 291.96 46.2 240.3 40.57 240.3 57.38 299 63.01 299 77 248.58 91.17 299"
            fill="#28646e"
          />
          <path
            d="M119.67,299h4.58v-30.98c1.94-3.7,7.74-7.57,12.06-7.57,.88,0,1.5,.09,2.29,.18v-5.02c-5.9,0-10.74,3.43-14.34,8.18v-7.3h-4.58v42.5Z"
            fill="#28646e"
          />
          <g>
            <circle cx="149.89" cy="245.76" r="3.52" fill="#28646e" />
            <rect
              x="147.6"
              y="256.5"
              width="4.58"
              height="42.5"
              fill="#28646e"
            />
          </g>
          <path
            d="M175.66,300.06c3.52,0,5.54-1.06,7.22-2.64l-1.76-3.52c-.97,1.06-2.73,2.02-4.75,2.02-2.99,0-4.4-2.38-4.4-5.81v-29.48h8.62v-4.14h-8.62v-11.62h-4.66v11.62h-7.04v4.14h7.04v30.18c0,5.81,2.73,9.24,8.36,9.24Z"
            fill="#28646e"
          />
          <g>
            <circle cx="192.94" cy="245.76" r="3.52" fill="#28646e" />
            <rect
              x="190.66"
              y="256.5"
              width="4.58"
              height="42.5"
              fill="#28646e"
            />
          </g>
          <path
            d="M238.16,299h4.58v-29.74c0-9.59-4.75-13.82-13.38-13.82-6.16,0-12.23,3.78-15.31,7.48v-6.42h-4.58v42.5h4.58v-32.12c2.73-3.78,8.36-7.3,13.82-7.3,6.16,0,10.3,2.46,10.3,10.74v28.69Z"
            fill="#28646e"
          />
          <path
            d="M257.09,309.82c5.02,5.1,9.59,6.42,16.72,6.42,10.38,0,19.18-4.66,19.18-17.69v-42.06h-4.66v6.86c-3.43-4.84-8.8-7.92-14.78-7.92-11.26,0-19.01,8.8-19.01,22.26s7.74,22.18,19.01,22.18c6.34,0,11.79-3.61,14.78-7.92v6.69c0,9.77-6.78,13.64-14.52,13.64-6.34,0-10.47-1.58-14.08-5.98l-2.64,3.52Zm31.24-21.82c-2.46,4.14-8.1,7.74-13.99,7.74-9.42,0-14.87-7.74-14.87-18.04s5.46-18.13,14.87-18.13c5.9,0,11.53,3.61,13.99,7.74v20.68Z"
            fill="#28646e"
          />
          <polygon
            points="372.11 299 377.04 299 377.04 240.3 372.03 240.3 372.03 290.29 335.24 240.3 330.14 240.3 330.14 299 335.15 299 335.15 248.31 372.11 299"
            fill="#28646e"
          />
          <polygon
            points="391.67 299 396.68 299 396.68 271.19 428.28 271.19 428.28 266.62 396.68 266.62 396.68 244.88 428.89 244.88 428.89 240.3 391.67 240.3 391.67 299"
            fill="#28646e"
          />
          <polygon
            points="454.32 299 459.43 299 459.43 244.88 478.61 244.88 478.61 240.3 435.14 240.3 435.14 244.88 454.32 244.88 454.32 299"
            fill="#28646e"
          />
        </g>
        <text class="nft-hero-graph__tagline laptop:hidden" x="27%" y="360" font-size="24px" alignment-baseline="middle" text-anchor="middle">
          {{ is3DPrintDay ? $t('about_nft_page_hero_tagline_3d_print') : $t('about_nft_page_hero_tagline') }}
        </text>
        <text class="hidden nft-hero-graph__tagline laptop:block" x="500" y="280" font-size="24px">
          {{ is3DPrintDay ? $t('about_nft_page_hero_tagline_3d_print') : $t('about_nft_page_hero_tagline') }}
        </text>
      </g>
    </svg>
  </section>
</template>

<script>
export default {
  name: 'NFTHeroGraph',
  props: {
    is3DPrintDay: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.initAnimation();
  },
  methods: {
    initAnimation() {
      const tlTitle = this.$gsap.gsap.timeline({
        duration: 0.25,
        ease: 'power3.out',
      });

      tlTitle.set('.nft-hero-graph', { opacity: 1 });

      tlTitle.from('.nft-hero-graph__title > *', {
        opacity: 0,
        stagger: 0.1,
        clearProps: 'y,opacity',
      });

      tlTitle.from('.nft-hero-graph__tagline', {
        delay: -0.2,
        opacity: 0,
        stagger: 0.2,
        y: '+=20',
      });

      const tl = this.$gsap.gsap.timeline({
        duration: 0.5,
        ease: 'power3.out',
        repeat: -1,
        delay: -2,
      });

      [
        '.nft-hero-graph__slide-1-square > *',
        '.nft-hero-graph__planet > *',
        '.nft-hero-graph__moon-1 > *',
        '.nft-hero-graph__moon-2 > *',
      ].forEach(el => {
        tl.set(el, {
          rotation: 180,
          transformOrigin: 'center center > *',
        });
      });

      tl.from('.nft-hero-graph__slide-1-circle', {
        ease: 'elastic.out(1, 0.3)',
        duration: 1,
        transformOrigin: 'center center',
        scale: 0,
      });
      tl.set('.nft-hero-graph__slide-1-square', {
        transformOrigin: 'center center',
        rotation: 180,
      });
      tl.from('.nft-hero-graph__slide-1-square', {
        opacity: 0,
        x: 100,
      });

      tl.to('.nft-hero-graph__slide-1-square', {
        delay: 1,
        ease: 'power3.in',
        transformOrigin: '187 186',
        rotation: '+=270',
        scale: 0,
      });
      tl.to(
        '.nft-hero-graph__slide-1-circle',
        {
          transformOrigin: '-354.99 194.78',
          ease: 'power3.in',
          scale: 0,
        },
        '<'
      );

      tl.from('#nft-hero-stroke-clip > rect', {
        scaleX: 0,
        ease: 'slow(0.7, 0.7, false)',
        duration: 1,
      });

      tl.to('#nft-hero-stroke-clip > rect', {
        delay: 1,
        scaleX: 0,
        ease: 'power3.in',
        transformOrigin: 'right center',
        duration: 0.5,
      });

      tl.from('.nft-hero-graph__planet', {
        scale: 0,
        ease: 'elastic.out(1, 0.8)',
        duration: 1,
        transformOrigin: 'center center',
      });
      tl.from(
        '.nft-hero-graph__moon-1',
        {
          scale: 0,
          transformOrigin: '346.49 -98',
        },
        '>-=0.8'
      );
      tl.from(
        '.nft-hero-graph__moon-2',
        {
          scale: 0,
          transformOrigin: '-190.5 -111',
        },
        '>-=0.4'
      );
      tl.from(
        '.nft-hero-graph__moon-3',
        {
          scale: 0,
          transformOrigin: '-190 46',
        },
        '>-=0.4'
      );
      tl.to('.nft-hero-graph__planet', {
        delay: 1,
        scale: 0,
        ease: 'elastic.out(1, 0.8)',
        duration: 1.5,
        transformOrigin: 'center center',
      });
      tl.to(
        '.nft-hero-graph__moon-1',
        {
          rotation: 360,
          scale: 0,
          transformOrigin: '346.49 -98',
        },
        '<'
      );
      tl.to(
        '.nft-hero-graph__moon-2',
        {
          rotation: 360,
          scale: 0,
          transformOrigin: '-190.5 -111',
        },
        '<+=0.1'
      );
      tl.to(
        '.nft-hero-graph__moon-3',
        {
          rotation: 360,
          scale: 0,
          transformOrigin: '-190 46',
        },
        '<+=0.1'
      );
      tlTitle.add(tl, '<');
    },
  },
};
</script>
