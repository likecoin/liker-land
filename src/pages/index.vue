<template>
  <main class="overflow-hidden">
    <SiteHeader
      :is-plain="!isSiteHeaderFixed"
      :class="[
        isSiteHeaderFixed ? 'fixed' : 'absolute',
        'inset-x-0',
        'top-0',
        'z-1',
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
      class="relative pt-[124px] bg-like-green font-serif overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-[url('/images/index/hero-bg-noise.png')] opacity-[0.15] pointer-events-none"
      />

      <div
        class="relative desktop:grid grid-cols-5 w-full max-w-[600px] laptop:max-w-[1920px] mx-auto desktop:min-h-[464px] px-[32px]"
      >
        <svg
          class="absolute left-[40%] top-[50%] translate-y-[-50%] translate-x-[-20%] scale-[1.2] pointer-events-none"
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
          class="absolute left-[40%] h-full"
          src="~assets/images/index/v2/hero-image.png"
          style="mix-blend-mode: screen"
        />

        <div
          class="relative flex flex-col items-start justify-end col-span-2 mt-[56px] font-bold pb-[3.75rem] font-[600]"
        >
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

          <h1 class="text-[3rem] text-like-cyan-light">
            {{ $t('index_hero_slogan_part1') }}
          </h1>
          <div class="relative">
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

            <h1 class="relative text-[5rem] leading-1 text-white">
              {{ $t('index_hero_slogan_part2') }}
            </h1>
          </div>
        </div>

        <div
          class="relative flex flex-col desktop:items-end justify-end col-span-3 text-like-green desktop:text-right"
        >
          <div
            class="relative flex flex-col items-start desktop:items-end mt-[3rem] max-w-[490px] font-[600] pt-[24px] bg-[#f7f7f7]"
          >
            <svg
              :class="[
                'absolute',
                'left-full desktop:left-auto',
                'desktop:right-full',
                'inset-y-0',
                'h-full',
                'translate-x-[-1px] desktop:translate-x-[1px]',
                'scale-x-[-1] desktop:scale-x-[1]',
                'pointer-events-none',
              ]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 350.97 141"
            >
              <path
                d="M270.22,20.13L80.74,120.87c-24.86,13.22-52.59,20.13-80.74,20.13h350.97V0c-28.16,0-55.89,6.91-80.75,20.13Z"
                fill="#f7f7f7"
                stroke-width="0"
              />
            </svg>

            <div
              class="absolute right-full desktop:right-auto desktop:left-full inset-y-0 bg-[#f7f7f7] h-full w-screen pointer-events-none"
            />

            <div class="relative">
              <svg
                class="absolute inset-x-0 top-[50%] translate-y-[-50%] scale-x-[1.1] scale-y-[0.9]"
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
              <h2 class="text-[2.25rem]">{{ $t('index_intro_title') }}</h2>
            </div>
            <p class="text-[1.125rem] mt-[0.25rem]">
              {{ $t('index_intro_description') }}
            </p>
            <NuxtLink
              class="mt-[0.75rem] flex gap-[4px] items-center group"
              :to="localeLocation({ name: 'about-nft-book' })"
            >
              {{ $t('index_intro_more_button') }}

              <svg
                class="group-hover:animate-pulse"
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
        </div>
      </div>
    </section>

    <section
      id="bookstore"
      class="w-full max-w-[600px] laptop:max-w-[1920px] mx-auto mt-[3rem]"
    >
      <div class="desktop:flex gap-[10px] px-[10px]">
        <div
          class="desktop:w-[80px] mb-[1rem] desktop:mb-0 text-[3rem] font-[600] desktop:text-center desktop:break-all font-serif font-bold"
        >
          {{ $t('index_bookstore_title') }}
        </div>

        <div
          class="desktop:grid grid-cols-5 items-stretch gap-[20px] flex-grow"
        >
          <div class="col-span-2 relative">
            <NFTBookItemCardV2
              class="w-full sticky top-[124px]"
              class-cover-frame-aspect-ratio="min-h-[360px] desktop:min-h-[0] desktop:aspect-[4/5]"
              :class-id="stickyBookstoreItem.classId"
              preset="shelf"
              theme="spencer"
              :cover-size="600"
              :is-link-disabled="stickyBookstoreItem.isMultiple"
              @click-cover="handleClickItem($event, stickyBookstoreItem)"
            />
          </div>

          <ul
            class="col-span-3 hidden desktop:grid grid-cols-1 sm:grid-cols-2 gap-[20px] items-stretch mt-[2rem] desktop:mt-0"
          >
            <li v-for="item in bookstoreItemsInGrid" :key="item.classId">
              <NFTBookItemCardV2
                :class-id="item.classId"
                class-cover-frame-aspect-ratio="min-h-[360px] sm:aspect-[4/5]"
                @click-cover="handleClickItem($event, item)"
              />
            </li>
          </ul>
        </div>
      </div>

      <Swiper
        class="block desktop:hidden mt-[32px]"
        :options="{
          slidesOffsetBefore: 10,
          slidesOffsetAfter: 10,
          spaceBetween: 20,
          slidesPerView: 'auto',
        }"
      >
        <SwiperSlide
          v-for="item in bookstoreItemsInGrid"
          :key="item.classId"
          style="width: 220px"
        >
          <NFTBookItemCardV2
            :class-id="item.classId"
            class-cover-frame-aspect-ratio="sm:aspect-[4/5]"
            @click-cover="handleClickItem($event, item)"
          />
        </SwiperSlide>
      </Swiper>

      <div
        class="flex justify-center item-center pt-[4rem] px-[10px] pb-[5rem]"
      >
        <ButtonV2
          :text="$t('index_bookstore_more_button')"
          :to="localeLocation({ name: 'store' })"
        />
      </div>

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

    <section
      id="features"
      class="px-[2rem] pt-[5.5rem] pb-[7.5rem] bg-like-cyan-pale"
    >
      <div class="w-full max-w-[600px] laptop:max-w-[1024px] mx-auto">
        <h2 :class="['text-[2.5rem] text-center font-serif']">
          {{ $t('index_features_title') }}
        </h2>

        <ul
          :class="[
            'grid sm:grid-cols-2 desktop:grid-cols-4 gap-[5.5rem] mt-[5.5rem]',
          ]"
        >
          <li>
            <a
              class="flex flex-col items-center"
              href="https://newsletter.liker.land/p/4de"
              target="_blank"
              rel="noopener"
            >
              <img
                class="w-[100px] h-[100px]"
                src="~assets/images/about/nft-book/icons/gifting.png"
              />
              <h4 class="font-600 mt-[3rem]">
                {{ $t('about_nft_book_section_features_gifting_title') }}
              </h4>
              <p class="mt-[0.5rem] text-center">
                {{ $t('about_nft_book_section_features_gifting_description') }}
              </p>
            </a>
          </li>
          <li>
            <a
              class="flex flex-col items-center"
              href="https://dungfookei.com/en/why-should-i-publish-a-book-using-nft/"
              target="_blank"
              rel="noopener"
            >
              <img
                class="w-[100px] h-[100px]"
                src="~assets/images/about/nft-book/icons/ownership.png"
              />
              <h4 class="font-600 mt-[3rem]">
                {{ $t('about_nft_book_section_features_ownership_title') }}
              </h4>
              <p class="mt-[0.5rem] text-center">
                {{
                  $t('about_nft_book_section_features_ownership_description')
                }}
              </p>
            </a>
          </li>
          <li>
            <a
              class="flex flex-col items-center"
              href="https://blog.like.co/zh/%E5%85%A7%E5%AE%B9%E6%84%9B%E5%A5%BD%E8%80%85%E7%9A%84%E5%BB%A3%E5%A0%B4-liker-land-%E6%96%B0%E5%8A%9F%E8%83%BD/"
              target="_blank"
              rel="noopener"
            >
              <img
                class="w-[100px] h-[100px]"
                src="~assets/images/about/nft-book/icons/social.png"
              />
              <h4 class="font-600 mt-[3rem]">
                {{ $t('about_nft_book_section_features_social_title') }}
              </h4>
              <p class="mt-[0.5rem] text-center">
                {{ $t('about_nft_book_section_features_social_description') }}
              </p>
            </a>
          </li>
          <li>
            <NuxtLink
              class="flex flex-col items-center"
              :to="localeLocation({ name: 'gutenberg' })"
            >
              <img
                class="w-[100px] h-[100px]"
                src="~assets/images/about/nft-book/icons/multimedia.png"
              />
              <h4 class="font-600 mt-[3rem]">
                {{ $t('about_nft_book_section_features_multimedia_title') }}
              </h4>
              <p class="mt-[0.5rem] text-center">
                {{
                  $t('about_nft_book_section_features_multimedia_description')
                }}
              </p>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <section id="categories" class="bg-gradient-to-b from-like-cyan-pale">
      <ul class="flex justify-center items-center gap-[2.25rem] px-[16px]">
        <li class="max-w-[430px] max-h-[116px]">
          <NuxtLink
            :class="[
              'grid',
              'grid-cols-10',
              'items-center',
              'gap-[10px]',
              'text-like-green',
              'font-serif',
              'rounded-[12px]',
              'border-[1px]',
              'bg-gradient-to-b',
              'from-[#F3EFEB]',
              'to-[#ECE9E2]',
              'border-[#CFC6BC]',
              'group',
            ]"
            :to="localeLocation({ name: 'store' })"
          >
            <div
              class="col-span-4 p-[1rem] laptop:p-[2rem] pr-0 laptop:pr-0 text-left"
            >
              <div class="opacity-50 font-[600]">
                {{ $t('index_category_button_browse_label') }}
              </div>
              <div class="text-[1.8rem] laptop:text-[2.25rem]">
                {{ $t('index_category_button_ebook') }}
              </div>
            </div>
            <img
              class="col-span-6 my-[-2rem] translate-x-[2rem] scale-[1.2] group-hover:scale-[1.3] transition-transform object-contain h-full"
              :alt="$t('index_category_button_ebook')"
              src="~assets/images/index/v2/category-ebook.png"
            />
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section id="faq" class="pt-[12rem] pb-[3rem] font-serif">
      <div
        class="laptop:grid grid-cols-5 w-full max-w-[600px] laptop:max-w-[1600px] mx-auto px-[10px]"
      >
        <div class="flex flex-col items-start justify-start col-span-2">
          <div class="relative flex laptop:justify-center">
            <img
              class="absolute top-[50%] translate-y-[-50%] pointer-events-none scale-[4]"
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
            />
            <ButtonV2
              theme="glow"
              preset="tertiary"
              :href="$t('about_nft_page_faq_more_url')"
              :text="$t('about_nft_page_faq_more_button')"
            />
          </div>
        </div>
      </div>
    </section>

    <section id="social" class="py-[48px]">
      <h2
        class="flex flex-wrap items-center justify-center gap-[0.75rem] text-[2rem] font-serif font-bold"
      >
        {{ $t('index_social_title') }}
        <ButtonV2
          theme="glow"
          preset="tertiary"
          text="@liker.land"
          href="https://instagram.com/@liker.land?utm_medium=web&utm_source=likerlandweb"
        />
      </h2>
    </section>
  </main>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

