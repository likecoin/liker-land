<template>
  <main
    ref="page"
    class="pb-[10rem]"
    style="opacity: 0"
  >

    <section
      id="hero"
      ref="heroSection"
      :class="[
        'relative',
        'pb-[200vh]',
        'bg-fixed',
      ]"
      :style="heroSectionStyle"
    >
      <svg
        :class="[
          'wave-bg',
          'hidden',
          'laptop:block',
          'fixed',
          'top-[50%]',
          'left-[50%]',
          'translate-x-[-50%]',
          'translate-y-[-50%]',
          'w-[2560px]',
          'pointer-events-none',
        ]"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 2560 2800"
      >
        <defs>
          <linearGradient
            v-for="(props, index) in heroSectionWaveGradientLayer"
            :id="`hero-section-wave-gradient-${index + 1}`"
            :key="`hero-section-wave-gradient-${index + 1}`"
            :gradientUnits="index > 0 ? null : 'userSpaceOnUse'"
            :xlink:href="index > 0 ? '#hero-section-wave-gradient-1' : null"
            v-bind="props"
          >
            <template v-if="index === 0">
              <stop offset="0" stop-color="#f3ea8c"/>
              <stop offset=".32" stop-color="#f28f9b"/>
              <stop offset=".7" stop-color="#d6afec"/>
              <stop offset="1" stop-color="#addeec"/>
            </template>
          </linearGradient>
        </defs>
        <g
          v-for="(path, index) in heroSectionWavePaths"
          ref="heroSectionBgWavePathLayers"
          :key="`hero-section-wave-path-${index + 1}`"
        >
          <path
            :d="path"
            fill="none"
            opacity=".6"
            :stroke="`url(#hero-section-wave-gradient-${index + 1})`"
            stroke-width="1.6"
          />
        </g>
      </svg>

      <div
        :class="[
          'flex',
          'flex-col',
          'justify-center',
          'items-center',
          'min-h-[100vh]',
        ]"
      >
        <div
          ref="heroSectionKeyArt"
          :class="[
            'relative',
            'hidden laptop:block',
            sectionContentClass,
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 1024 634"
          >
            <defs>
              <clipPath id="hero-section-tagline-right-path">
                <path
                  fill="none"
                  :d="heroSectionTaglineRightPath"
                />
              </clipPath>
              <image
                id="hero-section-gradient"
                class="blur-[10px]"
                xlink:href="~assets/images/index/gradient-1.jpg"
                width="500"
                height="333"
              />
            </defs>
            <g ref="heroSectionTaglineRight">
              <g ref="heroSectionTaglineRightText" clip-path="url(#hero-section-tagline-right-path)">
                <use xlink:href="#hero-section-gradient" :transform="`translate(613.55 203.03) scale(${isEnglish ? '' : '.31'} .7)`"/>
              </g>
            </g>
          </svg>
          <svg
            ref="heroSectionPortalFill"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 1024 634"
            class="absolute inset-0 blur-[6px]"
          >
            <defs>
              <clipPath id="hero-section-portal-path">
                <path
                  fill="none"
                  d="M515 133c59.65 0 108 48.35 108 108v152c0 59.65-48.35 108-108 108s-108-48.35-108-108V241c0-59.65 48.35-108 108-108Z"
                />
              </clipPath>
            </defs>
            <g clip-path="url(#hero-section-portal-path)">
              <use xlink:href="#hero-section-gradient" transform="matrix(0 -1.39 1.39 0 174.71 552.98)"/>
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 1024 634"
            class="absolute inset-0"
          >
            <defs>
              <clipPath id="hero-section-writing-nft-text">
                <path
                  fill="none"
                  d="M655.62 337h-9.06l-7.02-27.48-6.96 27.48h-9.06l-11.46-40.02h9.54l7.02 28.92 7.62-28.92h6.66l7.56 28.92 6.96-28.92h9.6L655.62 337Zm20.44 0h-7.62v-28.98h7.62v3.96c2.04-2.58 5.64-4.62 9.24-4.62v7.44c-.54-.12-1.26-.18-2.1-.18-2.52 0-5.88 1.38-7.14 3.24V337Zm17.18-33.24c-2.46 0-4.56-2.04-4.56-4.56s2.1-4.56 4.56-4.56 4.56 2.04 4.56 4.56-2.04 4.56-4.56 4.56Zm3.84 33.24h-7.62v-28.98h7.62V337Zm16.68.72c-5.34 0-8.22-2.76-8.22-7.92v-15.12h-4.8v-6.66h4.8v-7.92h7.68v7.92h5.88v6.66h-5.88v13.08c0 1.8.96 3.18 2.64 3.18 1.14 0 2.22-.42 2.64-.84l1.62 5.76c-1.14 1.02-3.18 1.86-6.36 1.86Zm13.73-33.96c-2.46 0-4.56-2.04-4.56-4.56s2.1-4.56 4.56-4.56 4.56 2.04 4.56 4.56-2.04 4.56-4.56 4.56Zm3.84 33.24h-7.62v-28.98h7.62V337Zm34.14 0h-7.62v-17.52c0-4.02-2.1-5.4-5.34-5.4-3 0-5.34 1.68-6.6 3.42V337h-7.62v-28.98h7.62v3.78c1.86-2.22 5.4-4.5 10.14-4.5 6.36 0 9.42 3.6 9.42 9.24V337Zm6.37 7.44 3.42-5.52c2.34 2.58 5.4 3.6 9.06 3.6s7.98-1.62 7.98-7.32v-2.94c-2.28 2.88-5.4 4.56-8.94 4.56-7.26 0-12.78-5.1-12.78-14.76s5.46-14.76 12.78-14.76c3.48 0 6.6 1.5 8.94 4.44v-3.72h7.68v27c0 11.04-8.52 13.74-15.66 13.74-4.98 0-8.88-1.14-12.48-4.32Zm20.46-17.7v-9.36c-1.26-1.92-4.02-3.3-6.54-3.3-4.32 0-7.32 3-7.32 7.98s3 7.98 7.32 7.98c2.52 0 5.28-1.44 6.54-3.3ZM857.69 337h-8.22l-19.08-26.88V337h-8.52v-40.02h8.76l18.54 25.92v-25.92h8.52V337Zm15.81 0h-8.52v-40.02h28.32v7.32h-19.8v8.7h19.38v7.32H873.5V337Zm42.98 0h-8.58v-32.52h-11.7v-7.5h31.92v7.5h-11.64V337Z"
                />
              </clipPath>
              <linearGradient
                id="hero-section-tagline-left-gradient"
                x1="86"
                y1="316.65"
                x2="450"
                y2="316.65"
                gradientTransform="translate(0 636) scale(1 -1)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#000"/>
                <stop offset=".77" stop-color="#000"/>
                <stop offset="1" stop-color="#000" stop-opacity=".05"/>
              </linearGradient>
              <linearGradient
                id="hero-section-indicator-fill"
                x1="129"
                x2="436"
                y1="316"
                y2="316"
                gradientTransform="matrix(1 0 0 -1 0 636)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-opacity=".04"/>
                <stop offset=".88"/>
                <stop offset="1" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path
              ref="heroSectionPortalBorder"
              stroke="#4a4a4a"
              fill="none"
              d="M492 133.5c59.37 0 107.5 48.13 107.5 107.5v152c0 59.37-48.13 107.5-107.5 107.5S384.5 452.37 384.5 393V241c0-59.37 48.13-107.5 107.5-107.5Z"
            />
            <g ref="heroSectionTaglineCenterAndLeft">
              <path
                ref="heroSectionTaglineLeftText"
                :d="heroSectionTaglineLeftTextPath"
                fill="url(#hero-section-tagline-left-gradient)"
              />
              <path
                ref="heroSectionTaglineCenterText"
                fill="#4a4a4a"
                :d="heroSectionTaglineCenterTextPath"
              />
            </g>
            <path
              ref="heroSectionIndicator"
              fill="url(#hero-section-indicator-fill)"
              d="M129 319c-.55 0-1 .45-1 1s.45 1 1 1v-2Zm0 2h307v-2H129v2Z"
            />
            <g
              ref="heroSectionWritingNFTText"
              fill="none"
              clip-path="url(#hero-section-writing-nft-text)"
            >
              <use xlink:href="#hero-section-gradient" transform="matrix(.64 0 0 .64 612.02 212.55)"/>
            </g>
          </svg>
          <div
            ref="heroSectionAllStoryMattersDescription"
            :class="[
              'absolute',
              'left-[65%]',
              'inset-0',
              'flex',
              'flex-col',
              'justify-center',
              'pr-[2.5rem]',
            ]"
          >
            <h2 class="text-[1rem] font-[600]">{{ $t('index_page_hero_all_stories_matter_heading') }}</h2>
            <p class="mt-[0.5rem] text-[1rem]">{{ $t('index_page_hero_all_stories_matter_content') }}</p>
          </div>
          <div
            ref="heroSectionWritingNFTDescription"
            :class="[
              'absolute',
              'right-[65%]',
              'inset-0',
              'flex',
              'flex-col',
              'justify-center',
              'pr-[1rem]',
              'pl-[2.5rem]',
            ]"
          >
            <h2 class="text-[1rem] font-[600] text-like-green">{{ $t('index_page_hero_writing_nft_heading') }}</h2>
            <p class="mt-[0.5rem] text-[1rem]">{{ $t('index_page_hero_writing_nft_content') }}</p>
          </div>

          <nav
            ref="heroSectionCTA"
            :class="[
              'absolute',
              'inset-x-0',
              'bottom-0',
              'mt-[3.5rem]',
              'flex',
              'flex-wrap',
              'flex-col laptop:flex-row',
              'justify-center',
              'items-center',
              'gap-[1rem]',
            ]"
          >
            <ButtonV2
              :text="$t('index_page_hero_try_collect_button')"
              preset="secondary"
              :to="localeLocation({ name: 'store' })"
              @click.native="handleTryCollectButtonClickInHeroSection"
            />
            <ButtonV2
              :text="$t('index_page_hero_publish_story_button')"
              :href="publishStoryURL"
              preset="tertiary"
              @click.native="handlePublishStoryButtonClickInHeroSection"
            />
          </nav>

        </div>
        <div
          ref="heroSectionMobileKeyArt"
          class="relative w-[328px] mx-auto max-h-screen laptop:hidden"
        >
          <svg
            ref="heroSectionMobilePortalFillLayer"
            class="blur-[4px]"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 328 450"
          >
            <defs>
              <clipPath id="hero-section-portal-path-mobile">
                <path d="m175.66,1.43h0c59.65,0,108,48.35,108,108v152c0,59.65-48.35,108-108,108h0c-59.65,0-108-48.35-108-108V109.43C67.66,49.79,116.02,1.43,175.66,1.43Z" fill="none"/>
              </clipPath>
            </defs>
            <g
              ref="heroSectionMobilePortalFill"
              clip-path="url(#hero-section-portal-path-mobile)"
              fill="none"
            >
              <use transform="translate(-164.63 421.41) rotate(-90) scale(1.39)" xlink:href="#hero-section-gradient"/>
            </g>
          </svg>
          <svg
            ref="heroSectionMobilePortalBorderLayer"
            class="absolute inset-0"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 328 450"
          >
            <path
            ref="heroSectionMobilePortalBorder"
              d="m152.66,1.93h0c59.37,0,107.5,48.13,107.5,107.5v152c0,59.37-48.13,107.5-107.5,107.5h0c-59.37,0-107.5-48.13-107.5-107.5V109.43C45.16,50.06,93.29,1.93,152.66,1.93Z"
              fill="none"
              stroke="#4a4a4a"
            />
          </svg>
          <svg
            ref="heroSectionMobileTagline"
            class="absolute inset-0"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 328 450"
          >
            <defs>
              <clipPath id="hero-section-collectibles-path-en-mobile">
                <path d="m15.65,441.53c-8.59,0-15.42-6.17-15.42-15.2s6.83-15.2,15.42-15.2c6.7,0,10.44,3.53,12.51,7.18l-5.38,2.64c-1.23-2.38-3.88-4.27-7.14-4.27-5.11,0-8.99,4.1-8.99,9.65s3.88,9.65,8.99,9.65c3.26,0,5.9-1.85,7.14-4.27l5.38,2.6c-2.11,3.66-5.82,7.23-12.51,7.23Zm15.71-15.2c0-8.86,6.48-15.2,15.33-15.2s15.38,6.34,15.38,15.2-6.48,15.2-15.38,15.2-15.33-6.34-15.33-15.2Zm24.28,0c0-5.51-3.53-9.65-8.94-9.65s-8.9,4.14-8.9,9.65,3.48,9.65,8.9,9.65,8.94-4.19,8.94-9.65Zm30.39,14.67h-18.68v-29.39h6.26v23.88h12.43v5.51Zm23.95,0h-18.68v-29.39h6.26v23.88h12.43v5.51Zm26.06,0h-20.8v-29.39h20.8v5.38h-14.54v6.39h14.23v5.38h-14.23v6.83h14.54v5.42Zm19.78.53c-8.59,0-15.42-6.17-15.42-15.2s6.83-15.2,15.42-15.2c6.7,0,10.44,3.53,12.51,7.18l-5.38,2.64c-1.23-2.38-3.88-4.27-7.14-4.27-5.11,0-8.99,4.1-8.99,9.65s3.88,9.65,8.99,9.65c3.26,0,5.9-1.85,7.14-4.27l5.38,2.6c-2.11,3.66-5.82,7.23-12.51,7.23Zm30.21-.53h-6.3v-23.88h-8.59v-5.51h23.44v5.51h-8.55v23.88Zm19.7,0h-6.26v-29.39h6.26v29.39Zm22.67,0h-15.95v-29.39h15.47c5.6,0,8.46,3.57,8.46,7.49,0,3.7-2.29,6.17-5.07,6.74,3.13.48,5.64,3.53,5.64,7.23,0,4.41-2.95,7.93-8.55,7.93Zm-9.69-24.06v6.48h7.84c2.11,0,3.44-1.37,3.44-3.26s-1.32-3.22-3.44-3.22h-7.84Zm0,11.81v6.92h8.06c2.38,0,3.79-1.37,3.79-3.48,0-1.85-1.32-3.44-3.79-3.44h-8.06Zm30.1,12.25h-6.26v-29.39h6.26v29.39Zm25.4,0h-18.68v-29.39h6.26v23.88h12.43v5.51Zm26.06,0h-20.8v-29.39h20.8v5.38h-14.54v6.39h14.23v5.38h-14.23v6.83h14.54v5.42Zm3.75-4.14l3.44-4.76c2.07,2.16,5.29,3.97,9.34,3.97,3.44,0,5.11-1.63,5.11-3.3,0-2.2-2.56-2.95-5.95-3.75-4.8-1.1-10.97-2.42-10.97-8.99,0-4.89,4.23-8.86,11.15-8.86,4.67,0,8.55,1.41,11.46,4.1l-3.48,4.58c-2.38-2.2-5.55-3.22-8.42-3.22s-4.32,1.23-4.32,3c0,1.98,2.47,2.6,5.86,3.39,4.85,1.1,11.02,2.56,11.02,9.08,0,5.38-3.83,9.43-11.76,9.43-5.64,0-9.69-1.89-12.47-4.67Z" fill="none"/>
              </clipPath>
              <clipPath id="hero-section-collectibles-path-zh-mobile">
                <path d="m90.95,433.26c3.41-.66,8.59-1.95,13.59-3.19l.62,4.69c-4.25,1.42-8.77,2.79-12.4,3.9l-1.82-5.4Zm11.38-27.45h5.18v41.22h-5.18v-41.22Zm-8.63,4.83h5.09v23.87h-5.09v-23.87Zm20.59,2.79h18.77v5h-18.77v-5Zm.04-7.97l5.45,1.06c-1.86,8.28-5.14,16.21-9.43,21.17-.84-1.06-2.97-3.1-4.16-4.03,3.94-4.16,6.73-11.03,8.15-18.2Zm11.16,10.63l5.31.8c-2.83,14.97-8.72,24.66-20.46,30.33-.49-1.24-2.04-3.68-3.01-4.83,10.8-4.61,15.94-13.06,18.15-26.3Zm-9.12.75c2.35,11.78,7.44,21.43,17.14,25.64-1.2,1.06-2.88,3.19-3.63,4.61-10.49-5.18-15.45-15.59-18.33-29.31l4.83-.93Zm29.09-8.68h39.59v4.34h-39.59v-4.34Zm9.3,8.15h30.69v4.47h-30.69v-4.47Zm-6.51,7.26h5.89v4.21h-5.89v-4.21Zm-3.85,6.86h9.52v4.3h-9.52v-4.3Zm15.59,8.59h11.51v3.32h-11.51v-3.32Zm-4.78-33.52h5.27v9.25h-5.27v-9.25Zm14.61,0h5.27v9.39h-5.27v-9.39Zm-5.4,18.91h3.5v5h-3.5v-5Zm-18.2-7.62h3.85v11.87h-3.85v-11.87Zm18.2,18.46h3.5v5h-3.5v-5Zm-3.94-7.35h10.8v8.81h-10.8v-3.1h7.17v-2.61h-7.17v-3.1Zm-2.17-5.45h12.84v3.32h-9.17v19.04h-3.68v-22.36Zm-5.89-6.15h4.38v13.33c0,5.49-.4,12.84-2.92,17.58-.84-.71-2.83-1.77-3.94-2.17,2.3-4.34,2.48-10.58,2.48-15.45v-13.28Zm18.86-2.57h4.74c-.04,18.55,3.23,28.78,5.53,28.78.75-.04,1.2-1.37,1.42-5.62.93.93,2.35,1.9,3.45,2.3-.58,6.69-1.99,7.93-5.27,7.93-6.2,0-9.34-13.2-9.87-33.39Zm6.46.71l3.1-2.3c1.37.89,3.06,2.21,3.81,3.23l-3.28,2.48c-.71-1.02-2.26-2.44-3.63-3.41Zm1.64,7.93l4.69.8c-2.21,10.63-6.51,18.91-13.11,24.04-.8-.84-2.75-2.48-3.85-3.19,6.6-4.47,10.49-12.09,12.27-21.65Zm-32.86,9.7h3.72v3.76c0,3.06-.44,8.1-3.23,11.25-.71-.62-2.17-1.64-3.01-2.08,2.21-2.7,2.52-6.77,2.52-9.3v-3.63Zm63.98-19.75v5.98h15.59v-5.98h-15.59Zm-5.14-5.05h26.17v16.07h-26.17v-16.07Zm-6.07,19.79h16.91v19.75h-5.31v-14.7h-6.6v14.97h-5v-20.01Zm20.68,0h17.53v19.79h-5.36v-14.74h-7.08v14.97h-5.09v-20.01Zm-18.46,12.71h11.6v5.09h-11.6v-5.09Zm20.9,0h12.4v5.09h-12.4v-5.09Z" fill="none"/>
              </clipPath>
            </defs>
            <g
              v-if="isEnglish"
              ref="heroSectionMobileTaglineParts"
            >
              <path
                d="m14.1,124.75h-3.49v-24.91H1.75v-3.11h21.25v3.11h-8.9v24.91Zm15.64-10.88v-17.14h3.49v17.05c0,5.12,2.77,8.36,7.94,8.36s7.94-3.23,7.94-8.36v-17.05h3.49v17.09c0,6.97-3.82,11.42-11.42,11.42s-11.42-4.49-11.42-11.38Zm51.84,10.88h-4.12l-7.14-11.13h-5.59v11.13h-3.49v-28.01h11.26c5.12,0,8.78,3.28,8.78,8.44s-3.44,7.81-7.27,8.15l7.56,11.42Zm-3.91-19.57c0-3.15-2.27-5.33-5.59-5.33h-7.35v10.71h7.35c3.32,0,5.59-2.23,5.59-5.38Zm34.41,19.57h-3.36l-16.34-22.6v22.6h-3.49v-28.01h3.57l16.13,22.13v-22.13h3.49v28.01ZM15.31,165.75h-3.49v-11.84L.78,137.73h4.07l8.69,13.02,8.69-13.02h4.07l-11,16.17v11.84Zm13.94-13.99c0-8.27,5.59-14.49,13.9-14.49s13.9,6.22,13.9,14.49-5.63,14.49-13.9,14.49-13.9-6.22-13.9-14.49Zm24.19,0c0-6.55-4.03-11.38-10.29-11.38s-10.29,4.83-10.29,11.38,3.99,11.38,10.29,11.38,10.29-4.87,10.29-11.38Zm11.16,3.11v-17.14h3.49v17.05c0,5.12,2.77,8.36,7.94,8.36s7.94-3.23,7.94-8.36v-17.05h3.49v17.09c0,6.97-3.82,11.42-11.42,11.42s-11.42-4.49-11.42-11.38Zm51.84,10.88h-4.12l-7.14-11.13h-5.59v11.13h-3.49v-28.01h11.26c5.12,0,8.78,3.28,8.78,8.44s-3.44,7.81-7.27,8.15l7.56,11.42Zm-3.91-19.57c0-3.15-2.27-5.33-5.59-5.33h-7.35v10.71h7.35c3.32,0,5.59-2.23,5.59-5.38ZM2,202.8l2.06-2.65c1.85,2.06,4.87,3.99,8.82,3.99,5,0,6.59-2.69,6.59-4.83,0-3.36-3.4-4.28-7.1-5.29-4.49-1.18-9.49-2.44-9.49-7.94,0-4.62,4.12-7.77,9.62-7.77,4.28,0,7.6,1.43,9.95,3.91l-2.1,2.56c-2.1-2.31-5.04-3.36-8.11-3.36-3.36,0-5.75,1.81-5.75,4.45,0,2.81,3.23,3.65,6.8,4.62,4.58,1.22,9.79,2.65,9.79,8.53,0,4.07-2.77,8.23-10.33,8.23-4.87,0-8.44-1.85-10.75-4.45Zm38.56,3.95h-3.49v-24.91h-8.86v-3.11h21.25v3.11h-8.9v24.91Zm13.35-13.99c0-8.27,5.59-14.49,13.9-14.49s13.9,6.22,13.9,14.49-5.63,14.49-13.9,14.49-13.9-6.22-13.9-14.49Zm24.19,0c0-6.55-4.03-11.38-10.29-11.38s-10.29,4.83-10.29,11.38,3.99,11.38,10.29,11.38,10.29-4.87,10.29-11.38Zm31.48,13.99h-4.12l-7.14-11.13h-5.59v11.13h-3.49v-28.01h11.26c5.12,0,8.78,3.28,8.78,8.44s-3.44,7.81-7.27,8.15l7.56,11.42Zm-3.91-19.57c0-3.15-2.27-5.33-5.59-5.33h-7.35v10.71h7.35c3.32,0,5.59-2.23,5.59-5.38Zm14.72,19.57h-3.49v-28.01h3.49v28.01Zm27.02,0h-18.35v-28.01h18.35v3.11h-14.87v9.03h14.57v3.11h-14.57v9.66h14.87v3.11Zm5.98-3.95l2.06-2.65c1.85,2.06,4.87,3.99,8.82,3.99,5,0,6.59-2.69,6.59-4.83,0-3.36-3.4-4.28-7.1-5.29-4.49-1.18-9.49-2.44-9.49-7.94,0-4.62,4.12-7.77,9.62-7.77,4.28,0,7.6,1.43,9.95,3.91l-2.1,2.56c-2.1-2.31-5.04-3.36-8.11-3.36-3.36,0-5.75,1.81-5.75,4.45,0,2.81,3.23,3.65,6.8,4.62,4.58,1.22,9.79,2.65,9.79,8.53,0,4.07-2.77,8.23-10.33,8.23-4.87,0-8.44-1.85-10.75-4.45Z"
                fill="#000"
              />
              <path
                d="m7.17,275.75h-3.49v-28.01h3.49v28.01Zm31.85,0h-3.36l-16.34-22.6v22.6h-3.49v-28.01h3.57l16.13,22.13v-22.13h3.49v28.01Zm19.07,0h-3.49v-24.91h-8.86v-3.11h21.25v3.11h-8.9v24.91Zm27.26-28.48c-8.32,0-13.9,6.22-13.9,14.49s5.59,14.49,13.9,14.49,13.9-6.22,13.9-14.49-5.63-14.49-13.9-14.49Zm0,25.87c-6.3,0-10.29-4.87-10.29-11.38s3.99-11.38,10.29-11.38,10.29,4.83,10.29,11.38-4.03,11.38-10.29,11.38Z"
                fill="#000"
              />
              <g clip-path="url(#hero-section-collectibles-path-en-mobile)" fill="none">
                <use transform="translate(.19 317.28) scale(.66)" xlink:href="#hero-section-gradient"/>
              </g>
            </g>
            <g
              v-else
              ref="heroSectionMobileTaglineParts"
            >
              <path
                d="m38.11,108.41h24.15v2.44h-24.15v-2.44Zm.8,13.52h22.81v2.14h-22.81v-2.14Zm.71,4.33h21.34v2.1h-21.34v-2.1Zm-2.02,4.45h24.91v2.35h-24.91v-2.35Zm10.79-25.24h3.19v4.16h-3.19v-4.16Zm-4.37,14.15h2.86v12.14h-2.86v-12.14Zm9.2,0h2.86v12.14h-2.86v-12.14Zm-5.12,11.68l2.39.76c-2.65,2.94-7.64,5.21-11.97,6.64-.29-.55-1.09-1.64-1.6-2.1,4.2-1.13,8.86-2.94,11.17-5.29Zm4.16.42c1.68,4.87,5.5,8.74,10.88,10.21-.63.55-1.43,1.55-1.81,2.27-5.67-1.89-9.58-6.17-11.47-11.93l2.39-.55Zm7.9,2.02l1.72,1.64c-1.89,1.39-4.45,2.65-6.38,3.49l-1.51-1.55c1.89-.88,4.62-2.48,6.17-3.57Zm-18.02-19.24v3.23h4.45v-3.23h-4.45Zm-2.39-1.97h9.37v7.14h-9.37v-7.14Zm14.03,1.97v3.23h4.58v-3.23h-4.58Zm-2.44-1.97h9.53v7.14h-9.53v-7.14Zm-25.62,5.67h10.79v2.52h-10.79v-2.52Zm.25-11.21h10.42v2.52h-10.42v-2.52Zm-.25,16.84h10.79v2.52h-10.79v-2.52Zm-1.72-11.34h13.57v2.6h-13.57v-2.6Zm3.19,17.01h9.28v12.22h-9.28v-2.6h6.64v-7.01h-6.64v-2.6Zm-1.55,0h2.6v14.2h-2.6v-14.2Zm13.78,11.76c3.53-.5,8.65-1.34,13.69-2.18l.17,2.35c-4.62.88-9.37,1.72-13.06,2.39l-.8-2.56Zm3.91-5.84l1.51-1.51,1.22.46v7.35h-2.73v-6.3Zm2.6,30.87h16.8v2.98h-16.8v-2.98Zm-21.76.38h18.44v2.98h-18.44v-2.98Zm23.06-8.19l3.15.5c-1.55,7.85-4.2,15.08-7.81,19.78-.55-.5-1.89-1.55-2.69-2.02,3.61-4.28,6.01-11.13,7.35-18.27Zm9.41,9.45l3.11.38c-2.35,14.91-7.39,23.65-18.98,28.85-.34-.71-1.26-2.14-1.81-2.77,11.05-4.45,15.67-12.68,17.68-26.46Zm-9.24,1.01c2.14,11.84,6.72,21.55,15.62,25.54-.76.63-1.72,1.85-2.18,2.69-9.28-4.62-13.86-14.7-16.3-27.72l2.86-.5Zm-15.54-10.46h3.19v20.37h-3.19v-20.37Zm-5.92,18.86h2.98v17.98h-2.98v-17.98Zm1.76,0h13.23v15.04h-13.23v-2.94h10.25v-9.11h-10.25v-2.98Zm64.34-18.86h3.19v35.11c0,1.97-.55,2.73-1.85,3.19-1.34.42-3.53.46-7.06.46-.17-.76-.67-1.93-1.09-2.65,2.52.08,5.04.04,5.8.04.76-.04,1.01-.29,1.01-1.05v-35.11Zm-16.42,3.36h36.46v2.6h-36.46v-2.6Zm7.39,7.31v3.02h21.67v-3.02h-21.67Zm-2.98-2.18h27.85v7.43h-27.85v-7.43Zm-1.22,10.37h29.69v15.29h-3.15v-12.94h-26.54v-2.35Zm-3.99,5.25h38.05v2.52h-38.05v-2.52Zm3.57,5.71h28.6v2.44h-28.6v-2.44Z"
                fill="#000"
              />
              <path
                d="m29.54,257.22h10.46v2.94h-10.46v-2.94Zm9.2,0h3.07v1.34c-.21,9.49-.46,13.02-1.34,14.2-.67.76-1.34,1.05-2.52,1.18-1.09.13-2.98.08-5.04,0-.08-.92-.42-2.14-.88-2.94,1.89.17,3.74.17,4.45.17.59,0,1.01-.04,1.3-.42.63-.76.84-3.91.97-12.98v-.55Zm11.84-13.61l1.89-1.97c2.6,1.34,5.92,3.36,7.56,4.83l-1.97,2.14c-1.6-1.47-4.83-3.61-7.48-5Zm6.01,11.38l3.15.76c-3.57,10.96-9.83,19.07-18.44,24.15-.46-.63-1.64-1.93-2.31-2.56,8.53-4.54,14.45-12.22,17.6-22.34Zm-26.8-6.38h32.51v3.11H29.8v-3.11Zm-2.02,0h3.28v11.84c0,5.96-.67,14.45-4.49,19.95-.55-.63-1.89-1.72-2.65-2.1,3.49-5.17,3.86-12.39,3.86-17.89v-11.8Zm17.43-7.06h3.28c-.08,19.32,4.03,35.07,9.49,35.07,1.18,0,1.72-2.18,1.97-7.77.71.71,1.89,1.43,2.73,1.72-.59,7.18-1.76,9.24-4.96,9.24-8.57,0-12.35-18.14-12.52-38.26Zm36.41,22.3h28.6v2.77h-28.6v-2.77Zm-5.42-15.16h27.47v2.9h-27.47v-2.9Zm11.84,7.56h19.24v2.81h-19.24v-2.81Zm20.83,7.6h3.15s-.04.92-.13,1.39c-.76,8.86-1.55,12.35-2.9,13.73-.8.8-1.6,1.09-2.86,1.18-1.05.08-3.15.04-5.33-.04-.04-.88-.38-2.1-.88-2.94,2.1.25,4.12.25,4.91.25s1.22-.08,1.6-.42c.97-.97,1.76-4.28,2.44-12.64v-.5Zm-9.32,5.04l2.23-.84c1.34,1.72,2.65,4.07,3.19,5.59l-2.31.97c-.55-1.51-1.85-3.95-3.11-5.71Zm-18.14-26.17l2.73-1.13c1.64,1.68,3.49,4.07,4.33,5.67l-2.94,1.34c-.71-1.64-2.48-4.12-4.12-5.88Zm5.71,27.22l2.56-.34c.84,2.65,1.3,6.13,1.3,8.4l-2.77.38c.08-2.27-.38-5.71-1.09-8.44Zm6.17-.38l2.48-.59c1.09,2.31,2.14,5.29,2.48,7.27l-2.6.71c-.29-2.02-1.3-5.08-2.35-7.39Zm-11.55-.59l2.65.88c-.97,3.49-2.44,7.48-5,10.04l-2.44-1.72c2.35-2.23,3.95-5.96,4.79-9.2Zm12.39-27.51l3.19.8c-3.82,11.76-10.42,22.85-21.55,29.44-.38-.76-1.18-2.02-1.72-2.69,10.42-5.92,16.88-16.67,20.08-27.55Zm8.82,7.22h2.98c-.59,2.9-1.34,6.38-1.97,8.65l-2.77-.38c.59-2.23,1.3-5.59,1.76-8.27Zm3.15,7.56h2.98c-.59,2.9-1.3,6.43-1.89,8.69l-2.86-.34c.63-2.27,1.34-5.67,1.76-8.36Z"
                fill="#000"
              />
              <g clip-path="url(#hero-section-collectibles-path-zh-mobile)" fill="none">
                <use transform="translate(91.39 318.76) scale(.29 .66)" xlink:href="#hero-section-gradient"/>
              </g>
            </g>
          </svg>
          <div class="absolute inset-x-0 bottom-[50%]">
            <div
              ref="heroSectionMobileAllStoryMattersDescription"
              :class="[
                'absolute',
                'inset-x-0',
                'bottom-[50%]',
                'flex',
                'flex-col',
                'justify-center',
                'mr-[2.5rem]',
                'mb-[2.5rem]',
              ]"
            >
              <h2 class="text-[1rem] font-[600]">{{ $t('index_page_hero_all_stories_matter_heading') }}</h2>
              <p class="mt-[0.5rem] text-[1rem]">{{ $t('index_page_hero_all_stories_matter_content') }}</p>
            </div>
            <svg
              ref="heroSectionMobileAllStoryMattersIndicator"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 308 2"
            >
              <defs>
                <linearGradient id="hero-section-mobile-indicator-fill" x1="1" y1="656.85" x2="308" y2="656.85" gradientTransform="translate(0 657.85) scale(1 -1)" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#000" stop-opacity=".04"/>
                  <stop offset=".88" stop-color="#000"/>
                  <stop offset="1" stop-color="#000" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="m1,0C.45,0,0,.45,0,1s.45,1,1,1V0Zm0,2h307V0H1v2Z" fill="url(#hero-section-mobile-indicator-fill)"/>
            </svg>
            <div
              ref="heroSectionMobileWritingNFTDescription"
              :class="[
                'absolute',
                'inset-x-0',
                'top-[50%]',
                'translate-y-[-70%]',
                'flex',
                'flex-col',
                'justify-center',
                'mr-[1rem]',
                'ml-[5rem]',
              ]"
            >
              <div class="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 316.05 54.12"
                >
                  <defs>
                    <clipPath id="hero-section-mobile-writing-nft-path">
                      <path d="m43.56,42.36h-9.06l-7.02-27.48-6.96,27.48h-9.06L0,2.34h9.54l7.02,28.92L24.18,2.34h6.66l7.56,28.92,6.96-28.92h9.6l-11.4,40.02Zm20.44,0h-7.62V13.38h7.62v3.96c2.04-2.58,5.64-4.62,9.24-4.62v7.44c-.54-.12-1.26-.18-2.1-.18-2.52,0-5.88,1.38-7.14,3.24v19.14Zm17.18-33.24c-2.46,0-4.56-2.04-4.56-4.56s2.1-4.56,4.56-4.56,4.56,2.04,4.56,4.56-2.04,4.56-4.56,4.56Zm3.84,33.24h-7.62V13.38h7.62v28.98Zm16.68.72c-5.34,0-8.22-2.76-8.22-7.92v-15.12h-4.8v-6.66h4.8v-7.92h7.68v7.92h5.88v6.66h-5.88v13.08c0,1.8.96,3.18,2.64,3.18,1.14,0,2.22-.42,2.64-.84l1.62,5.76c-1.14,1.02-3.18,1.86-6.36,1.86Zm13.73-33.96c-2.46,0-4.56-2.04-4.56-4.56s2.1-4.56,4.56-4.56,4.56,2.04,4.56,4.56-2.04,4.56-4.56,4.56Zm3.84,33.24h-7.62V13.38h7.62v28.98Zm34.14,0h-7.62v-17.52c0-4.02-2.1-5.4-5.34-5.4-3,0-5.34,1.68-6.6,3.42v19.5h-7.62V13.38h7.62v3.78c1.86-2.22,5.4-4.5,10.14-4.5,6.36,0,9.42,3.6,9.42,9.24v20.46Zm6.37,7.44l3.42-5.52c2.34,2.58,5.4,3.6,9.06,3.6s7.98-1.62,7.98-7.32v-2.94c-2.28,2.88-5.4,4.56-8.94,4.56-7.26,0-12.78-5.1-12.78-14.76s5.46-14.76,12.78-14.76c3.48,0,6.6,1.5,8.94,4.44v-3.72h7.68v27c0,11.04-8.52,13.74-15.66,13.74-4.98,0-8.88-1.14-12.48-4.32Zm20.46-17.7v-9.36c-1.26-1.92-4.02-3.3-6.54-3.3-4.32,0-7.32,3-7.32,7.98s3,7.98,7.32,7.98c2.52,0,5.28-1.44,6.54-3.3Zm65.39,10.26h-8.22l-19.08-26.88v26.88h-8.52V2.34h8.76l18.54,25.92V2.34h8.52v40.02Zm15.81,0h-8.52V2.34h28.32v7.32h-19.8v8.7h19.38v7.32h-19.38v16.68Zm42.98,0h-8.58V9.84h-11.7V2.34h31.92v7.5h-11.64v32.52Z" fill="none"/>
                    </clipPath>
                  </defs>
                  <g clip-path="url(#hero-section-mobile-writing-nft-path)" fill="none">
                    <image
                      width="500"
                      height="333"
                      transform="translate(-.04 -82.09) scale(.64)"
                      xlink:href="~assets/images/index/gradient-1.jpg"
                    />
                  </g>
                </svg>
                <p class="mt-[0.5rem] text-[1rem]">{{ $t('index_page_hero_writing_nft_content') }}</p>
                <nav
                  ref="heroSectionMobileCTA"
                  :class="[
                    'absolute',
                    'top-full',
                    'inset-x-0',
                    'flex',
                    'flex-col',
                    'justify-center',
                    'items-center',
                    'gap-[1rem]',
                    'mt-[1.5rem]',
                    'mr-[4rem]',
                  ]"
                >
                  <ButtonV2
                    :text="$t('index_page_hero_try_collect_button')"
                    preset="secondary"
                    :to="localeLocation({ name: 'store' })"
                    @click.native="handleTryCollectButtonClickInHeroSection"
                  />
                  <ButtonV2
                    :text="$t('index_page_hero_publish_story_button')"
                    :href="publishStoryURL"
                    preset="tertiary"
                    @click.native="handlePublishStoryButtonClickInHeroSection"
                  />
                </nav>
              </div>
            </div>
          </div>
        </div>

        <svg
          ref="heroSectionScrollHint"
          class="fixed inset-x-0 bottom-0 w-[20px] mx-auto mb-[1rem] animate-bounce"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="m19.45.51l-9.45,9.45L.55.51m18.89,9.54l-9.45,9.45L.55,10.05"
            fill="none"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
          />
        </svg>
      </div>
    </section>

    <section
      id="about-liker-land"
      ref="likerLandSection"
      class="relative bg-fixed pt-[3.5rem]"
      :style="heroSectionStyle"
    >
      <div class="bg-[#0F3339]">
        <div :class="['py-[5rem]', sectionContentClassWithPadding]">
          <div ref="likerLandSectionContent">
            <Logo class="w-[130px] fill-white" />
            <p
              :class="[
                'text-like-cyan-light',
                'max-w-[392px]',
                'mt-[1em]',
              ]"
            >{{ $t('index_page_liker_land_description') }}</p>
          </div>
          <div
            :class="[
              'relative',
              'flex',
              'items-center',
              'justify-end',
              'my-[1rem]',
              'laptop:-mt-[104px]',
              'desktop:-mb-[80px]'
            ]"
          >
            <svg
              :class="[
                'w-full',
                'h-full',
                'max-w-[470px]',
                'max-h-[331px]',
              ]"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 470 331"
            >
              <defs>
                <linearGradient id="stroke-gradient" x1="-1336" y1="914.5" x2="-1037" y2="914.5" gradientTransform="translate(-921 -749) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#df9cd0"/>
                  <stop offset=".3" stop-color="#7bfdd7"/>
                  <stop offset=".61" stop-color="#81e3c6"/>
                  <stop offset="1" stop-color="#809cdc"/>
                </linearGradient>
                <linearGradient id="stroke-gradient-2" x1="-1352" x2="-1053" gradientTransform="translate(-953 -749) rotate(-180) scale(1 -1)" xlink:href="#stroke-gradient"/>
                <linearGradient id="stroke-gradient-3" x1="-1368" x2="-1069" gradientTransform="translate(-985 -749) rotate(-180) scale(1 -1)" xlink:href="#stroke-gradient"/>
                <linearGradient id="stroke-gradient-4" x1="-1384" x2="-1085" gradientTransform="translate(-1017 -749) rotate(-180) scale(1 -1)" xlink:href="#stroke-gradient"/>
                <linearGradient id="stroke-gradient-5" x1="-1400" x2="-1101" gradientTransform="translate(-1049 -749) rotate(-180) scale(1 -1)" xlink:href="#stroke-gradient"/>
                <linearGradient id="stroke-gradient-6" x1="-1416" x2="-1117" gradientTransform="translate(-1081 -749) rotate(-180) scale(1 -1)" xlink:href="#stroke-gradient"/>
                <linearGradient id="stroke-gradient-7" x1="-1432" x2="-1133" gradientTransform="translate(-1113 -749) rotate(-180) scale(1 -1)" xlink:href="#stroke-gradient"/>
                <linearGradient id="stroke-gradient-8" x1="-1448" x2="-1149" gradientTransform="translate(-1145 -749) rotate(-180) scale(1 -1)" xlink:href="#stroke-gradient"/>
              </defs>
              <image
                ref="likerLandSectionPortalImage"
                width="331"
                height="331"
                transform="translate(139)"
                xlink:href="~assets/images/index/gradient-2.png"
              />
              <g ref="likerLandSectionPortalGroup">
                <circle cx="265.5" cy="165.5" r="149" fill="none" stroke="url(#stroke-gradient)"/>
                <circle cx="249.5" cy="165.5" r="149" fill="none" stroke="url(#stroke-gradient-2)"/>
                <circle cx="233.5" cy="165.5" r="149" fill="none" stroke="url(#stroke-gradient-3)"/>
                <circle cx="217.5" cy="165.5" r="149" fill="none" stroke="url(#stroke-gradient-4)"/>
                <circle cx="201.5" cy="165.5" r="149" fill="none" stroke="url(#stroke-gradient-5)"/>
                <circle cx="185.5" cy="165.5" r="149" fill="none" stroke="url(#stroke-gradient-6)"/>
                <circle cx="169.5" cy="165.5" r="149" fill="none" stroke="url(#stroke-gradient-7)"/>
                <circle cx="153.5" cy="165.5" r="149" fill="none" stroke="url(#stroke-gradient-8)"/>
              </g>
            </svg>
            <svg
              ref="likerLandSectionSignature"
              :class="[
                'absolute',
                'right-[40%]',
                'w-full',
                'max-w-[487px]',
              ]"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 487 94.61"
            >
              <defs>
                <linearGradient
                  id="signature-gradient"
                  x1="485.5"
                  y1="1014.7"
                  x2="-3.14"
                  y2="1014.7"
                  gradientTransform="translate(0 1062) scale(1 -1)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop ref="likerLandSectionSignatureGradientStart" offset="0" stop-color="#50e3c2" stop-opacity="0"/>
                  <stop offset=".09" stop-color="#50e3c2"/>
                  <stop offset="1" stop-color="#50e3c2" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path
                d="m1.5,86.52c26.33-6.31,52.86-12.3,79.44-17.44,5.4-1.04,10.79-2.25,16.28-2.61,1.31-.09,3.53-.02,3.72,1.28.27,1.85-6.96,8.27-8.44,9.67-.51.48-1.96,1.16-1.39,1.56,2.25,1.58,13.56-1.77,14.06-1.89,26.26-6.24,52.2-14.12,78.28-21.06,29.6-7.88,59.3-16.46,89.56-21.5,23.37-3.9,1.5,4.52-4.72,9.89-6.56,5.65-14.43,17.3-7.83,25.78,9.14,11.76,35.05,10.79,47.83,9.56,13.41-1.3,23.75-7.14,28.22-20.33,5.55-16.39,1.55-32.86-12.94-42.89-14.25-9.86-43.45-20.63-60.61-11.67-13.71,7.16.88,25.25,7.33,30.95,22.34,19.71,53.57,29.96,81.39,38.61,21.55,6.71,39.73,11.38,61.89,15.11,17.87,3.01,37.57,5.49,55.61,1.56,6.9-1.51,12.04-5.39,14.67-11.83.6-1.48.39-2.09,1.67-2.72"
                fill="none"
                stroke="url(#signature-gradient)"
                stroke-linecap="round"
                stroke-width="3"
              />
            </svg>
          </div>
          <IndexPageQuote
            ref="likerLandSectionQuote"
            :class="[
              'relative',
              'text-like-cyan',
              'max-w-[650px]',
            ]"
            :text="$t('index_page_liker_land_quote')"
            :author="$t('index_page_liker_land_quote_author')"
            :author-title="$t('index_page_liker_land_quote_author_title')"
          />
        </div>
      </div>
    </section>

    <section
      id="nft-book"
      ref="nftBookSection"
      class="overflow-hidden"
    >
      <div :class="['relative', sectionContentClassWithPadding]">

        <img
          :class="[
            'absolute',
            'bottom-0',
            'right-0',
            'hidden laptop:block',
            'translate-y-[25%]',
            'pointer-events-none',
            'opacity-50',
          ]"
          src="~assets/images/index/bg-bubble.svg"
          alt=""
        />

        <div :class="['laptop:flex', 'flex-row-reverse', 'laptop:justify-between']">
          <div
            ref="nftBookSectionContent"
            :class="[
              'laptop:max-w-[328px]',
              'laptop:-ml-[12rem]',
              'mt-[3.5rem] laptop:mt-[5rem]',
            ]"
          >
            <h2
              :class="[
                'text-[1rem]',
                'font-[600]',
                'text-like-green',
                'whitespace-pre-line',
              ]"
            >{{ $t('index_page_nft_book_heading').replaceAll(/\\n/g, '\n') }}</h2>
            <p class="text-[1rem] mt-[0.5rem]">{{ $t('index_page_nft_book_content') }}</p>
          </div>

          <div
            :class="[
              'relative',
              'laptop:w-full',
              'max-w-[645px]',
              'translate-x-[12%] laptop:translate-x-0',
              'mt-[3rem] laptop:mt-0',
              'mx-auto',
              '-mb-[5rem] laptop:-mb-[12rem]',
            ]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 646 822.12"
            >
              <defs>
                <linearGradient id="nft-book-ray-gradient-1" x1="240" y1="689" x2="443" y2="436" gradientTransform="translate(0 1062) scale(1 -1)" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#e0b3af" stop-opacity=".1"/>
                  <stop offset=".38" stop-color="#f266a0" stop-opacity=".5"/>
                  <stop offset=".73" stop-color="#d65fec" stop-opacity=".8"/>
                  <stop offset=".97" stop-color="#ad66ec"/>
                </linearGradient>
                <linearGradient id="nft-book-ray-gradient-2" x1="341" y1="537" x2="544" y2="284" xlink:href="#nft-book-ray-gradient-1"/>
                <linearGradient id="nft-book-ray-gradient-3" x1="442" y1="522" x2="645" y2="269" xlink:href="#nft-book-ray-gradient-1"/>
              </defs>
              <g class="rotate-[39deg] laptop:rotate-0 origin-[238px_371px]">
                <g ref="nftBookSectionRayGroup">
                  <path
                    d="m240.78,372.37c-.35-.43-.98-.5-1.41-.15s-.5.98-.15,1.41l1.56-1.25Zm-1.56,1.25l203,253,1.56-1.25-203-253-1.56,1.25Z"
                    fill="url(#nft-book-ray-gradient-1)"
                  />
                  <path
                    d="m341.78,524.37c-.35-.43-.98-.5-1.41-.15-.43.35-.5.98-.15,1.41l1.56-1.25Zm-1.56,1.25l203,253,1.56-1.25-203-253-1.56,1.25Z"
                    fill="url(#nft-book-ray-gradient-2)"
                  />
                  <path
                    d="m442.78,539.37c-.35-.43-.98-.5-1.41-.15-.43.35-.5.98-.15,1.41l1.56-1.25Zm-1.56,1.25l203,253,1.56-1.25-203-253-1.56,1.25Z"
                    fill="url(#nft-book-ray-gradient-3)"
                  />
                </g>
              </g>
            </svg>
            <svg
              ref="nftBookSectionPortalGradient"
              class="absolute inset-0 blur-[10px]"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 646 822.12"
            >
              <defs>
                <clipPath id="nft-book-portal-gradient-clip-path">
                  <path d="m403.74,230.51h0c41.36,49.29,34.93,122.78-14.36,164.13l-125.61,105.4c-49.29,41.36-122.78,34.93-164.13-14.36h0c-41.36-49.29-34.93-122.78,14.36-164.13l125.61-105.4c49.29-41.36,122.78-34.93,164.13,14.36Z" fill="none"/>
                </clipPath>
              </defs>
              <g clip-path="url(#nft-book-portal-gradient-clip-path)" fill="none">
                <image width="500" height="333" transform="translate(-179.27 240.52) rotate(-40) scale(1.5)" xlink:href="~assets/images/index/gradient-1.jpg"/>
              </g>
            </svg>
            <svg
              class="absolute inset-0"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 646 822.12"
            >
              <defs>
                <linearGradient id="nft-book-word-rain-gradient-1" x1="236" y1="833.94" x2="236" y2="962.94" gradientTransform="translate(0 1062) scale(1 -1)" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#000"/>
                  <stop offset="1" stop-color="#000" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="nft-book-word-rain-gradient-2" xlink:href="#nft-book-word-rain-gradient-1" x1="291" y1="752.94" x2="291" y2="881.94" />
                <linearGradient id="nft-book-word-rain-gradient-3" xlink:href="#nft-book-word-rain-gradient-1" x1="265" y1="658.94" x2="265" y2="787.94" />
                <linearGradient id="nft-book-word-rain-gradient-4" xlink:href="#nft-book-word-rain-gradient-1" x1="326" y1="931.94" x2="326" y2="1060.94" />
                <linearGradient id="nft-book-word-rain-gradient-5" xlink:href="#nft-book-word-rain-gradient-1" x1="130.5" y1="653.94" x2="130.5" y2="782.94" />
              </defs>
              <path
                ref="nftBookSectionPortalFrame"
                d="m378.52,230.86h0c41.17,49.07,34.77,122.22-14.3,163.39l-125.58,105.37c-49.07,41.17-122.22,34.77-163.39-14.3h0c-41.17-49.07-34.77-122.22,14.3-163.39l125.58-105.37c49.07-41.17,122.22-34.77,163.39,14.3Z"
                fill="none"
                stroke="#4a4a4a"
                stroke-miterlimit="4"
                stroke-width="1"
              />
              <g ref="nftBookSectionWordRainGroup">
                <g>
                  <path d="m239.04,249.83l-1.22-.7.53-3.86-6.76-3.9-3.08,2.39-1.22-.7,12.54-9.71,1.35.78-2.14,15.71Zm-.46-5.75l1.3-9.29-7.37,5.78,6.08,3.51Z"/>
                  <path fill="none" stroke="url(#nft-book-word-rain-gradient-1)" stroke-linecap="round" d="m236,227V99" />
                </g>
                <g>
                  <path d="m296.41,316.52l.84.74c-2.07,2.21-4.44,3.98-6.66,4.76-.07-.27-.31-.8-.46-1.08,2.14-.65,4.37-2.34,6.27-4.42Zm3.86,5.76l1.01.59s-.25.4-.36.54c-4.47,6.92-6.22,9.15-7.3,9.55-.55.23-.9.19-1.41-.04-.43-.19-1.11-.6-1.77-1.04.16-.32.31-.82.3-1.2.7.49,1.35.86,1.65,1.03.25.14.45.2.74.09.87-.29,2.7-2.58,6.99-9.27l.14-.25Zm-5.61-3.24l6.03,3.48-.57.98-6.45-3.73.99-.74Zm1.51,1.27l.56.86c-2.3,2.39-5.59,4.65-8.28,5.16-.08-.33-.27-.78-.47-1.1,2.67-.37,5.92-2.55,8.18-4.92Zm2.18,1.36l.62.88c-3.22,3.77-7.47,7.07-11.31,7.64-.09-.34-.31-.83-.54-1.16,3.85-.37,8.06-3.62,11.23-7.36Zm-14.77-.98c1.69.46,4.28,1.08,6.78,1.65l-.39,1c-2.35-.5-4.83-1.06-6.68-1.47l.29-1.18Zm7.93-6.98l.98.57-8.23,14.26-.98-.57,8.23-14.26Zm-2.42-.21l.84.67c-1.46,1.95-3.05,3.81-4.43,4.86-.11-.23-.39-.7-.55-.92,1.37-1,2.84-2.79,4.14-4.61Zm-1.29,2.35l4.51,2.6-.59,1.01-4.66-2.69.74-.92Z"/>
                  <path fill="none" stroke="url(#nft-book-word-rain-gradient-2)" stroke-linecap="round" d="m291,308v-128" />
                </g>
                <g>
                  <path d="m269.34,413.14c-1.15,1.52-2.5,3.17-3.94,4.52-2.8,2.66-4.94,3.55-6.34,2.74-1.32-.77-1.81-3.08-.33-5.66,1.93-3.35,6.61-4.56,10.38-2.39,3.62,2.09,4.43,5.97,2.63,9.09-1.89,3.27-5.3,4.17-9.23,2.53l-.04-1.41c.49.24,1.01.44,1.42.57,2.25.72,5.15.4,6.76-2.38,1.45-2.51.9-5.63-2.14-7.39-3.46-2-7.3-.43-8.65,1.91-1.18,2.04-.74,3.48-.02,3.89.75.43,2.23-.12,4.62-2.38,1.33-1.23,2.67-2.78,3.74-4.32l1.14.68Z"/>
                  <path fill="none" stroke="url(#nft-book-word-rain-gradient-3)" stroke-linecap="round" d="m265,402v-128" />
                </g>
                <g>
                  <path d="m325.44,139.03c.93.54,1.61,1.1,2.04,1.69.42.59.6,1.24.54,1.97-.06.72-.36,1.54-.9,2.47l-4.85,8.4-1.4-.81,4.86-8.42c.54-.93.73-1.7.57-2.31-.15-.6-.69-1.17-1.62-1.71l-2.11-1.22-1.52,2.63,1.86,1.07-.75,1.29-3.27-1.89,3.01-5.22,3.54,2.04Z"/>
                  <path fill="none" stroke="url(#nft-book-word-rain-gradient-4)" stroke-linecap="round" d="m326,129V1" />
                </g>
                <g>
                  <path d="m122.95,423.71l2.09-3.62c.46-.8.97-1.27,1.53-1.43.57-.16,1.17-.16,1.79.02l.05-.05-1.63-2.01.36-.63c.3-.52.75-.91,1.36-1.17.61-.27,1.32-.36,2.12-.28.82.08,1.67.38,2.56.89.77.45,1.42.99,1.93,1.62.52.62.82,1.31.91,2.08.1.76-.09,1.56-.58,2.41l-4.06,7.03-1.7-.98,3.96-6.86c.49-.85.58-1.6.26-2.26-.29-.66-.82-1.21-1.57-1.64-.77-.45-1.49-.64-2.13-.57-.64.05-1.1.33-1.39.82l1.46,2.22-.68.83c-.47-.27-.97-.35-1.51-.24-.52.11-.97.5-1.36,1.17l-2.09,3.62-1.7-.98Z"/>
                  <path fill="none" stroke="url(#nft-book-word-rain-gradient-5)" stroke-linecap="round" d="m130.5,407v-128" />
                </g>
              </g>
              <g ref="nftBookSectionBook">
                <image width="158" height="228" transform="translate(44.99 75)" xlink:href="~assets/images/index/nft-book-cover.jpg"/>
                <path fill="none" stroke="#000" stroke-miterlimit="10" d="m196.82,80.2H39.8v227.92h157.01V80.2Z" />
                <path fill="none" stroke="#000" stroke-miterlimit="10" d="m29.44,90.61v227.92h157.01" />
                <path fill="none" stroke="#000" stroke-miterlimit="10" d="m186.46,80.2v227.92" />
                <path fill="none" stroke="#000" stroke-miterlimit="10" d="m34.62,85.41v227.92h157.01" />
                <path fill="none" stroke="#000" stroke-miterlimit="10" d="m196.82,308.13l-15.55,15.61H24.26V95.82l15.55-15.61" />
              </g>
            </svg>
          </div>

        </div>

        <NFTBookItemCard
          :class-id="featuredNFTBookClassId"
          preset="campaign"
          @click.native="handleBookItemCardClickInNFTBookSection"
          @click-avatar="handleAuthorClickInNFTBookSection"
        />

        <IndexPageQuote
          class="text-black max-w-[650px] mx-auto mt-[5rem]"
          :text="$t('index_page_nft_book_quote')"
          :author="$t('index_page_nft_book_quote_author')"
          :author-title="$t('index_page_nft_book_quote_author_title')"
        />

        <footer class="flex flex-col items-center gap-[1rem] mt-[3rem] mb-[6rem]">
          <ButtonV2
            :text="$t('index_page_nft_book_cta_button')"
            :to="localeLocation({ name: 'store' })"
            preset="tertiary"
            @click.native="handleCTAClickInNFTBookSection"
          />
        </footer>

      </div>
    </section>

    <section id="new-culture">
      <IndexPageHeading :text="$t('index_page_new_culture_heading')" />

      <div :class="['relative', sectionContentClass]">
        <div class="hidden laptop:block absolute inset-x-0 -top-[2rem] px-[2rem]">
          <div ref="fansKeyArt" class="relative">
            <svg
              class="blur-[10px]"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 920 428"
            >
              <defs>
                <linearGradient
                  id="fans-bg-gradient-1"
                  x1="18.79"
                  y1="-919.85"
                  x2="85.79"
                  y2="-1002.85"
                  gradientTransform="translate(0 -707.6) scale(1 -1)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".09" stop-color="#8f7fcd"/>
                  <stop offset=".29" stop-color="#b596cc"/>
                  <stop offset=".63" stop-color="#e0a5a6"/>
                  <stop offset=".92" stop-color="#febca0"/>
                </linearGradient>
                <linearGradient
                  id="fans-bg-gradient-2"
                  x1="106.79"
                  y1="-718.85"
                  x2="173.79"
                  y2="-801.85"
                  gradientTransform="translate(0 -707.6) scale(1 -1)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".09" stop-color="#f270cf"/>
                  <stop offset=".29" stop-color="#fa73ae"/>
                  <stop offset=".63" stop-color="#fa94a6"/>
                  <stop offset=".92" stop-color="#f9b5b6"/>
                </linearGradient>
                <linearGradient
                  id="fans-bg-gradient-3"
                  x1="628.79"
                  y1="-1043.85"
                  x2="695.79"
                  y2="-1126.85"
                  gradientTransform="translate(0 -707.6) scale(1 -1)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".09" stop-color="#ff98b1"/>
                  <stop offset=".29" stop-color="#fc98b0"/>
                  <stop offset=".63" stop-color="#ffc5c1"/>
                  <stop offset=".92" stop-color="#ffe7e2"/>
                </linearGradient>
                <linearGradient
                  id="fans-bg-gradient-4"
                  x1="704.79"
                  y1="-752.85"
                  x2="771.79"
                  y2="-835.85"
                  gradientTransform="translate(0 -707.6) scale(1 -1)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".09" stop-color="#8482e4"/>
                  <stop offset=".29" stop-color="#a67ada"/>
                  <stop offset=".63" stop-color="#c888e2"/>
                  <stop offset=".92" stop-color="#f5b8d9"/>
                </linearGradient>
                <linearGradient
                  id="fans-bg-gradient-5"
                  x1="836.79"
                  y1="-854.85"
                  x2="903.79"
                  y2="-937.85"
                  gradientTransform="translate(0 -707.6) scale(1 -1)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".09" stop-color="#ef9999"/>
                  <stop offset=".29" stop-color="#f5b996"/>
                  <stop offset=".63" stop-color="#fad3a3"/>
                  <stop offset=".92" stop-color="#fbf1bb"/>
                </linearGradient>
              </defs>
              <circle
                v-for="(props, index) in fanSymbolBgs"
                ref="fanSymbolBg"
                :key="`fans-bg-${index}`"
                :fill="`url(#fans-bg-gradient-${index + 1})`"
                r="49.51"
                v-bind="props"
              />
            </svg>
            <svg
              class="absolute inset-0"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 920 428"
            >
              <g
                v-for="(symbol, index) in fanSymbols"
                ref="fanSymbols"
                :key="`fan-symbol-${index}`"
              >
                <path
                  :d="`m${symbol.bodyPath}c0-17.38-14.09-31.47-31.47-31.47s-31.47,14.09-31.47,31.47`"
                  fill="none"
                  fill-rule="evenodd"
                  stroke="#000"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                />
                <g ref="fanSymbolHeadFilled">
                  <path :d="symbol.head.glowing.fillPath" fill="#fff"/>
                  <path :d="symbol.head.glowing.strokePath" fill="none" stroke="#000"/>
                </g>
                <circle
                  ref="fanSymbolHeadPlain"
                  :cx="symbol.head.cx"
                  :cy="symbol.head.cy"
                  r="15.7"
                  fill="none"
                  stroke="#000"
                />
                <circle
                  :cx="symbol.frame.cx"
                  :cy="symbol.frame.cy"
                  r="44.06"
                  fill="none"
                  stroke="#000"
                />
              </g>
            </svg>
          </div>
        </div>

        <IndexPageHeadingContentWithCTA
          ref="fansKeyArtTrigger"
          class="relative"
          :heading="$t('index_page_new_culture_section_1_heading')"
          :content="$t('index_page_new_culture_section_1_content')"
        >
          <template #image>
            <img
              class="laptop:hidden max-w-[262px]"
              src="~assets/images/index/grow-your-open-content.png"
            />
          </template>
          <template #append>
            <ButtonV2
              :text="$t('index_page_new_culture_section_1_cta_button')"
              preset="tertiary"
              :to="localeLocation({ name: 'writing-nft-about' })"
              @click.native="handleAboutWritingNFTButtonClickInNewCultureSection"
            />
          </template>
        </IndexPageHeadingContentWithCTA>

        <IndexPageHeadingContentWithCTA
          class="relative"
          :heading="$t('index_page_new_culture_section_2_heading')"
          :content="$t('index_page_new_culture_section_2_content')"
        >
          <template #image>
            <img
              class="laptop:hidden max-w-[276px]"
              src="~assets/images/index/cultivate-readers-into-fans.png"
            />
          </template>
          <template #append>
            <ButtonV2
              :text="$t('index_page_new_culture_section_2_cta_button')"
              preset="tertiary"
              :to="localeLocation({ name: 'store' })"
              @click.native="handleTryCollectButtonClickInNewCultureSection"
            />
          </template>
        </IndexPageHeadingContentWithCTA>

        <svg
          class="hidden laptop:block absolute w-[680px] right-[1024px] bottom-0 translate-x-[100%] mr-[10%] blur-[10px]"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 680 660"
        >
          <defs>
            <linearGradient
              id="tech-fill-gradient"
              x1="1084.22"
              y1="-713.01"
              x2="734.34"
              y2="-920.07"
              gradientTransform="translate(-96.79 -831.81) rotate(30) scale(1 -1)"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#98e9ff" offset="0" />
              <stop stop-color="#7ae9ea" offset=".07" />
              <stop stop-color="#9bffd4" offset=".35" />
              <stop stop-color="#86f5c5" offset=".51" />
              <stop stop-color="#80c4f5" offset=".79" />
              <stop stop-color="#b9aefb" offset="1" />
            </linearGradient>
          </defs>
          <g class="animate-spin origin-center" style="animation-duration: 10s;">
            <rect x="-12.09" y="226.18" width="576.22" height="207.65" rx="103.82" ry="103.82" transform="translate(-147.78 404.04) rotate(-60)" fill="url(#tech-fill-gradient)"/>
          </g>
        </svg>
        <svg
          class="hidden laptop:block absolute w-[680px] right-[1024px] bottom-0 translate-x-[100%] mr-[10%]"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 680 660"
        >
          <defs>
            <linearGradient
              id="tech-stroke-gradient-1"
              x1="834.18"
              y1="-815.39"
              x2="1072.18"
              y2="-809.61"
              gradientTransform="translate(1123.36 -606) rotate(90) scale(1 -1)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color="#4a4a4a"/>
              <stop offset="1" stop-color="#4a4a4a" stop-opacity="0"/>
            </linearGradient>
            <linearGradient
              id="tech-stroke-gradient-2"
              x1="864.49"
              y1="-797.89"
              x2="1102.49"
              y2="-792.11"
              gradientTransform="translate(1140.86 -636.31) rotate(90) scale(1 -1)"
              xlink:href="#tech-stroke-gradient-1"
            />
            <linearGradient
              id="tech-stroke-gradient-3"
              x1="894.8"
              y1="-780.39"
              x2="1132.8"
              y2="-774.61"
              gradientTransform="translate(1158.36 -666.62) rotate(90) scale(1 -1)"
              xlink:href="#tech-stroke-gradient-1"
            />
          </defs>
          <g class="animate-spin origin-center" style="animation-duration: 10s;">
            <rect y="226.18" width="576.22" height="207.65" rx="103.82" ry="103.82" fill="none" stroke="url(#tech-stroke-gradient-1)" stroke-miterlimit="4" stroke-width="1" x="22.34" transform="translate(-130.57 433.85) rotate(-60)" />
          </g>
          <g class="animate-spin origin-center" style="animation-duration: 10s;">
            <rect y="226.18" width="576.22" height="207.65" rx="103.82" ry="103.82" fill="none" stroke="url(#tech-stroke-gradient-2)" stroke-miterlimit="4" stroke-width="1" x="59.22" transform="translate(-113.07 464.17) rotate(-60)" />
          </g>
          <g class="animate-spin origin-center" style="animation-duration: 10s;">
            <rect y="226.18" width="576.22" height="207.65" rx="103.82" ry="103.82" fill="none" stroke="url(#tech-stroke-gradient-3)" stroke-miterlimit="4" stroke-width="1" x="94.88" transform="translate(-94.29 496.68) rotate(-60)" />
          </g>
        </svg>

        <IndexPageHeadingContentWithCTA
          class="relative"
          :heading="$t('index_page_new_culture_section_3_heading')"
          :content="$t('index_page_new_culture_section_3_content')"
        >
          <template #image>
            <img
              class="laptop:hidden max-w-[189px]"
              src="~assets/images/index/we-handle-the-tech-for-you.png"
            />
          </template>
          <template #append>
            <ButtonV2
              :text="$t('index_page_new_culture_section_3_cta_button')"
              :href="publishStoryURL"
              preset="tertiary"
              @click.native="handlePublishStoryButtonClickInNewCultureSection"
            />
          </template>
        </IndexPageHeadingContentWithCTA>
      </div>
    </section>

    <section id="all-story-matters">
      <IndexPageHeading :text="$t('index_page_all_stories_matter_heading')" />

      <div :class="sectionContentClassWithPadding">
        <p
          :class="[
            'mx-auto',
            'mt-[2rem]',
            'max-w-[700px]',
            'text-[2rem]',
            'text-center',
            'font-proxima',
            'font-[300]',
          ]"
        >{{ $t('index_page_hero_all_stories_matter_content') }}</p>

        <ul class="grid laptop:grid-cols-2 gap-[4rem] mt-[3rem]">
          <li>
            <h3 class="text-like-green">{{ $t('index_page_all_stories_matter_blog_heading') }}</h3>
            <p class="mt-[8px] ">{{ $t('index_page_all_stories_matter_blog_content') }}</p>
          </li>
          <li>
            <h3 class="text-like-green">{{ $t('index_page_all_stories_matter_ebook_heading') }}</h3>
            <p class="mt-[8px]">{{ $t('index_page_all_stories_matter_ebook_content') }}</p>
          </li>
        </ul>

        <ul class="grid laptop:grid-cols-3 gap-[2rem] mt-[5rem]">
          <li>
            <img
              class="max-w-[200px] mx-auto mb-[1rem]"
              src="~assets/images/index/reader-insights.png"
              :alt="$t('index_page_all_stories_matter_reader_insights_heading')"
            />
            <h3 class="text-[1.5rem] text-like-green font-proxima font-[600]">{{ $t('index_page_all_stories_matter_reader_insights_heading') }}</h3>
            <p class="mt-[8px] ">{{ $t('index_page_all_stories_matter_reader_insights_content') }}</p>
          </li>
          <li>
            <img
              class="max-w-[200px] mx-auto mb-[1rem]"
              src="~assets/images/index/payment-systems.png"
              :alt="$t('index_page_all_stories_matter_social_interaction_heading')"
            />
            <h3 class="text-[1.5rem] text-like-green font-proxima font-[600]">{{ $t('index_page_all_stories_matter_payment_systems_heading') }}</h3>
            <p class="mt-[8px]">{{ $t('index_page_all_stories_matter_payment_systems_content') }}</p>
          </li>
          <li>
            <img
              class="max-w-[200px] mx-auto mb-[1rem]"
              src="~/assets/images/index/social-interaction.png"
              :alt="$t('index_page_all_stories_matter_social_interaction_heading')"
            />
            <h3 class="text-[1.5rem] text-like-green font-proxima font-[600]">{{ $t('index_page_all_stories_matter_social_interaction_heading') }}</h3>
            <p class="mt-[8px]">{{ $t('index_page_all_stories_matter_social_interaction_content') }}</p>
          </li>
        </ul>

        <IndexPageQuote
          class="text-black max-w-[650px] mt-[5rem] mx-auto"
          :text="$t('index_page_all_stories_matter_quote')"
          :author="$t('index_page_all_stories_matter_quote_author')"
          :author-title="$t('index_page_all_stories_matter_quote_author_title')"
          :is-small="true"
        />

        <footer class="flex flex-col items-center gap-[1rem] mt-[3rem]">
          <ButtonV2
            :text="$t('index_page_all_stories_matter_cta_button')"
            :href="publishStoryURL"
            preset="secondary"
            @click.native="handlePublishStoryButtonClickInAllStoriesMatterSection"
          />
        </footer>
      </div>
    </section>

  </main>
