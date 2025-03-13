<template>
  <main class="relative">
    <SiteHeader
      :is-plain="!isSiteHeaderFixed"
      :class="[
        isSiteHeaderFixed ? 'fixed' : 'absolute',
        'inset-x-0',
        'top-0',
        'z-10',
        'text-[#f7f7f7]',
        'bg-opacity-75',
        'transition-all',
        {
          ['!text-like-green bg-gray-f7 backdrop-blur-sm']: isSiteHeaderFixed,
        },
      ]"
    />

    <section
      id="hero"
      ref="hero"
      class="relative pt-[260px] desktop:pt-[180px] bg-like-green font-serif overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-[url('/images/index/hero-bg-noise.png')] opacity-[0.15] pointer-events-none"
      />

      <div
        :class="[
          'relative',

          'desktop:grid',
          'grid-cols-11',
          'grid-rows-2',

          'w-full',
          'laptop:max-w-[1920px]',
          'mx-auto',
          paddingClass,
        ]"
      >
        <svg
          :class="[
            heroGraphicPositionClass,
            'scale-[2.5] desktop:scale-[4]',
            'h-full',
            'origin-center',
          ]"
          viewBox="0 0 2168 1929"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.2" stroke="#EBEBEB">
            <rect
              x="1126.98"
              y="898.11"
              width="77"
              height="157"
              rx="38.5"
              transform="rotate(84 1126.98 898.11)"
            />
            <rect
              x="1285.37"
              y="733.954"
              width="277"
              height="562.128"
              rx="138.5"
              transform="rotate(74 1285.37 733.954)"
            />
            <rect
              x="1382.94"
              y="518.249"
              width="477"
              height="967.256"
              rx="238.5"
              transform="rotate(64 1382.94 518.249)"
            />
            <rect
              x="1409.42"
              y="267.386"
              width="677"
              height="1372.38"
              rx="338.5"
              transform="rotate(54 1409.42 267.386)"
            />
            <rect
              x="1354.63"
              y="0.706999"
              width="877"
              height="1777.51"
              rx="438.5"
              transform="rotate(44 1354.63 0.706999)"
            />
            <rect
              x="1614.4"
              y="12.5298"
              width="969.011"
              height="1963.9"
              rx="484.506"
              transform="rotate(55.2537 1614.4 12.5298)"
            />
          </g>
        </svg>
        <img
          :class="[
            heroGraphicPositionClass,
            'h-full',
            'desktop:scale-[1.6]',
            'object-contain',
          ]"
          src="~assets/images/index/v2/hero-image.png"
          style="mix-blend-mode: screen"
        />

        <div
          :class="[
            'relative',

            'flex',
            'flex-col',
            'items-start',
            'justify-end',

            'col-span-5',
            'col-start-1',
            'row-span-2',

            'mt-[56px]',
            'pb-[2.5rem] desktop:pb-[3.75rem]',

            'font-[600]',
          ]"
        >
          <!-- Slogan bg gradient -->
          <svg
            class="absolute inset-x-0 top-[40%] scale-[1.5] translate-x-[-15%] pointer-events-none"
            viewBox="0 0 1449 1062"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.42" filter="url(#filter0_f_623_957)">
              <path
                d="M737.375 892C1037.47 892 1280.75 734.18 1280.75 539.5C1280.75 344.82 1037.47 187 737.375 187C437.277 187 194 344.82 194 539.5C194 734.18 437.277 892 737.375 892Z"
                fill="url(#paint0_radial_623_957)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_623_957"
                x="30"
                y="23"
                width="1414.75"
                height="1033"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="82"
                  result="effect1_foregroundBlur_623_957"
                />
              </filter>
              <radialGradient
                id="paint0_radial_623_957"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(252.258 811.956) rotate(-32.7869) scale(1370.31 2185.71)"
              >
                <stop offset="0.36" stop-color="#8AF5E9" />
                <stop offset="1" stop-color="#33D875" stop-opacity="0" />
              </radialGradient>
            </defs>
          </svg>

          <h1
            :class="[
              'text-[6vw] desktop:text-[2.5vw] full-hd:text-[48px]',
              'text-like-cyan-light',
            ]"
          >
            {{ $t('index_hero_slogan_part1') }}
          </h1>
          <div class="relative">
            <!-- Slogan line 2 bg -->
            <svg
              class="absolute inset-x-0 top-[50%] translate-y-[-50%] opacity-[0.8]"
              viewBox="0 0 486 91"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.7"
                d="M379.525 2.61217C376.699 2.70943 373.871 2.8183 371.046 2.95327C360.786 3.47832 350.529 4.10364 340.32 5.31228C334.481 5.95087 328.639 6.58043 322.785 7.07484C316.495 7.60634 316.056 7.55499 309.643 7.99683C307.385 8.15123 305.129 8.32768 302.872 8.49297C290.326 9.49719 277.802 10.8852 265.22 11.3486C252.169 11.8068 239.116 12.2155 226.058 12.3738C212.582 12.5354 199.107 12.6963 185.63 12.7578C170.074 13.0108 154.522 13.4421 138.981 14.2294C124.636 15.0795 110.288 15.9719 95.9956 17.5234C84.2339 18.6543 72.4821 19.8713 60.7376 21.1743C57.512 21.5423 54.286 21.9124 51.0352 21.9012C44.8205 22.1343 43.0502 28.2282 45.4263 31.9957C41.9037 32.0783 38.3805 32.1421 34.8575 32.2031C29.256 32.2996 23.6562 32.4504 18.0558 32.5944C12.1527 32.8156 10.2831 38.3203 12.1501 42.0982C6.07696 44.1134 6.4896 52.205 11.6138 54.2507C11.3479 55.1298 11.2776 56.0548 11.3766 56.9665C10.8559 56.9693 10.3354 56.9704 9.8149 56.9778C8.84115 56.9965 7.86757 57.0176 6.89369 57.0238C-2.08218 57.2418 -1.956 69.7959 6.71032 70.0326C6.03454 73.2336 5.14595 76.4326 5.53238 79.6398C5.66642 80.7527 7.67682 80.2628 8.77887 80.4183C10.0652 80.6001 14.2567 80.389 15.2138 80.3293C18.2117 80.1416 21.3412 79.8199 24.375 79.5104C26.0357 79.4408 27.6971 79.3778 29.3576 79.3019C24.8619 82.7055 26.5596 91.2101 33.9649 90.9326L33.965 90.9338C40.1564 90.5952 46.3514 90.3293 52.5486 90.1381C54.3521 90.0906 56.1556 90.0516 57.959 89.9978C67.5074 89.7117 62.4045 89.786 72.6533 89.6141C80.6746 89.4798 88.6963 89.4592 96.7182 89.3996C107.68 89.1666 118.65 88.7173 129.578 87.7737C134.638 87.3354 141.395 86.5729 146.442 86.0235C161.321 84.3962 176.207 82.8366 191.072 81.0766C195.121 80.5741 199.18 80.1785 203.242 79.8211C212.977 79.9038 222.711 79.9485 232.446 80.0336C236.719 79.9884 242.48 79.9422 246.713 79.8393C257.315 79.5816 267.899 78.874 278.486 78.2644C293.404 77.334 308.32 76.2777 323.254 75.6673C330.534 75.5113 337.813 75.3619 345.093 75.2544C345.997 75.2468 346.9 75.2391 347.804 75.2318C348.508 75.4058 349.275 75.6638 349.521 75.2211C353.034 75.2268 354.806 75.534 354.284 71.7147C363.586 71.2639 372.889 70.8369 382.198 70.5817C385.078 70.5872 387.958 70.5933 390.838 70.6149C398.658 70.7389 406.474 71.0822 414.291 71.3196C419.435 71.4644 424.582 71.5098 429.728 71.4475C430.836 71.4642 431.255 71.4512 437.3 71.4404C438.82 71.4378 440.341 71.4537 441.861 71.4528C442.81 71.4525 444.471 72.3618 444.707 71.4357C444.707 71.4347 444.708 71.4341 444.708 71.4332C447.409 71.994 447.29 71.7166 445.905 66.9294C445.949 66.7722 445.977 66.669 446.02 66.5171C448.811 66.5092 451.601 66.5065 454.391 66.4713C454.713 66.4685 458.539 66.4039 459.048 66.3861C464.782 66.1829 467.513 65.9141 465.773 54.9134C467.653 54.8869 468.636 54.8985 468.882 54.1746C469.516 54.0536 470.15 53.9371 470.782 53.8078C471.815 53.5963 472.824 53.2806 473.845 53.0172C475.203 51.9276 477.573 51.4613 477.92 49.7483C478.702 45.8808 478.24 43.5181 476.941 41.9151C480.416 40.7125 481.73 37.212 481.003 34.2044C487.978 32.1906 486.93 21.2386 478.555 21.5467C476.32 21.6383 474.085 21.7199 471.849 21.7977C469.437 21.8795 467.026 21.9611 464.615 22.0515C464.605 21.9075 464.593 21.7735 464.586 21.6253C466.02 21.4107 467.174 20.8566 468.057 20.0914C469.866 20.7833 472.07 20.6419 474.296 19.0964C473.393 14.9565 472.916 10.6975 471.586 6.67672C471.439 6.2316 470.654 6.66752 470.189 6.67816C467.97 6.72652 465.753 6.89851 463.535 6.94516C459.145 7.12536 454.756 7.30022 450.365 7.46918C450.63 3.97056 448.252 0.275326 443.33 0.462385L441.026 0.564069C437.847 0.709388 434.666 0.828916 431.487 0.972588C422.653 1.3559 413.818 1.6949 404.98 1.93308C396.497 2.16767 388.011 2.32854 379.53 2.61779L379.525 2.61217ZM151.211 26.2001C160.535 25.8334 169.863 25.5958 179.192 25.4269C178.112 25.5663 176.988 25.7235 175.992 25.8354C169.458 26.5672 162.891 26.9101 156.322 27.0774C148.076 27.3807 139.832 27.7187 131.586 28.0104C124.996 28.243 118.407 28.4726 111.818 28.7115C121.098 27.9215 130.389 27.2667 139.687 26.7198C143.528 26.5253 147.369 26.3531 151.211 26.2013L151.211 26.2001ZM443.119 22.4242C446.579 22.3059 450.039 22.1794 453.499 22.0585C454.554 22.0257 455.609 21.9884 456.664 21.9487C450.88 22.6724 445.096 23.3951 439.308 24.0718C434.79 24.2501 430.274 24.4217 425.758 24.6304C420.005 24.8908 414.253 25.1599 408.501 25.4405C412.356 25.1116 416.195 24.6126 420.028 24.0675C423.841 23.4792 427.683 23.1444 431.531 22.9121C435.393 22.7096 439.256 22.5636 443.119 22.4229L443.119 22.4242ZM468.526 51.5548C468.648 51.6008 468.771 51.6446 468.888 51.7021C468.907 51.7111 468.933 51.7704 468.91 51.764C468.778 51.7182 468.57 51.716 468.531 51.5808C468.529 51.5709 468.523 51.5646 468.523 51.5547L468.526 51.5548ZM134.012 71.4595C134.466 72.5249 135.064 73.5773 135.685 74.6138C133.38 74.8524 131.079 75.0875 128.677 75.2958C118.025 76.22 107.335 76.6683 96.6481 76.8836C89.33 76.9375 82.0125 76.9842 74.6945 77.061C82.9336 76.5328 91.1675 75.9312 99.3924 75.1945C109.365 74.1774 119.316 72.9733 129.287 71.9435C130.861 71.7745 132.437 71.6207 134.012 71.459L134.012 71.4595ZM9.38265 80.1312C9.38159 80.1412 9.38075 80.1445 9.37957 80.1512C9.22307 80.1524 8.75563 80.1724 8.91141 80.158C9.06833 80.1472 9.22535 80.1357 9.38249 80.1279L9.38265 80.1312Z"
                fill="#166060"
              />
            </svg>

            <h1
              :class="[
                'relative',
                isEnglish
                  ? 'text-[8vw] desktop:text-[3vw] full-hd:text-[56px]'
                  : 'text-[12vw] laptop:text-[3.5rem] desktop:text-[5vw] full-hd:text-[96px]',
                'leading-1',
                'text-white',
              ]"
            >
              {{ $t('index_hero_slogan_part2') }}
            </h1>
          </div>
        </div>

        <div
          :class="[
            'relative',
            'flex',
            'flex-col',
            'desktop:items-end',
            'justify-start',

            'col-start-6',
            'col-span-6',
            'row-start-1 desktop:row-start-2',
            'row-span-2',

            'text-like-green',
            'desktop:text-right',
          ]"
        >
          <div
            class="relative z-[2] flex flex-col items-start desktop:items-end max-w-[490px] h-full font-[600] pt-[24px]"
          >
            <!-- Description bg smooth corner -->
            <svg
              :class="[
                'absolute',
                'top-0',
                'left-full desktop:left-auto',
                'desktop:right-full',
                'translate-x-[-120px] desktop:translate-x-[100px]',
                'scale-x-[-1] desktop:scale-x-[1]',
                'pointer-events-none',
              ]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 350.97 141"
              style="height: calc(100% + 1px)"
            >
              <path
                d="M270.22,20.13L80.74,120.87c-24.86,13.22-52.59,20.13-80.74,20.13h350.97V0c-28.16,0-55.89,6.91-80.75,20.13Z"
                fill="#f7f7f7"
                stroke-width="0"
              />
            </svg>

            <!-- Description extended bg -->
            <div
              :class="[
                'absolute',
                'right-0 desktop:right-auto',
                'desktop:left-0',
                'inset-y-0',

                'bg-[#f7f7f7]',

                'w-screen',
                'h-full',

                'pointer-events-none',

                'translate-x-[-119px] desktop:translate-x-[99px]',
              ]"
            />

            <div class="relative">
              <!-- Intro title circle brush stoke -->
              <svg
                class="absolute inset-x-0 top-[50%] translate-y-[-50%] scale-x-[1.1] scale-y-[0.9] pointer-events-none"
                viewBox="0 0 407 114"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.7"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M405.402 38.925L405.905 37.0987L406.124 33.1314L405.222 29.6795L403.038 25.994L400.054 22.8888L396.027 19.9196L393.618 18.4771L388.163 15.7453L381.439 13.043L374.18 10.7227L366.046 8.60424L364.648 6.91958L362.124 5.31099L359.746 4.2641L354.917 2.80178L350.772 2.02855L342.982 1.29931L332.683 0.926534L312.068 1.42211L293.706 0.865015L269.481 1.22294L250.791 2.16455L238.002 3.13231L218.527 5.04449L199.045 7.42296L179.344 10.2901L159.906 13.6097L135.18 18.6382L116.924 23.0058L100.072 27.8182L84.0737 33.2118L69.1438 39.0568L55.508 45.3037L43.0718 52.0036L35.5667 56.5242L28.7473 61.015L22.4933 65.677L16.9319 70.292L12.2246 74.5761L12.2107 74.5902L8.54814 78.2989L6.83235 80.3632L4.74588 83.4678L2.1626 88.6518L1.0514 91.7851L0.633207 98.1324L1.89465 104.283L3.01134 105.274L4.19652 105.011L4.77974 103.649L3.52021 97.2856L3.725 93.482L4.4119 90.8809L6.64081 86.17L8.27335 83.3815L10.5425 80.4289L16.2105 74.8704L21.306 70.4342L27.1759 65.8068L33.6448 61.2774L44.5589 54.5681L52.6497 50.0994L61.3076 45.7823L70.4693 41.7019L80.2362 37.785L90.5348 34.0385L101.249 30.521L101.27 30.5143L112.334 27.2555L129.786 22.8317L129.807 22.8265L141.427 20.2498L141.443 20.2465L160.032 16.5459L185.981 12.2275L218.538 7.99728L244.384 5.57183L269.393 4.18257L280.621 3.89459L278.517 4.08687L256.633 6.70752L233.391 10.1947L215.374 13.3807L197.463 17.0613L178.974 21.3336L161.462 26.0239L144.534 31.3075L128.314 37.0806L113.566 43.1336L100.062 49.5877L88.2768 56.1566L81.6937 60.4557L73.5257 66.9233L69.2831 71.1482L67.2518 73.549L65.7953 75.5591L63.7662 79.3922L63.1428 81.3075L62.7588 83.6517L62.8886 87.1763L63.3792 88.942L65.3472 92.5052L66.6975 94.0368L70.0772 96.7937L74.355 99.3213L82.5298 102.913L92.1571 105.893L103.271 108.409L115.496 110.449L129.004 112.033L138.507 112.763L153.259 113.289L168.808 113.188L184.842 112.424L195.742 111.527L212.471 109.624L229.578 107.07L247.18 103.821L265.53 99.8575L283.307 95.5377L301.204 90.6934L318.61 85.4992L334.949 80.1052L350.497 74.4439L360.005 70.6283L372.53 64.9641L383.302 59.2675L392.047 53.6744L398.708 48.2163L402.32 44.2767L403.626 42.4567L405.402 38.925ZM402.399 30.5826L403.19 33.6104L403.079 36.2477L401.955 39.4481L401.017 41.0736L399.815 42.7426L396.943 45.8555L390.43 51.188L381.805 56.708L374.9 60.4613L367.179 64.2285L354.061 69.8775L339.011 75.5589L317.417 82.8015L300.061 87.9848L276.296 94.3041L258.946 98.3719L241.123 102.049L223.756 105.048L206.815 107.377L190.288 109.056L174.198 110.047L158.51 110.362L143.547 110.049L129.286 109.078L115.849 107.503L99.8921 104.695L89.3164 102.048L80.5224 98.9931L76.0212 96.8914L71.9043 94.4567L68.705 91.8468L67.5446 90.5306L66.2042 88.0546L65.7973 86.5947L65.6249 85.0829L65.9439 82.258L67.3187 78.7742L69.7763 75.0569L73.066 71.3911L77.7087 67.1971L83.3007 62.9442L89.7932 58.7083L97.3567 54.3732L105.816 50.0243L114.92 45.7825L124.519 41.7422L134.843 37.8085L134.863 37.8011L145.747 34.0143L145.765 34.0083L156.972 30.4318L156.99 30.4263L168.331 27.1259L168.351 27.1205L180.068 24.0541L180.088 24.0493L198.06 19.8702L198.077 19.8663L215.502 16.2619L245.308 11.1672L273.191 7.4278L293.704 5.40716L307.165 4.45047L310.721 4.32098L327.101 5.47831L337.489 6.59179L352.002 8.73622L360.8 10.4502L361.412 11.071L361.657 11.7692L361.594 12.4278L362.484 13.9463L364.093 14.6484L365.806 14.2665L366.958 12.9585L367.102 11.9114L373.627 13.6252L380.797 15.9218L386.68 18.2649L391.931 20.8915L396.297 23.6924L399.635 26.5774L400.861 27.9988L402.399 30.5826Z"
                  fill="#AAF1E7"
                />
              </svg>
              <h2
                :class="[
                  'relative',
                  isEnglish
                    ? 'text-[1.3rem] desktop:text-[1.8rem]'
                    : 'text-[1.5rem] desktop:text-[2.25rem]',
                ]"
              >
                {{ $t('index_intro_title') }}
              </h2>
            </div>

            <i18n
              class="relative text-[1rem] desktop:text-[1.125rem] mt-[0.25rem]"
              tag="p"
              path="index_intro_description"
            >
              <span class="whitespace-nowrap" place="likerLand">{{
                $t('index_intro_description_liker_land')
              }}</span>
            </i18n>

            <div
              :class="[
                'flex',

                'justify-center',
                'laptop:justify-start',
                'desktop:justify-end',

                'w-full',
                'mt-[24px]',
                'mb-[8px]',
                'z-50',
                'font-sans',
                'font-400',
              ]"
            >
              <div
                :class="[
                  'flex',
                  'items-center',
                  'gap-[12px]',
                  'bg-white',
                  'pl-[16px] py-[4px] pr-[6px]',
                  'w-full laptop:max-w-[360px]',
                  'shadow-md',
                  'rounded-[10px]',
                ]"
              >
                <input
                  v-model="searchQuery"
                  class="w-full bg-transparent border-0 grow text-dark-gray focus-visible:outline-none"
                  type="text"
                  :placeholder="placeholderText"
                  @keyup.enter="toggleSearch"
                />
                <ButtonV2
                  preset="secondary"
                  class="!rounded-[10px] ml-auto"
                  content-class="whitespace-nowrap"
                  :text="$t('listing_page_search')"
                  @click="toggleSearch"
                >
                  <template #prepend>
                    <IconSearch />
                  </template>
                </ButtonV2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="featured-books" :class="bookstoreSectionClass">
      <div :class="['w-full', 'desktop:flex', 'gap-[16px]', paddingClass]">
        <h2
          :class="[
            bookstoreSectionStickyClass,
            bookstoreSectionTitleClass,

            'self-start',

            'mb-[1rem] desktop:mb-0',

            'desktop:vertical-lr',
          ]"
          v-text="$t('index_bookstore_title')"
        />

        <div
          :class="[
            'desktop:grid',
            'grid-cols-5 min-1280:grid-cols-6',
            'items-stretch',
            'gap-[20px] min-1280:gap-[24px]',
            'flex-grow',
          ]"
        >
          <div v-if="stickyEditorialBookstoreItem" class="col-span-2">
            <NFTBookItemCardV2
              :class="[bookstoreSectionStickyClass, 'w-full']"
              class-cover-frame-aspect-ratio="min-h-[360px] desktop:min-h-[0] desktop:aspect-[4/5]"
              :item-id="stickyEditorialBookstoreItem.classId"
              preset="shelf"
              theme="spencer"
              :cover-resize="300"
              :is-link-disabled="stickyEditorialBookstoreItem.isMultiple"
              :is-lazy-loaded="false"
              link-medium="index_sticky_item"
              @click-cover="
                handleClickItem($event, stickyEditorialBookstoreItem)
              "
            />
          </div>

          <ul
            :class="[
              'col-span-3 min-1280:col-span-4',
              'hidden desktop:grid',
              'grid-cols-1 sm:grid-cols-2 min-1280:grid-cols-3',
              'gap-[20px] min-1280:gap-[24px]',
              'items-stretch',
              'mt-[2rem]',
              'desktop:mt-0',
            ]"
          >
            <li
              v-for="item in editorialBookstoreItemsInGrid"
              :key="item.classId"
            >
              <NFTBookItemCardV2
                :item-id="item.classId"
                class-cover-frame-aspect-ratio="min-h-[360px] laptop:min-h-[0] aspect-[4/5]"
                :cover-resize="300"
                :is-link-disabled="item.isMultiple"
                link-medium="index_grid_item"
                @click-cover="handleClickItem($event, item)"
              />
            </li>
          </ul>
        </div>
      </div>

      <Swiper
        class="w-full relative block desktop:hidden mt-[32px] right-0"
        :options="{
          slidesOffsetBefore: 16,
          slidesOffsetAfter: 16,
          breakpoints: {
            769: {
              slidesOffsetBefore: 32,
              slidesOffsetAfter: 32,
            },
          },
          spaceBetween: 20,
          slidesPerView: 'auto',
        }"
        @sliderMove="handleSwiperBookstoreSwiper"
      >
        <SwiperSlide
          v-for="item in editorialBookstoreItemsInGrid"
          :key="item.classId"
          style="width: 220px"
        >
          <NFTBookItemCardV2
            :item-id="item.classId"
            class-cover-frame-aspect-ratio="aspect-[4/5]"
            link-medium="index_grid_item_swiper"
            @click-cover="handleClickItem($event, item)"
          />
        </SwiperSlide>
      </Swiper>

      <ButtonV2
        class="self-center"
        :text="$t('index_bookstore_more_button')"
        :to="
          localeLocation({
            name: 'store',
            query: { ll_medium: 'index_grid_item_more' },
          })
        "
        @click.native="handleClickBookstoreMore"
      />

      <Dialog
        :open="dialogNFTClassList.length > 0"
        :header-text="$t('nft_book_shelf_multiple_nft_class_dialog_title')"
        panel-container-class="phone:max-w-[520px] laptop:max-w-[768px]"
        panel-component="CardV2"
        panel-class="overflow-y-scroll shadow-lg"
        @close="closeMultipleNFTClassDialog"
      >
        <ul class="flex flex-col gap-[2rem]">
          <li
            v-for="classId in dialogNFTClassList"
            :id="classId"
            :key="classId"
          >
            <NFTBookItemCard
              :class-id="classId"
              component-class="!bg-like-cyan-pale"
            />
          </li>
        </ul>
      </Dialog>
    </section>

    <section id="latest-books" :class="[bookstoreSectionClass, paddingClass]">
      <h2
        :class="bookstoreSectionTitleClass"
        v-text="$t('index_latest_books_title')"
      />

      <ul
        :class="[
          'w-full',
          'grid',
          'grid-cols-2',
          'sm:grid-cols-3',
          'laptop:grid-cols-3',
          'desktop:grid-cols-4',
          'desktopLg:grid-cols-5',
          'gap-x-[16px] sm:gap-x-[20px] gap-y-[40px]',
          'items-stretch',
        ]"
      >
        <li
          v-for="(item, index) in latestBookstoreItems"
          :key="item.id"
          :class="{
            'desktop:hidden desktopLg:block':
              $options.latestBookstoreItemsLimit - index <= 2,
            'hidden desktop:block':
              $options.latestBookstoreItemsLimit - index <= 4,
          }"
        >
          <NFTBookItemCardV2
            :item-id="item.classId"
            class-cover-frame-aspect-ratio="aspect-[4/5]"
            :is-link-disabled="item.isMultiple"
            link-medium="index_latest_item"
            @click-cover="handleClickItem($event, item)"
          />
        </li>
      </ul>

      <ButtonV2
        class="self-center"
        :text="$t('index_bookstore_more_button')"
        :to="
          localeLocation({
            name: 'store',
            query: { tag: 'latest', ll_medium: 'index_latest_more' },
          })
        "
        @click.native="handleClickLatestMore"
      />
    </section>

    <div class="overflow-hidden">
      <section
        id="features"
        :class="[
          'relative',
          paddingClass,
          'pb-[64px] laptop:pb-[75px]',
          'bg-like-green',
        ]"
      >
        <svg
          class="absolute top-0 left-0 hidden origin-top-left pointer-events-none desktop:block min-1280:scale-125"
          width="334"
          height="271"
          viewBox="0 0 334 271"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.3"
            d="M332 220.338C318.913 239.425 303.695 270.969 276.99 268.902C267.121 268.07 259.225 260.099 257.669 250.487C255.505 237.23 260.152 225.102 263.999 212.282C269.093 196.638 275.593 181.473 281.977 166.255C288.829 148.575 299.433 129.308 295.596 109.934C291.675 91.0393 270.009 85.4871 255.026 95.1102C229.513 116.658 195.529 165.232 173.043 188.059C166.052 194.581 154.489 193.952 148.777 185.459C143.769 177.764 144.419 167.523 146.262 159.136C151.751 136.373 164.454 100.513 165.636 78.4217C167.064 63.257 155.246 54.5824 141.509 53.1117C114.292 50.9484 81.8952 80.7022 63.4057 98.6909C48.9337 113.504 36.0816 130.214 24.2525 147.734C2.23555 181.91 -11.8421 214.317 5.80558 233.681C12.8924 241.503 25.8937 246.767 36.9981 244.476C58.6208 241.013 68.8087 220.818 72.5386 200.794C76.3004 183.082 76.8332 165.157 73.3911 147.371C62.9261 91.1992 16.9526 74.8197 -17 125.13"
            stroke="#FBF9DD"
            stroke-width="4"
            stroke-linecap="round"
          />
        </svg>

        <svg
          class="absolute top-0 right-0 origin-top-right pointer-events-none min-1280:scale-125"
          width="276"
          height="222"
          viewBox="0 0 276 222"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.3"
            d="M105.835 -49C154.393 23.3852 102.416 38.554 35.24 32.1373C-5.14743 28.2783 -9.03299 77.5435 25.2375 95.3923C66.9683 120.814 112.784 93.3572 155.137 85.9174C184.745 85.1278 198.155 115.298 176.208 135.505C158.556 150.763 142.259 173.46 154.438 197.17C171.223 231.867 217.25 223.415 237.521 195.846C256.661 177.897 267.94 121.704 296.615 128.855C310.548 132.336 309.171 146.826 313.501 157.624C323.448 184.492 362.503 189.596 379 166.176"
            stroke="#FBF9DD"
            stroke-width="4"
            stroke-linecap="round"
          />
        </svg>

        <div class="relative w-full laptop:max-w-[1600px] mx-auto">
          <h2
            :class="[
              'pt-[48px] desktop:pt-[80px]',

              'text-white',
              'text-[2rem] desktop:text-[2.5rem]',
              'text-center',
              'font-serif',
            ]"
            v-text="$t('index_features_title')"
          />
          <div class="flex justify-center">
            <NuxtLink
              :class="[
                'relative',
                'mt-[0.75rem]',
                'flex',
                'gap-[4px]',
                'items-center',
                'group',

                'text-white',
                'font-serif',
                'border-white',
                'border-[1px]',
                'rounded-[48px]',
                'pl-[24px]',
                'pr-[16px]',
                'py-[8px]',
              ]"
              :to="localeLocation({ name: 'about-nft-book' })"
              @click.native="handleClickAboutNFTBook"
            >
              {{ $t('index_intro_more_button') }}

              <svg
                class="transition-transform duration-300 ease-in-out group-hover:translate-x-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 12H19" />
                  <path d="M15 16L19 12" />
                  <path d="M15 8L19 12" />
                </g>
              </svg>
            </NuxtLink>
          </div>

          <NFTBookSignatureBanner
            class="mt-[32px] desktop:mt-[48px]"
            tag="div"
            :name="signatureBannerNames"
          >
            <div class="flex items-center gap-[16px] mt-[32px]">
              <img
                class="h-[35px] shrink-0"
                src="~assets/images/index/v2/creators-with-autograph.png"
              />
              <p
                class="text-[14px]"
                v-text="$t('landing_creators_with_autograph')"
              />
            </div>

            <div class="flex mt-[32px]">
              <ButtonV2
                :text="$t('index_features_signature_button')"
                :to="
                  localeLocation({
                    name: 'store',
                    query: {
                      tag: 'autograph',
                      utm_medium:
                        $route.query.utm_medium ||
                        'landing_page_signature_banner_cta',
                    },
                  })
                "
                @click="handleSignatureBannerCTA"
              >
                <template #append>
                  <IconArrowRight />
                </template>
              </ButtonV2>
            </div>
          </NFTBookSignatureBanner>

          <ul
            :class="[
              'grid',
              'laptop:grid-cols-3',
              'items-stretch',
              'gap-[64px] laptop:gap-[20px]',

              'mt-[48px] laptop:mt-[20px]',
              'px-[16px] laptop:px-0',
            ]"
          >
            <li v-for="item in featureItems" :key="item.title">
              <LandingPageFeatureItem
                :title="item.title"
                :description="item.description"
                :href="item.href"
                :icon-src="item.iconSrc"
                :icon-src-white="item.iconSrcWhite"
                @click="item.onClick"
              />
            </li>
          </ul>
        </div>
      </section>

      <section
        id="faq"
        :class="[paddingClass, 'pt-[12rem]', 'pb-[3rem]', 'font-serif']"
      >
        <div
          :class="[
            'laptop:grid',
            'grid-cols-5',

            'w-full',
            'laptop:max-w-[1600px]',
            'mx-auto',
          ]"
        >
          <div class="flex flex-col items-start justify-start col-span-2">
            <div class="relative flex laptop:justify-center">
              <!-- Faq section soft gradient bg -->
              <img
                class="absolute top-[50%] translate-y-[-50%] pointer-events-none scale-[4]"
                loading="lazy"
                src="~assets/images/index/v2/faq-bg.png"
              />

              <h2
                class="relative text-[2rem] laptop:text-[3rem] text-like-green font-[600]"
              >
                {{ $t('index_faq_title') }}

                <svg
                  class="absolute pointer-events-none top-[50%] translate-y-[-45%] translate-x-[-50%] left-full w-full"
                  viewBox="0 0 311 328"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.6"
                    d="M89.21 109L120.775 61.7885V61.7885C142.878 28.2161 188.012 18.9186 221.585 41.0219L223.905 42.5498C258.759 65.4969 268.412 112.354 245.465 147.208L168.477 264.143C145.53 298.997 98.6729 308.65 63.8189 285.702L61.4982 284.175C27.9258 262.071 18.6284 216.937 40.7317 183.365V183.365"
                    stroke="url(#paint0_linear_252_654)"
                  />
                  <path
                    opacity="0.6"
                    d="M112.546 109L144.111 61.7885V61.7885C166.214 28.2161 211.348 18.9186 244.921 41.0219L247.241 42.5498C282.095 65.4969 291.748 112.354 268.801 147.208L191.633 264.416C168.786 299.119 122.131 308.73 87.4278 285.882L79.0141 280.343C48.7333 260.407 40.5125 219.607 60.71 189.5V189.5"
                    stroke="url(#paint1_linear_252_654)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_252_654"
                      x1="204.667"
                      y1="206.498"
                      x2="57.4837"
                      y2="116.78"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#28646E" />
                      <stop offset="1" stop-color="#28646E" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_252_654"
                      x1="228.003"
                      y1="206.498"
                      x2="80.8197"
                      y2="116.78"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#28646E" />
                      <stop offset="1" stop-color="#28646E" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </h2>
            </div>
          </div>

          <div class="relative mt-[2.5rem] laptop:mt-0 col-span-3">
            <ul class="w-full space-y-[1rem]">
              <li v-for="(faq, index) in faqs" :key="`faq-${index}`">
                <IndexPageFAQItem
                  :number="index + 1"
                  :is-initial-open="index === 0"
                >
                  <template #question>
                    {{ faq.question }}
                  </template>
                  <template #answer>
                    <div v-html="faq.answer" />
                  </template>
                </IndexPageFAQItem>
              </li>
            </ul>

            <div class="flex justify-center items-center mt-[32px] gap-[24px]">
              <ButtonV2
                theme="glow"
                preset="tertiary"
                :href="$t('about_nft_page_faq_know_more_url')"
                :text="$t('about_nft_page_faq_know_more_button')"
                @click.native="handleClickDocs"
              />
              <ButtonV2
                theme="glow"
                preset="tertiary"
                :href="$t('about_nft_page_faq_more_url')"
                :text="$t('about_nft_page_faq_more_button')"
                @click.native="handleClickFAQ"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="social" class="py-[48px]">
        <h2
          class="flex flex-wrap items-center justify-center gap-[0.75rem] text-[2rem] font-serif font-bold mb-[40px]"
        >
          {{ $t('index_social_title') }}
          <ButtonV2
            theme="glow"
            preset="tertiary"
            text="@liker.land"
            href="https://newsletter.liker.land/?utm_medium=web&utm_source=likerlandweb&utm_campaign=home_page"
            @click.native="handleClickSocialFollow"
          />
        </h2>

        <div
          class="elfsight-app-7e044f5d-8211-4f9e-aa27-63d239cc36fc"
          data-elfsight-app-lazy
        />
      </section>
    </div>

    <PartnersSection
      :class="[paddingClass, 'max-w-[1600px]', 'w-full', 'mx-auto']"
    />
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