import bookstoreMixin from '~/mixins/bookstore';

export default {
  name: 'IndexV2',
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
    };
  },
  async fetch({ store }) {
    try {
      await store.dispatch('fetchBookstoreList');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
  head() {
    const title = this.$t('og_title');
    const description = this.$t('og_description');

    const classIds = Array.from(
      new Set(this.bookstoreItems.map(b => b.classId).flat())
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
    return {
      title,
      meta,
      link: links,
    };
  },
  computed: {
    bookstoreItems() {
      return this.bookstoreListItemsInHighlighted.slice(0, 7).map(item => {
        const isMultiple =
          Array.isArray(item.classId) && item.classId.length > 1;

        const newItem = {
          ...item,
          isMultiple,
          classId: isMultiple ? item.classId[0] : item.classId,
        };

        if (isMultiple) {
          newItem.classIds = item.classId;
        }

        return newItem;
      });
    },
    stickyBookstoreItem() {
      return this.bookstoreItems[0];
    },
    bookstoreItemsInGrid() {
      return this.bookstoreItems.slice(1);
    },
    faqs() {
      return this.$t('index_faq_list').map(({ q: question, a: answer }) => ({
        question,
        answer,
      }));
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (!this.$refs.hero) return;

      const { clientHeight: heroHeight } = this.$refs.hero;
      if (window.scrollY > heroHeight) {
        this.isSiteHeaderFixed = true;
      } else {
        this.isSiteHeaderFixed = false;
      }
    },
    handleClickItem(event, item) {
      if (item.isMultiple) {
        event.stopPropagation();
        event.preventDefault();
        this.dialogNFTClassList = item.classIds;
      }
    },
    closeMultipleNFTClassDialog() {
      this.dialogNFTClassList = [];
    },
  },
};
</script>