</template>

<script>
import Logo from '~/assets/icons/logo.svg?inline';
import heroSectionBgImage from '~/assets/images/index/grain.png';

import { APP_LIKE_CO_URL_BASE, LIKECOIN_NFT_BOOK_ITEMS } from '~/constant';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'IndexPageV2',
  components: {
    Logo,
  },
  data() {
    return {
      isDesktop: true,
      hasFinishedHeroSectionScrollAnimation: false,
    };
  },
  computed: {
    publishStoryURL() {
      return APP_LIKE_CO_URL_BASE;
    },
    heroSectionStyle() {
      return {
        backgroundImage: `url(${heroSectionBgImage})`,
      };
    },
    heroSectionWaveGradientLayer() {
      return [
        {
          x1: 1114.83,
          y1: 1686.08,
          x2: 1445.17,
          y2: 1113.92,
        },
        {
          x1: 1029.25,
          y1: 1834.31,
          x2: 1530.75,
          y2: 965.69,
        },
        {
          x1: 943.67,
          y1: 1982.54,
          x2: 1616.33,
          y2: 817.46,
        },
        {
          x1: 858.09,
          y1: 2130.77,
          x2: 1701.91,
          y2: 669.23,
        },
        {
          x1: 772.51,
          y1: 2279,
          x2: 1787.49,
          y2: 521,
        },
        {
          x1: 686.93,
          y1: 2427.23,
          x2: 1873.07,
          y2: 372.77,
        },
        {
          x1: 601.35,
          y1: 2575.46,
          x2: 1958.65,
          y2: 224.54,
        },
      ];
    },
    heroSectionWavePaths() {
      return [
        'm1280,1059.97h0c144.33,0,261.34,117.01,261.34,261.34v157.38c0,144.33-117.01,261.34-261.34,261.34h0c-144.33,0-261.34-117.01-261.34-261.34v-157.38c0-144.33,117.01-261.34,261.34-261.34Z',
        'm1280,884.83c224.55,0,406.59,182.04,406.59,406.59v217.16c0,224.55-182.04,406.59-406.59,406.59h0c-224.55,0-406.59-182.04-406.59-406.59v-217.16c0-224.55,182.04-406.59,406.59-406.59h0Z',
        'm1280,709.68c304.77,0,551.84,247.07,551.84,551.84v276.95c0,304.77-247.07,551.84-551.84,551.84h0c-304.77,0-551.84-247.07-551.84-551.84v-276.95c0-304.77,247.07-551.84,551.84-551.84h0Z',
        'm1280,534.54c385,0,697.1,312.1,697.1,697.1v336.73c0,385-312.1,697.1-697.1,697.1h0c-385,0-697.1-312.1-697.1-697.1v-336.73c0-385,312.1-697.1,697.1-697.1h0Z',
        'm1280,359.4c465.22,0,842.35,377.13,842.35,842.35v396.51c0,465.22-377.13,842.35-842.35,842.35h0c-465.22,0-842.35-377.13-842.35-842.35v-396.51c0-465.22,377.13-842.35,842.35-842.35h0Z',
        'm1280,184.25c545.44,0,987.6,442.16,987.6,987.6v456.29c0,545.44-442.16,987.6-987.6,987.6h0c-545.44,0-987.6-442.16-987.6-987.6v-456.29c0-545.44,442.16-987.6,987.6-987.6h0Z',
        'm1280,9.11h0c625.66,0,1132.85,507.2,1132.85,1132.85v516.07c0,625.66-507.2,1132.85-1132.85,1132.85h0c-625.66,0-1132.85-507.2-1132.85-1132.85v-516.07C147.15,516.31,654.34,9.11,1280,9.11Z',
      ];
    },
    featuredNFTBookClassId() {
      return LIKECOIN_NFT_BOOK_ITEMS[0];
    },
    sectionContentClass() {
      return ['max-w-[1024px]', 'w-full', 'mx-auto'];
    },
    sectionContentClassWithPadding() {
      return [this.sectionContentClass, 'p-[1.5rem] laptop:p-[3rem]'];
    },
    isEnglish() {
      return this.$i18n.locale === 'en';
    },
    heroSectionTaglineLeftTextPath() {
      return this.isEnglish
        ? 'm65.2,332h-3.15v-22.53h-8.02v-2.81h19.23v2.81h-8.06v22.53Zm14.15-9.84v-15.5h3.15v15.43c0,4.64,2.51,7.56,7.18,7.56s7.18-2.93,7.18-7.56v-15.43h3.15v15.47c0,6.31-3.46,10.34-10.34,10.34s-10.34-4.07-10.34-10.3Zm46.9,9.84h-3.72l-6.46-10.07h-5.05v10.07h-3.15v-25.35h10.18c4.64,0,7.94,2.96,7.94,7.64s-3.12,7.07-6.57,7.37l6.84,10.34Zm-3.53-17.71c0-2.85-2.05-4.83-5.05-4.83h-6.65v9.69h6.65c3,0,5.05-2.01,5.05-4.86Zm31.14,17.71h-3.04l-14.78-20.44v20.44h-3.15v-25.35h3.23l14.59,20.03v-20.03h3.15v25.35Zm30.05,0h-3.15v-10.72l-9.99-14.63h3.69l7.87,11.78,7.87-11.78h3.69l-9.96,14.63v10.72Zm12.61-12.65c0-7.49,5.05-13.11,12.58-13.11s12.58,5.62,12.58,13.11-5.09,13.11-12.58,13.11-12.58-5.62-12.58-13.11Zm21.89,0c0-5.93-3.65-10.3-9.31-10.3s-9.31,4.37-9.31,10.3,3.61,10.3,9.31,10.3,9.31-4.41,9.31-10.3Zm10.1,2.81v-15.5h3.15v15.43c0,4.64,2.51,7.56,7.18,7.56s7.18-2.93,7.18-7.56v-15.43h3.15v15.47c0,6.31-3.46,10.34-10.34,10.34s-10.34-4.07-10.34-10.3Zm46.9,9.84h-3.72l-6.46-10.07h-5.05v10.07h-3.15v-25.35h10.18c4.64,0,7.94,2.96,7.94,7.64s-3.12,7.07-6.57,7.37l6.84,10.34Zm-3.53-17.71c0-2.85-2.05-4.83-5.05-4.83h-6.65v9.69h6.65c3,0,5.05-2.01,5.05-4.86Zm20.34,14.14l1.86-2.39c1.67,1.86,4.41,3.61,7.98,3.61,4.52,0,5.97-2.43,5.97-4.37,0-3.04-3.08-3.88-6.42-4.79-4.07-1.06-8.59-2.2-8.59-7.18,0-4.18,3.72-7.03,8.7-7.03,3.88,0,6.88,1.29,9.01,3.53l-1.9,2.32c-1.9-2.09-4.56-3.04-7.33-3.04-3.04,0-5.21,1.63-5.21,4.03,0,2.55,2.93,3.31,6.16,4.18,4.14,1.1,8.85,2.39,8.85,7.71,0,3.69-2.51,7.45-9.35,7.45-4.41,0-7.64-1.67-9.73-4.03Zm34.89,3.57h-3.15v-22.53h-8.02v-2.81h19.23v2.81h-8.06v22.53Zm12.08-12.65c0-7.49,5.05-13.11,12.58-13.11s12.58,5.62,12.58,13.11-5.09,13.11-12.58,13.11-12.58-5.62-12.58-13.11Zm21.89,0c0-5.93-3.65-10.3-9.31-10.3s-9.31,4.37-9.31,10.3,3.61,10.3,9.31,10.3,9.31-4.41,9.31-10.3Zm28.49,12.65h-3.72l-6.46-10.07h-5.05v10.07h-3.15v-25.35h10.18c4.64,0,7.94,2.96,7.94,7.64s-3.12,7.07-6.57,7.37l6.84,10.34Zm-3.53-17.71c0-2.85-2.05-4.83-5.05-4.83h-6.65v9.69h6.65c3,0,5.05-2.01,5.05-4.86Zm13.32,17.71h-3.15v-25.35h3.15v25.35Zm24.44,0h-16.61v-25.35h16.61v2.81h-13.45v8.17h13.19v2.81h-13.19v8.74h13.45v2.81Zm5.41-3.57l1.86-2.39c1.67,1.86,4.41,3.61,7.98,3.61,4.52,0,5.97-2.43,5.97-4.37,0-3.04-3.08-3.88-6.42-4.79-4.07-1.06-8.59-2.2-8.59-7.18,0-4.18,3.72-7.03,8.7-7.03,3.88,0,6.88,1.29,9.01,3.53l-1.9,2.32c-1.9-2.09-4.56-3.04-7.33-3.04-3.04,0-5.21,1.63-5.21,4.03,0,2.55,2.93,3.31,6.16,4.18,4.14,1.1,8.85,2.39,8.85,7.71,0,3.69-2.51,7.45-9.35,7.45-4.41,0-7.64-1.67-9.73-4.03Z'
        : 'm335.01,302.74h21.85v2.2h-21.85v-2.2Zm.72,12.24h20.63v1.94h-20.63v-1.94Zm.65,3.91h19.3v1.9h-19.3v-1.9Zm-1.82,4.03h22.53v2.13h-22.53v-2.13Zm9.77-22.84h2.89v3.76h-2.89v-3.76Zm-3.95,12.81h2.58v10.98h-2.58v-10.98Zm8.32,0h2.58v10.98h-2.58v-10.98Zm-4.64,10.56l2.17.68c-2.39,2.66-6.92,4.71-10.83,6-.27-.49-.99-1.48-1.44-1.9,3.8-1.03,8.02-2.66,10.11-4.79Zm3.76.38c1.52,4.41,4.98,7.9,9.84,9.23-.57.49-1.29,1.41-1.63,2.05-5.13-1.71-8.66-5.59-10.37-10.79l2.17-.49Zm7.14,1.82l1.56,1.48c-1.71,1.25-4.03,2.39-5.78,3.15l-1.37-1.41c1.71-.8,4.18-2.24,5.59-3.23Zm-16.3-17.4v2.93h4.03v-2.93h-4.03Zm-2.17-1.79h8.47v6.46h-8.47v-6.46Zm12.69,1.79v2.93h4.14v-2.93h-4.14Zm-2.2-1.79h8.63v6.46h-8.63v-6.46Zm-23.18,5.13h9.77v2.28h-9.77v-2.28Zm.23-10.15h9.42v2.28h-9.42v-2.28Zm-.23,15.24h9.77v2.28h-9.77v-2.28Zm-1.56-10.26h12.27v2.36h-12.27v-2.36Zm2.89,15.39h8.4v11.06h-8.4v-2.36h6v-6.35h-6v-2.36Zm-1.41,0h2.36v12.84h-2.36v-12.84Zm12.46,10.64c3.19-.46,7.83-1.22,12.39-1.98l.15,2.13c-4.18.8-8.47,1.56-11.82,2.17l-.72-2.32Zm3.53-5.28l1.37-1.37,1.1.42v6.65h-2.47v-5.7Zm47.96-20.03h15.2v2.7h-15.2v-2.7Zm-19.68.34h16.68v2.7h-16.68v-2.7Zm20.86-7.41l2.85.46c-1.41,7.11-3.8,13.64-7.07,17.9-.49-.46-1.71-1.41-2.43-1.82,3.27-3.88,5.43-10.07,6.65-16.53Zm8.51,8.55l2.81.34c-2.13,13.49-6.69,21.39-17.18,26.11-.3-.65-1.14-1.94-1.63-2.51,9.99-4.03,14.17-11.48,16-23.94Zm-8.36.91c1.94,10.72,6.08,19.49,14.14,23.1-.68.57-1.56,1.67-1.98,2.43-8.4-4.18-12.54-13.3-14.74-25.08l2.58-.46Zm-14.06-9.46h2.89v18.43h-2.89v-18.43Zm-5.36,17.06h2.7v16.26h-2.7v-16.26Zm1.6,0h11.97v13.6h-11.97v-2.66h9.27v-8.25h-9.27v-2.7Zm58.22-17.06h2.89v31.77c0,1.79-.49,2.47-1.67,2.89-1.22.38-3.19.42-6.38.42-.15-.68-.61-1.75-.99-2.39,2.28.08,4.56.04,5.24.04.68-.04.91-.27.91-.95v-31.77Zm-14.86,3.04h32.98v2.36h-32.98v-2.36Zm6.69,6.61v2.74h19.61v-2.74h-19.61Zm-2.7-1.98h25.19v6.73h-25.19v-6.73Zm-1.1,9.39h26.87v13.83h-2.85v-11.7h-24.02v-2.13Zm-3.61,4.75h34.43v2.28h-34.43v-2.28Zm3.23,5.17h25.88v2.2h-25.88v-2.2Z';
    },
    heroSectionTaglineCenterTextPath() {
      return this.isEnglish
        ? 'm505.73,332h-3.15v-25.35h3.15v25.35Zm28.81,0h-3.04l-14.78-20.44v20.44h-3.15v-25.35h3.23l14.59,20.03v-20.03h3.15v25.35Zm17.25,0h-3.15v-22.53h-8.02v-2.81h19.23v2.81h-8.06v22.53Zm12.08-12.65c0-7.49,5.05-13.11,12.58-13.11s12.58,5.62,12.58,13.11-5.09,13.11-12.58,13.11-12.58-5.62-12.58-13.11Zm21.89,0c0-5.93-3.65-10.3-9.31-10.3s-9.31,4.37-9.31,10.3,3.61,10.3,9.31,10.3,9.31-4.41,9.31-10.3Z'
        : 'm513.86,314.33h9.46v2.66h-9.46v-2.66Zm8.32,0h2.77v1.22c-.19,8.59-.42,11.78-1.22,12.84-.61.68-1.22.95-2.28,1.06-.99.11-2.7.08-4.56,0-.08-.84-.38-1.94-.8-2.66,1.71.15,3.38.15,4.03.15.53,0,.91-.04,1.18-.38.57-.68.76-3.53.87-11.74v-.49Zm10.72-12.31l1.71-1.79c2.36,1.22,5.36,3.04,6.84,4.37l-1.79,1.94c-1.44-1.33-4.37-3.27-6.76-4.52Zm5.43,10.3l2.85.68c-3.23,9.92-8.89,17.25-16.68,21.85-.42-.57-1.48-1.75-2.09-2.32,7.71-4.1,13.07-11.06,15.92-20.22Zm-24.24-5.78h29.41v2.81h-29.41v-2.81Zm-1.82,0h2.96v10.72c0,5.4-.61,13.07-4.07,18.05-.49-.57-1.71-1.56-2.39-1.9,3.15-4.67,3.5-11.21,3.5-16.19v-10.68Zm15.77-6.38h2.96c-.08,17.48,3.65,31.73,8.59,31.73,1.06,0,1.56-1.98,1.79-7.03.65.65,1.71,1.29,2.47,1.56-.53,6.5-1.6,8.36-4.48,8.36-7.75,0-11.17-16.42-11.32-34.62Zm32.95,20.18h25.88v2.51h-25.88v-2.51Zm-4.9-13.72h24.85v2.62h-24.85v-2.62Zm10.72,6.84h17.4v2.55h-17.4v-2.55Zm18.85,6.88h2.85s-.04.84-.11,1.25c-.68,8.02-1.41,11.17-2.62,12.43-.72.72-1.44.99-2.58,1.06-.95.08-2.85.04-4.83-.04-.04-.8-.34-1.9-.8-2.66,1.9.23,3.72.23,4.45.23s1.1-.08,1.44-.38c.87-.87,1.6-3.88,2.2-11.44v-.46Zm-8.44,4.56l2.01-.76c1.22,1.56,2.39,3.69,2.89,5.05l-2.09.87c-.49-1.37-1.67-3.57-2.81-5.17Zm-16.42-23.67l2.47-1.03c1.48,1.52,3.15,3.69,3.91,5.13l-2.66,1.22c-.65-1.48-2.24-3.72-3.72-5.32Zm5.17,24.62l2.32-.3c.76,2.39,1.18,5.55,1.18,7.6l-2.51.34c.08-2.05-.34-5.17-.99-7.64Zm5.59-.34l2.24-.53c.99,2.09,1.94,4.79,2.24,6.57l-2.36.65c-.27-1.82-1.18-4.6-2.13-6.69Zm-10.45-.53l2.39.8c-.87,3.15-2.2,6.76-4.52,9.08l-2.2-1.56c2.13-2.01,3.57-5.4,4.33-8.32Zm11.21-24.89l2.89.72c-3.46,10.64-9.42,20.67-19.49,26.64-.34-.68-1.06-1.82-1.56-2.43,9.42-5.36,15.28-15.09,18.16-24.93Zm7.98,6.54h2.7c-.53,2.62-1.22,5.78-1.79,7.83l-2.51-.34c.53-2.01,1.18-5.05,1.6-7.49Zm2.85,6.84h2.7c-.53,2.62-1.18,5.81-1.71,7.87l-2.58-.3c.57-2.05,1.22-5.13,1.6-7.56Z';
    },
    heroSectionTaglineRightPath() {
      return this.isEnglish
        ? 'm630.05,335.56c-9.16,0-16.45-6.58-16.45-16.21s7.28-16.21,16.45-16.21c7.14,0,11.14,3.76,13.35,7.66l-5.73,2.82c-1.32-2.54-4.14-4.56-7.61-4.56-5.45,0-9.59,4.37-9.59,10.29s4.14,10.29,9.59,10.29c3.48,0,6.3-1.97,7.61-4.56l5.73,2.77c-2.26,3.9-6.2,7.71-13.35,7.71Zm16.76-16.21c0-9.45,6.91-16.21,16.36-16.21s16.4,6.77,16.4,16.21-6.91,16.21-16.4,16.21-16.36-6.77-16.36-16.21Zm25.9,0c0-5.88-3.76-10.29-9.54-10.29s-9.49,4.42-9.49,10.29,3.71,10.29,9.49,10.29,9.54-4.46,9.54-10.29Zm32.41,15.65h-19.93v-31.35h6.67v25.47h13.25v5.88Zm25.54,0h-19.93v-31.35h6.67v25.47h13.25v5.88Zm27.8,0h-22.18v-31.35h22.18v5.73h-15.51v6.82h15.18v5.73h-15.18v7.29h15.51v5.78Zm21.1.56c-9.16,0-16.45-6.58-16.45-16.21s7.29-16.21,16.45-16.21c7.14,0,11.14,3.76,13.35,7.66l-5.73,2.82c-1.32-2.54-4.14-4.56-7.61-4.56-5.45,0-9.59,4.37-9.59,10.29s4.14,10.29,9.59,10.29c3.48,0,6.3-1.97,7.61-4.56l5.73,2.77c-2.26,3.9-6.2,7.71-13.35,7.71Zm32.22-.56h-6.72v-25.47h-9.17v-5.88h25v5.88h-9.12v25.47Zm21.01,0h-6.67v-31.35h6.67v31.35Zm24.18,0h-17.01v-31.35h16.5c5.97,0,9.02,3.81,9.02,7.99,0,3.95-2.44,6.58-5.4,7.19,3.34.52,6.02,3.76,6.02,7.71,0,4.7-3.15,8.46-9.12,8.46Zm-10.34-25.66v6.91h8.37c2.26,0,3.67-1.46,3.67-3.48s-1.41-3.43-3.67-3.43h-8.37Zm0,12.6v7.38h8.6c2.54,0,4.04-1.46,4.04-3.71,0-1.97-1.41-3.67-4.04-3.67h-8.6Zm32.1,13.07h-6.67v-31.35h6.67v31.35Zm27.09,0h-19.93v-31.35h6.67v25.47h13.25v5.88Zm27.8,0h-22.18v-31.35h22.18v5.73h-15.51v6.82h15.18v5.73h-15.18v7.29h15.51v5.78Zm4-4.42l3.67-5.08c2.21,2.3,5.64,4.23,9.96,4.23,3.67,0,5.45-1.74,5.45-3.52,0-2.35-2.73-3.15-6.35-3.99-5.12-1.18-11.7-2.58-11.7-9.59,0-5.22,4.51-9.45,11.89-9.45,4.98,0,9.12,1.5,12.22,4.37l-3.71,4.89c-2.54-2.35-5.92-3.43-8.98-3.43s-4.61,1.32-4.61,3.2c0,2.12,2.63,2.77,6.25,3.62,5.17,1.17,11.75,2.73,11.75,9.68,0,5.73-4.09,10.06-12.55,10.06-6.02,0-10.34-2.02-13.3-4.98Z'
        : 'm613.08,324.57c3.62-.71,9.12-2.07,14.43-3.38l.66,4.98c-4.51,1.5-9.31,2.96-13.16,4.14l-1.93-5.73Zm12.08-29.14h5.5v43.76h-5.5v-43.76Zm-9.16,5.12h5.41v25.33h-5.41v-25.33Zm21.85,2.96h19.93v5.31h-19.93v-5.31Zm.05-8.46l5.78,1.13c-1.97,8.79-5.45,17.2-10.01,22.47-.89-1.13-3.15-3.29-4.42-4.28,4.18-4.42,7.14-11.7,8.65-19.32Zm11.84,11.28l5.64.85c-3.01,15.89-9.26,26.18-21.71,32.2-.52-1.32-2.16-3.9-3.2-5.12,11.47-4.89,16.92-13.86,19.27-27.92Zm-9.68.8c2.49,12.5,7.9,22.75,18.19,27.21-1.27,1.13-3.05,3.38-3.85,4.89-11.14-5.5-16.4-16.54-19.46-31.11l5.12-.99Zm30.88-9.21h42.02v4.61h-42.02v-4.61Zm9.87,8.65h32.57v4.75h-32.57v-4.75Zm-6.91,7.71h6.25v4.46h-6.25v-4.46Zm-4.09,7.29h10.1v4.56h-10.1v-4.56Zm16.54,9.12h12.22v3.52h-12.22v-3.52Zm-5.08-35.58h5.59v9.82h-5.59v-9.82Zm15.51,0h5.59v9.96h-5.59v-9.96Zm-5.73,20.07h3.71v5.31h-3.71v-5.31Zm-19.32-8.08h4.09v12.6h-4.09v-12.6Zm19.32,19.6h3.71v5.31h-3.71v-5.31Zm-4.18-7.8h11.47v9.35h-11.47v-3.29h7.61v-2.77h-7.61v-3.29Zm-2.3-5.78h13.63v3.52h-9.73v20.21h-3.9v-23.74Zm-6.25-6.53h4.65v14.15c0,5.83-.42,13.63-3.1,18.66-.89-.75-3.01-1.88-4.18-2.3,2.44-4.61,2.63-11.23,2.63-16.4v-14.1Zm20.02-2.73h5.03c-.05,19.69,3.43,30.55,5.88,30.55.8-.05,1.27-1.46,1.5-5.97.99.99,2.49,2.02,3.67,2.44-.61,7.1-2.12,8.41-5.59,8.41-6.58,0-9.92-14.01-10.48-35.44Zm6.86.75l3.29-2.44c1.46.94,3.24,2.35,4.04,3.43l-3.48,2.63c-.75-1.08-2.4-2.58-3.85-3.62Zm1.74,8.41l4.98.85c-2.35,11.28-6.91,20.07-13.91,25.52-.85-.89-2.91-2.63-4.09-3.38,7-4.75,11.14-12.83,13.02-22.98Zm-34.87,10.29h3.95v3.99c0,3.24-.47,8.6-3.43,11.94-.75-.66-2.3-1.74-3.2-2.21,2.35-2.87,2.68-7.19,2.68-9.87v-3.85Zm67.92-20.96v6.35h16.54v-6.35h-16.54Zm-5.45-5.36h27.78v17.06h-27.78v-17.06Zm-6.44,21.01h17.95v20.96h-5.64v-15.6h-7v15.89h-5.31v-21.24Zm21.95,0h18.61v21.01h-5.69v-15.65h-7.52v15.89h-5.4v-21.24Zm-19.6,13.49h12.31v5.4h-12.31v-5.4Zm22.18,0h13.16v5.4h-13.16v-5.4Z';
    },
    fanSymbols() {
      return [
        {
          bodyPath: '76.41,290.13',
          head: {
            cx: 44.97,
            cy: 233.54,
            glowing: {
              fillPath:
                'm47.02,220.12c.99-1.14,2.83-.81,3.38.59l2.68,6.95c.19.51.59.91,1.08,1.12l6.86,2.91c1.39.59,1.65,2.44.48,3.39l-5.78,4.69c-.42.34-.68.84-.73,1.38l-.65,7.42c-.13,1.5-1.82,2.32-3.08,1.5l-6.25-4.05c-.45-.29-1.01-.39-1.54-.27l-7.26,1.67c-1.47.34-2.77-1.01-2.38-2.46l1.92-7.2c.14-.52.06-1.08-.22-1.54l-3.83-6.39c-.78-1.29.1-2.95,1.61-3.03l7.44-.4c.54-.03,1.05-.28,1.4-.68l4.89-5.62Z',
              strokePath:
                'm44.4,218.45c.74-.85,2.13-.61,2.53.45l2.68,6.95c.24.63.73,1.14,1.36,1.4l6.86,2.91c1.04.44,1.24,1.83.36,2.55l-5.78,4.69c-.53.43-.86,1.05-.92,1.72l-.65,7.42c-.1,1.13-1.36,1.74-2.31,1.13l-6.25-4.05c-.57-.37-1.26-.49-1.92-.34l-7.26,1.67c-1.1.25-2.08-.76-1.79-1.85l1.92-7.2c.17-.65.08-1.35-.27-1.93l-3.83-6.39c-.58-.97.08-2.21,1.21-2.27l7.44-.4c.68-.04,1.31-.34,1.75-.85l4.89-5.62Z',
            },
          },
          frame: {
            cx: 44.84,
            cy: 245.87,
          },
        },
        {
          bodyPath: '164.13,89.32',
          head: {
            cx: 132.7,
            cy: 32.73,
            glowing: {
              fillPath:
                'm128.38,49.84c1.21,1.23,3.12,1.47,4.59.58,2.66-1.61,6.74-4.1,8.69-5.47,1.95-1.36,6.67-3.84,7.62-9.01,1.1-5.95-3.6-9.81-7.43-10.34-3.24-.45-6.14.59-8.51,3.28-1.62-3.19-4.18-4.92-7.43-5.29-3.84-.43-9.34,2.14-9.76,8.18-.36,5.25,3.59,8.82,5.15,10.62,1.56,1.81,4.89,5.24,7.07,7.45Z',
              strokePath:
                'm139.38,41.54h0c.24-.17.52-.35.83-.56,2.23-1.47,5.79-3.81,6.59-8.14,1.03-5.6-3.37-9.25-7-9.76l-.41,18.45Zm0,0c-1.94,1.36-6,3.84-8.67,5.45-1.27.77-2.93.56-3.98-.5-2.18-2.22-5.5-5.63-7.04-7.43h0c-.19-.22-.42-.47-.66-.74-1.8-1.97-4.67-5.13-4.37-9.52h0c.39-5.68,5.56-8.13,9.2-7.72,3.08.35,5.49,1.97,7.04,5.02l.33.66m8.14,14.78l-8.14-14.78m0,0l.49-.55m-.49.55l.49-.55m0,0c2.26-2.57,4.99-3.54,8.07-3.12l-8.07,3.12Z',
            },
          },
          frame: {
            cx: 132.56,
            cy: 45.06,
          },
        },
        {
          bodyPath: '686.13,414.13',
          head: {
            cx: 654.7,
            cy: 357.54,
            glowing: {
              fillPath:
                'm657.02,344.12c.99-1.14,2.83-.81,3.38.59l2.68,6.95c.19.51.59.91,1.08,1.12l6.86,2.91c1.39.59,1.65,2.44.48,3.39l-5.79,4.69c-.42.34-.68.84-.73,1.38l-.65,7.42c-.13,1.5-1.81,2.32-3.08,1.5l-6.25-4.05c-.45-.29-1.01-.39-1.54-.27l-7.26,1.67c-1.47.34-2.77-1.01-2.38-2.47l1.92-7.2c.14-.52.06-1.08-.22-1.54l-3.83-6.39c-.78-1.29.1-2.95,1.61-3.03l7.44-.4c.54-.03,1.05-.28,1.4-.68l4.89-5.62Z',
              strokePath:
                'm654.4,342.45c.74-.85,2.12-.61,2.53.45l2.68,6.95c.24.63.73,1.14,1.35,1.4l6.86,2.91c1.04.44,1.24,1.83.36,2.54l-5.79,4.69c-.53.43-.86,1.05-.92,1.72l-.65,7.42c-.1,1.13-1.36,1.74-2.31,1.13l-6.25-4.05c-.57-.37-1.26-.49-1.92-.34l-7.26,1.67c-1.1.25-2.08-.76-1.79-1.85l1.92-7.2c.17-.65.08-1.35-.27-1.93l-3.83-6.39c-.58-.97.08-2.21,1.21-2.27l7.44-.4c.68-.04,1.31-.34,1.75-.85l4.89-5.62Z',
            },
          },
          frame: {
            cx: 654.56,
            cy: 369.87,
          },
        },
        {
          bodyPath: '762.13,123.22',
          head: {
            cx: 730.7,
            cy: 66.63,
            glowing: {
              fillPath:
                'm733.02,53.12c.99-1.14,2.83-.81,3.38.59l2.68,6.95c.19.51.59.91,1.08,1.12l6.86,2.91c1.39.59,1.65,2.44.48,3.39l-5.79,4.69c-.42.34-.68.84-.73,1.38l-.65,7.42c-.13,1.5-1.81,2.32-3.08,1.5l-6.25-4.05c-.45-.29-1.01-.39-1.54-.27l-7.26,1.67c-1.47.34-2.77-1.01-2.38-2.46l1.92-7.2c.14-.52.06-1.08-.22-1.55l-3.83-6.39c-.78-1.29.1-2.95,1.61-3.03l7.44-.4c.54-.03,1.05-.28,1.4-.68l4.89-5.62Z',
              strokePath:
                'm730.4,51.45c.74-.85,2.12-.61,2.53.45l2.68,6.95c.24.63.73,1.14,1.35,1.4l6.86,2.91c1.04.44,1.24,1.83.36,2.55l-5.79,4.69c-.53.43-.86,1.05-.92,1.72l-.65,7.42c-.1,1.13-1.36,1.74-2.31,1.13l-6.25-4.05c-.57-.37-1.26-.49-1.92-.34l-7.26,1.67c-1.1.25-2.08-.76-1.79-1.85l1.92-7.2c.17-.65.08-1.35-.27-1.93l-3.83-6.39c-.58-.97.08-2.21,1.21-2.27l7.44-.4c.68-.04,1.31-.34,1.75-.86l4.89-5.62Z',
            },
          },
          frame: {
            cx: 730.56,
            cy: 78.97,
          },
        },
        {
          bodyPath: '894.13,225.22',
          head: {
            cx: 862.7,
            cy: 168.63,
            glowing: {
              fillPath:
                'm858.38,185.84c1.21,1.23,3.12,1.47,4.59.58,2.66-1.61,6.74-4.1,8.7-5.47,1.95-1.36,6.67-3.84,7.62-9.01,1.1-5.95-3.6-9.81-7.43-10.34-3.24-.45-6.14.59-8.51,3.28-1.62-3.19-4.18-4.92-7.43-5.29-3.84-.43-9.35,2.14-9.76,8.18-.36,5.25,3.59,8.82,5.15,10.62,1.56,1.81,4.89,5.24,7.07,7.45Z',
              strokePath:
                'm869.38,177.54h0c.24-.17.52-.35.83-.56,2.23-1.47,5.79-3.81,6.59-8.14,1.03-5.6-3.37-9.25-7-9.76l-.41,18.45Zm0,0c-1.94,1.36-6,3.84-8.67,5.45-1.27.77-2.93.56-3.98-.5-2.18-2.22-5.5-5.63-7.04-7.43h0c-.19-.23-.42-.47-.66-.74-1.8-1.97-4.67-5.13-4.37-9.52h0c.39-5.68,5.57-8.13,9.2-7.72,3.08.35,5.49,1.97,7.04,5.02l.33.66m8.14,14.78l-8.14-14.78m0,0l.49-.55m-.49.55l.49-.55m0,0c2.26-2.57,4.99-3.54,8.07-3.12l-8.07,3.12Z',
            },
          },
          frame: {
            cx: 862.56,
            cy: 180.97,
          },
        },
      ];
    },
    fanSymbolBgs() {
      return [
        {
          cx: 52.49,
          cy: 253.99,
        },

        {
          cx: 140.49,
          cy: 52.99,
        },

        {
          cx: 662.48,
          cy: 377.99,
        },

        {
          cx: 738.48,
          cy: 86.99,
        },

        {
          cx: 870.48,
          cy: 188.99,
        },
      ];
    },
  },
  watch: {
    isDesktop(value, prevValue) {
      if (value !== prevValue) {
        this.animateHeroSection();
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.animate();
  },
  methods: {
    animate() {
      this.animateHeroSection();
      this.animateLikerLandSection();
      this.animateNFTBookSection();
      this.animateFanSymbols();
    },
    animateHeroSection() {
      const {
        page,
        heroSection,
        heroSectionBgWavePathLayers,
        heroSectionKeyArt,
        heroSectionPortalFill,
        heroSectionPortalBorder,
        heroSectionTaglineLeftText,
        heroSectionTaglineCenterAndLeft,
        heroSectionTaglineCenterText,
        heroSectionTaglineRight,
        heroSectionTaglineRightText,
        heroSectionIndicator,
        heroSectionAllStoryMattersDescription,
        heroSectionWritingNFTDescription,
        heroSectionWritingNFTText,
        heroSectionCTA,

        heroSectionMobileKeyArt,
        heroSectionMobilePortalFill,
        heroSectionMobilePortalFillLayer,
        heroSectionMobilePortalBorder,
        heroSectionMobilePortalBorderLayer,
        heroSectionMobileTagline,
        heroSectionMobileTaglineParts,
        heroSectionMobileAllStoryMattersDescription,
        heroSectionMobileAllStoryMattersIndicator,
        heroSectionMobileWritingNFTDescription,
        heroSectionMobileCTA,

        heroSectionScrollHint,
      } = this.$refs;
      const taglineParts = [...heroSectionMobileTaglineParts.childNodes].filter(
        el => /path|g/.test(el?.tagName)
      );

      if (this.heroSectionTimeline) {
        this.heroSectionTimeline.revert();
      }
      if (this.heroSectionScrollAnimation) {
        this.heroSectionScrollAnimation.revert();
      }

      this.heroSectionTimeline = this.$gsap.gsap.timeline();

      this.heroSectionTimeline.to(page, {
        duration: 2,
        opacity: 1,
        ease: 'power2.out',
        clearProps: 'opacity',
      });

      this.heroSectionTimeline.addLabel('slide1', '-=0.5');

      this.heroSectionTimeline.from(
        [heroSectionPortalFill, heroSectionMobilePortalFill],
        {
          opacity: 0,
          x: '-=8',
          duration: 2,
          ease: 'power2.out',
          clearProps: 'x,opacity',
        },
        'slide1'
      );
      this.heroSectionTimeline.from(
        [heroSectionPortalBorder, heroSectionMobilePortalBorder],
        {
          x: '+=8',
          duration: 1,
          ease: 'power2.out',
          clearProps: 'x',
        },
        'slide1'
      );

      this.heroSectionTimeline.from(
        heroSectionBgWavePathLayers,
        {
          opacity: 0,
          scale: 0.8,
          transformOrigin: 'center center',
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
        },
        'slide1'
      );

      if (this.isDesktop) {
        this.heroSectionTimeline.fromTo(
          heroSectionTaglineLeftText,
          {
            x: '-=50',
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            clearProps: 'x,opacity',
          },
          'slide1+=0.2'
        );

        this.heroSectionTimeline.fromTo(
          heroSectionTaglineCenterText,
          {
            x: '+=20',
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            clearProps: 'x,opacity',
          },
          'slide1+=0.3'
        );

        this.heroSectionTimeline.fromTo(
          heroSectionTaglineRightText,
          {
            x: '-=50',
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            clearProps: 'x,opacity',
          },
          'slide1+=0.4'
        );
      } else {
        this.heroSectionTimeline.fromTo(
          taglineParts,
          {
            y: '-=20px',
            opacity: 0,
            ease: 'power2.out',
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            stagger: 0.2,
            clearProps: 'x',
          },
          'slide1+=0.5'
        );
      }

      if (this.isDesktop) {
        this.heroSectionScrollAnimation = this.$gsap.gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: `top top`,
            end: `bottom bottom-=128`,
            pin: heroSectionKeyArt,
            scrub: 0.1,
            snap: 'labelsDirectional',
          },
        });

        this.heroSectionScrollAnimation.addLabel('slide2');

        this.heroSectionScrollAnimation.fromTo(
          [heroSectionTaglineCenterAndLeft, heroSectionTaglineRight],
          {
            opacity: 1,
          },
          {
            duration: 1,
            opacity: 0,
            ease: 'power2.in',
          },
          'slide2'
        );

        this.heroSectionScrollAnimation.from(
          heroSectionIndicator,
          {
            scaleX: 0,
            svgOrigin: '430 320',
            duration: 1,
            opacity: 0,
            ease: 'power2.out',
          },
          'slide2+=1'
        );

        this.heroSectionScrollAnimation.from(
          heroSectionAllStoryMattersDescription,
          {
            x: '+=40',
            duration: 1,
            opacity: 0,
            ease: 'power2.out',
          },
          'slide2+=1'
        );

        this.heroSectionScrollAnimation.addLabel('slide3');

        this.heroSectionScrollAnimation.to(
          heroSectionAllStoryMattersDescription,
          {
            delay: 0.5,
            duration: 1,
            opacity: 0,
            ease: 'power2.in',
          }
        );

        this.heroSectionScrollAnimation.to(
          heroSectionIndicator,
          {
            scaleX: 0.25,
            svgOrigin: '430 320',
            duration: 1,
            ease: 'power2.inOut',
          },
          '-=0.5'
        );

        this.heroSectionScrollAnimation.from(heroSectionWritingNFTText, {
          x: '+=50',
          duration: 1,
          opacity: 0,
          ease: 'power2.out',
        });

        this.heroSectionScrollAnimation.from(
          heroSectionWritingNFTDescription,
          {
            x: '-=40',
            duration: 1,
            opacity: 0,
            ease: 'power2.out',
          },
          '-=1'
        );

        this.heroSectionScrollAnimation.fromTo(
          [...heroSectionBgWavePathLayers]
            .map(layer => layer.childNodes[0])
            .reverse(),
          {
            opacity: 1,
            scale: 1,
          },
          {
            opacity: 0,
            scale: 0.8,
            transformOrigin: 'center center',
            duration: 3,
            stagger: 1,
            ease: 'power2.in',
          },
          'slide2'
        );
      } else {
        this.heroSectionScrollAnimation = this.$gsap.gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: `top top`,
            end: `bottom bottom-=128`,
            pin: heroSectionMobileKeyArt,
            scrub: 0.1,
            snap: 'labelsDirectional',
          },
        });

        this.heroSectionScrollAnimation.addLabel('slide2');

        this.heroSectionScrollAnimation.fromTo(
          heroSectionMobileTagline,
          {
            opacity: 1,
          },
          {
            duration: 1,
            opacity: 0,
            ease: 'power2.in',
          }
        );

        this.heroSectionScrollAnimation.to(
          [
            heroSectionMobilePortalFillLayer,
            heroSectionMobilePortalBorderLayer,
          ],
          {
            x: `${heroSectionMobileAllStoryMattersDescription.offsetWidth -
              32}`,
            duration: 4,
            ease: 'power2.inOut',
          }
        );

        this.heroSectionScrollAnimation.from(
          heroSectionMobileAllStoryMattersIndicator,
          {
            scaleX: 0,
            svgOrigin: '308 1',
            duration: 1,
            opacity: 0,
            ease: 'power2.out',
          },
          '-=0.5'
        );

        this.heroSectionScrollAnimation.from(
          heroSectionMobileAllStoryMattersDescription,
          {
            x: 32,
            duration: 1,
            opacity: 0,
            ease: 'power2.out',
          },
          '-=0.5'
        );

        this.heroSectionScrollAnimation.addLabel('slide3', '+=0.5');

        this.heroSectionScrollAnimation.to(
          heroSectionMobileAllStoryMattersDescription,
          {
            duration: 1,
            opacity: 0,
            ease: 'power2.in',
          },
          'slide3'
        );
        this.heroSectionScrollAnimation.to(
          heroSectionMobileAllStoryMattersIndicator,
          {
            x: '-=10%',
            scaleX: 0.25,
            opacity: 0,
            duration: 1,
            ease: 'power2.in',
          },
          'slide3'
        );

        this.heroSectionScrollAnimation.to(
          [
            heroSectionMobilePortalFillLayer,
            heroSectionMobilePortalBorderLayer,
          ],
          {
            x: `-${heroSectionMobileWritingNFTDescription.offsetWidth}`,
            duration: 8,
            ease: 'power2.inOut',
          },
          'slide3'
        );

        this.heroSectionScrollAnimation.set(
          heroSectionMobileAllStoryMattersIndicator,
          {
            y: '+=10%',
          }
        );

        this.heroSectionScrollAnimation.to(
          heroSectionMobileAllStoryMattersIndicator,
          {
            x: '+=5%',
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
          }
        );

        this.heroSectionScrollAnimation.from(
          heroSectionMobileWritingNFTDescription,
          {
            x: '+=50',
            duration: 1,
            opacity: 0,
            ease: 'power2.out',
          }
        );
      }

      this.heroSectionScrollAnimation.from(
        [heroSectionCTA, heroSectionMobileCTA],
        {
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
        },
        '-=0.5'
      );

      this.heroSectionScrollAnimation.addLabel('end');

      this.heroSectionScrollAnimation.to(heroSectionScrollHint, {
        opacity: 0,
        duration: 1,
        ease: 'power2.in',
      });

      this.heroSectionScrollAnimation.from(
        document.querySelector('.site-header'),
        {
          backdropFilter: 'blur(0px)',
          backgroundColor: 'transparent',
          duration: 1,
          ease: 'power2.in',
        },
        'end'
      );

      this.heroSectionTimeline.add(this.heroSectionScrollAnimation);
    },
    animateLikerLandSection() {
      const {
        likerLandSection,
        likerLandSectionContent,
        likerLandSectionQuote,
        likerLandSectionPortalImage,
        likerLandSectionPortalGroup,
        likerLandSectionSignature,
        likerLandSectionSignatureGradientStart,
      } = this.$refs;

      const timeline = this.$gsap.gsap.timeline({
        scrollTrigger: {
          trigger: likerLandSection,
          start: `top-=50% center+=15%`,
          end: `top center+=15%`,
          fastScrollEnd: true,
          toggleActions: 'play none none reset',
        },
      });

      timeline.addLabel('start');

      timeline.from(likerLandSectionContent, {
        opacity: 0,
        x: '-=25%',
        duration: 1,
        ease: 'power2.out',
      });

      const portalCircles = [...likerLandSectionPortalGroup.childNodes].filter(
        el => el?.tagName === 'circle'
      );
      timeline.from(
        [likerLandSectionPortalImage, ...portalCircles],
        {
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          stagger: {
            each: 0.1,
          },
        },
        '0.5'
      );

      timeline.addLabel('signature', 'start+=0.5');

      timeline.from(
        likerLandSectionSignature,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        'signature'
      );

      timeline.from(
        likerLandSectionSignatureGradientStart,
        {
          attr: {
            offset: 0.9,
          },
          duration: 1,
          ease: 'power2.out',
        },
        'signature'
      );

      timeline.from(
        likerLandSectionQuote.$refs.root,
        {
          opacity: 0,
          y: '+=20%',
          duration: 1,
          ease: 'power2.out',
        },
        'start+=0.5'
      );
    },
    animateNFTBookSection() {
      const {
        nftBookSection,
        nftBookSectionContent,
        nftBookSectionWordRainGroup,
      } = this.$refs;

      const timeline = this.$gsap.gsap.timeline({
        scrollTrigger: {
          trigger: nftBookSection,
          start: `top center+=15%`,
          end: `bottom center+=15%`,
          fastScrollEnd: true,
          toggleActions: 'play none none none',
        },
      });

      timeline.addLabel('start');

      const wordRainEls = [...nftBookSectionWordRainGroup.childNodes].filter(
        node => node.tagName === 'g'
      );

      timeline.from(wordRainEls, {
        opacity: 0,
        y: '-=50%',
        duration: 1,
        ease: 'power3.out',
        stagger: {
          each: 0.2,
        },
      });

      const contentEls = [...nftBookSectionContent.childNodes].filter(node =>
        /h2|p/i.test(node.tagName)
      );
      timeline.from(
        contentEls,
        {
          opacity: 0,
          x: '+=32',
          duration: 1,
          stagger: {
            each: 0.2,
          },
          ease: 'power2.out',
        },
        'start'
      );
    },
    animateFanSymbols() {
      const {
        fansKeyArt,
        fansKeyArtTrigger,
        fanSymbols,
        fanSymbolBg,
        fanSymbolHeadPlain,
        fanSymbolHeadFilled,
      } = this.$refs;

      const timeline = this.$gsap.gsap.timeline({
        scrollTrigger: {
          trigger: fansKeyArtTrigger.$refs.root,
          start: `top center+=10%`,
          end: `bottom center+=5%`,
          pin: fansKeyArt,
          scrub: 0.5,
        },
      });

      timeline.from(fanSymbols, {
        opacity: 0,
        scale: 0,
        duration: 1.5,
        stagger: {
          each: 0.2,
        },
        transformOrigin: 'center center',
        ease: 'power2.out',
      });

      timeline.addLabel('transform', '+=4');

      timeline.from(
        fanSymbolBg,
        {
          opacity: 0,
          duration: 1,
          stagger: {
            each: 0.2,
          },
          ease: 'power2.out',
        },
        'transform'
      );
      timeline.from(
        fanSymbolHeadFilled,
        {
          scale: 0,
          opacity: 0,
          duration: 1,
          stagger: {
            each: 0.2,
          },
          ease: 'power2.out',
          transformOrigin: 'center center',
        },
        'transform'
      );
      timeline.to(
        fanSymbolHeadPlain,
        {
          opacity: 0,
          scale: 2,
          duration: 0.4,
          stagger: {
            each: 0.2,
          },
          transformOrigin: 'center center',
          ease: 'power2.in',
        },
        'transform'
      );
    },
    handleResize() {
      window.requestAnimationFrame(() => {
        this.isDesktop = window.innerWidth > 768;
      });
    },
    handleTryCollectButtonClickInHeroSection() {
      logTrackerEvent(this, 'IndexPage', 'IndexHeroTryCollectClick', '', 1);
    },
    handlePublishStoryButtonClickInHeroSection() {
      logTrackerEvent(this, 'IndexPage', 'IndexHeroPublishStoryClick', '', 1);
    },
    handleBookItemCardClickInNFTBookSection() {
      logTrackerEvent(
        this,
        'IndexPage',
        'IndexNFTBookItemCardClick',
        this.featuredNFTBookClassId,
        1
      );
    },
    handleAuthorClickInNFTBookSection() {
      logTrackerEvent(
        this,
        'IndexPage',
        'IndexNFTBookAuthorClick',
        this.featuredNFTBookClassId,
        1
      );
    },
    handleCTAClickInNFTBookSection() {
      logTrackerEvent(this, 'IndexPage', 'IndexNFTBookCTAClick', '', 1);
    },
    handleAboutWritingNFTButtonClickInNewCultureSection() {
      logTrackerEvent(
        this,
        'IndexPage',
        'IndexNewCultureAboutWNFTClick',
        '',
        1
      );
    },
    handleTryCollectButtonClickInNewCultureSection() {
      logTrackerEvent(
        this,
        'IndexPage',
        'IndexNewCultureTryCollectClick',
        '',
        1
      );
    },
    handlePublishStoryButtonClickInNewCultureSection() {
      logTrackerEvent(
        this,
        'IndexPage',
        'IndexNewCulturePublishStoryClick',
        '',
        1
      );
    },
    handlePublishStoryButtonClickInAllStoriesMatterSection() {
      logTrackerEvent(
        this,
        'IndexPage',
        'IndexAllStoriesMatterPublishStoryClick',
        '',
        1
      );
    },
  },
};
</script>

<style scoped>
.wave-bg {
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 40%,
    transparent 50%,
    black 60%,
    transparent 100%
  );
  mask-mode: alpha;
}
</style>