import bookstoreMixin from '~/mixins/bookstore';

import { logTrackerEvent, logRetailEvent } from '~/util/EventLogger';
import { fisherShuffle } from '~/util/misc';

import { SEARCH_SUGGESTIONS } from '@/constant/index';

const SIGNATURE_BANNER_NAMES = [
  '董啟章',
  '陳健民',
  '高重建',
  '邵家臻',
  '區家麟',
];

const getFeatureIconSrc = require.context(
  '~/assets/images/about/nft-book/icons'
);

function getFeatureIcon(iconName, { isWhite = false } = {}) {
  return getFeatureIconSrc(`./${iconName}${isWhite ? '-white' : ''}.png`);
}

export default {
  name: 'IndexV2',
  latestBookstoreItemsLimit: 10,
  components: {
    Swiper,
    SwiperSlide,
  },
  mixins: [bookstoreMixin],
  layout: 'index',
  data() {
    return {
      dialogNFTClassList: [],
      isSiteHeaderFixed: false,
      searchQuery: '',
    };
  },
  async fetch({ store, route }) {
    const { t } = route.query;
    try {
      await Promise.all([
        store.dispatch('fetchBookstoreCMSProductsForLandingPage', { t }),
        store.dispatch('lazyFetchBookstoreCMSProductsByTagId', {
          tagId: 'landing-latest',
          t,
        }),
      ]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
  head() {
    const title = this.$t('og_title');
    const description = this.$t('og_description');

    const classIds = Array.from(
      new Set(
        this.editorialBookstoreItems.map(b => b.classIds || b.classId).flat()
      )
    );
    const links = [];
    classIds.forEach(classId =>
      links.push({
        rel: 'prefetch',
        href: `/api/nft/metadata?class_id=${classId}`,
      })
    );

    const meta = [
      {
        hid: 'og:title',
        property: 'og:title',
        content: title,
      },
      {
        hid: 'description',
        name: 'description',
        content: description,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: description,
      },
    ];

    const script = [
      {
        hid: 'schema-faq',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: this.faqs.map(({ question, answer }) => ({
            '@context': 'http://www.schema.org',
            '@type': 'Question',
            name: question,
            acceptedAnswer: {
              '@context': 'http://www.schema.org',
              '@type': 'Answer',
              text: answer,
            },
          })),
        }),
        type: 'application/ld+json',
        body: true,
      },
      {
        hid: 'elfsight',
        src: 'https://apps.elfsight.com/p/platform.js',
        defer: true,
        dataUseServiceCore: 'data-use-service-core',
      },
    ];

    return {
      title,
      meta,
      link: links,
      script,
    };
  },
  computed: {
    ...mapGetters(['nftGetBookstoreCMSProductsByTagId']),
    isEnglish() {
      return this.$i18n.locale === 'en';
    },
    bookstoreSectionClass() {
      return [
        'flex',
        'flex-col',
        'gap-[40px]',
        'w-full',
        'laptop:max-w-[1920px]',
        'mx-auto',
        'pt-[3rem]',
        'pb-[5rem]',
      ];
    },
    bookstoreSectionTitleClass() {
      return [
        'text-[1.75rem] desktop:text-[2.5rem]',
        'font-[600]',
        'font-serif',
      ];
    },
    paddingClass() {
      return 'px-[16px] laptop:px-[32px] desktop:px-[48px]';
    },
    heroGraphicPositionClass() {
      return [
        'absolute',
        'left-[70%]',
        'desktop:left-[60%]',
        'top-[30%]',
        'translate-y-[-120%] desktop:translate-y-[-50%]',
        'translate-x-[-50%]',
        'pointer-events-none',
      ].join(' ');
    },
    bookstoreSectionStickyClass() {
      return 'desktop:sticky desktop:top-[124px]';
    },
    editorialBookstoreItems() {
      return this.nftBookstoreCMSProductsForLandingPage.filter(
        item =>
          !item.locales ||
          item.locales.some(locale => this.$i18n.locale.includes(locale))
      );
    },
    stickyEditorialBookstoreItem() {
      return this.editorialBookstoreItems[0];
    },
    editorialBookstoreItemsInGrid() {
      return this.editorialBookstoreItems.slice(1, 10);
    },
    latestBookstoreItems() {
      return this.nftGetBookstoreCMSProductsByTagId('landing-latest').slice(
        0,
        this.$options.latestBookstoreItemsLimit
      );
    },
    signatureBannerNames() {
      return fisherShuffle([...SIGNATURE_BANNER_NAMES]);
    },
    featureItems() {
      return [
        {
          title: this.$t('about_nft_book_section_features_gifting_title'),
          description: this.$t(
            'about_nft_book_section_features_gifting_description'
          ),
          href: this.$t('about_nft_book_section_features_gifting_link'),
          iconName: 'author',
          onClick: this.handleClickFeatureSupportAuthor,
        },
        {
          title: this.$t('about_nft_book_section_features_ownership_title'),
          description: this.$t(
            'about_nft_book_section_features_ownership_description'
          ),
          href: this.$t('about_nft_book_section_features_ownership_link'),
          iconName: 'ownership',
          onClick: this.handleClickFeatureOwnership,
        },
        {
          title: this.$t('about_nft_book_section_features_social_title'),
          description: this.$t(
            'about_nft_book_section_features_social_description'
          ),
          href: this.$t('about_nft_book_section_features_social_link'),
          iconName: 'social',
          onClick: this.handleClickFeatureCommunity,
        },
      ].map(({ iconName, ...item }) => ({
        ...item,
        iconSrc: getFeatureIcon(iconName),
        iconSrcWhite: getFeatureIcon(iconName, { isWhite: true }),
      }));
    },
    faqs() {
      return this.$t('index_faq_list').map(({ q: question, a: answer }) => ({
        question,
        answer,
      }));
    },
    randomKeywords() {
      if (this.$i18n.locale === 'zh-Hant') {
        const shuffled = [...SEARCH_SUGGESTIONS].sort(
          () => Math.random() - 0.5
        );
        const randomTerms = shuffled.slice(0, 3);
        return randomTerms;
      }
      return [];
    },
    placeholderText() {
      return this.randomKeywords?.length
        ? this.randomKeywords.join('、')
        : this.$t('gutenberg_search_placeholder');
    },
  },
  mounted() {
    logRetailEvent(this, 'home-page-view');
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (!this.$refs.hero) return;

      const { clientHeight: heroHeight } = this.$refs.hero;
      this.isSiteHeaderFixed = window.scrollY > heroHeight;

      if (
        !this.hasScrolledHitBottom &&
        window.scrollY >= document.body.scrollHeight - window.screen.availHeight
      ) {
        this.hasScrolledHitBottom = true;
        logTrackerEvent(this, 'IndexPage', 'IndexScrollHitBottom', '', 1);
      } else if (!this.hasScrolledPastHero && this.isSiteHeaderFixed) {
        this.hasScrolledPastHero = true;
        logTrackerEvent(this, 'IndexPage', 'IndexScrollPassHero', '', 1);
      }
    },
    handleClickAboutNFTBook() {
      logTrackerEvent(this, 'IndexPage', 'IndexClickAboutNFTBook', '', 1);
    },
    handleClickItem(event, item) {
      if (item.isMultiple) {
        event.preventDefault();
        this.dialogNFTClassList = item.classIds;
        logTrackerEvent(
          this,
          'IndexPage',
          'IndexNFTBookItemCardClick',
          item.classIds[0],
          1
        );
      } else {
        logTrackerEvent(
          this,
          'IndexPage',
          'IndexNFTBookItemCardClick',
          item.classId,
          1
        );
      }
    },
    handleSwiperBookstoreSwiper() {
      if (this.hasSwipedBookstoreSwiper) return;
      this.hasSwipedBookstoreSwiper = true;
      logTrackerEvent(this, 'IndexPage', 'IndexSwipeBookstoreSwiper', '', 1);
    },
    handleClickBookstoreMore() {
      logTrackerEvent(this, 'IndexPage', 'IndexClickBookstoreMore', '', 1);
    },
    handleClickLatestMore() {
      logTrackerEvent(this, 'IndexPage', 'IndexClickLatestMore', '', 1);
    },
    handleClickFeatureSupportAuthor() {
      logTrackerEvent(
        this,
        'IndexPage',
        'IndexClickFeatureSupportAuthor',
        '',
        1
      );
    },
    handleClickFeatureOwnership() {
      logTrackerEvent(this, 'IndexPage', 'IndexClickFeatureOwnership', '', 1);
    },
    handleClickFeatureCommunity() {
      logTrackerEvent(this, 'IndexPage', 'IndexClickFeatureCommunity', '', 1);
    },
    handleSignatureBannerCTA() {
      logTrackerEvent(this, 'IndexPage', 'IndexClickCategoryEbook', '', 1);
    },
    handleClickSocialFollow() {
      logTrackerEvent(this, 'IndexPage', 'IndexClickSocialFollow', '', 1);
    },
    handleClickDocs() {
      logTrackerEvent(this, 'IndexPage', 'IndexClickDocs', '', 1);
    },
    handleClickFAQ() {
      logTrackerEvent(this, 'IndexPage', 'IndexClickFAQ', '', 1);
    },
    closeMultipleNFTClassDialog() {
      this.dialogNFTClassList = [];
    },
    toggleSearch() {
      if (this.searchQuery) {
        this.$router.push(
          this.localeLocation({
            name: 'store',
            query: { q: this.searchQuery },
          })
        );
      } else {
        const fallbackKeyword = this.randomKeywords?.[0];
        this.$router.push(
          this.localeLocation({
            name: 'store',
            query: { q: fallbackKeyword },
          })
        );
      }
    },
  },
};
</script>
