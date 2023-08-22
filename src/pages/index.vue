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
              <g
                ref="heroSectionTaglineRightText"
                clip-path="url(#hero-section-tagline-right-path)"
              >
                <use
                  xlink:href="#hero-section-gradient"
                  :transform="isEnglish ? 'translate(613.55 203.03) scale(.7)' : 'translate(610.98 248.2) scale(.43)'"
                />
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
                v-if="isEnglish"
                id="hero-section-tagline-left-gradient"
                x1="67.55"
                y1="319.35"
                x2="431.17"
                y2="319.35"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#000"/>
                <stop offset=".93" stop-color="#000"/>
                <stop offset="1" stop-color="#000" stop-opacity=".05"/>
              </linearGradient>
              <linearGradient
                v-else
                id="hero-section-tagline-left-gradient"
                x1="218.08"
                y1="318.21"
                x2="490.98"
                y2="318.21"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#000"/>
                <stop offset=".74" stop-color="#000"/>
                <stop offset="1" stop-color="#000" stop-opacity=".1"/>
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
                v-if="isEnglish"
                ref="heroSectionTaglineCenterText"
                fill="#4a4a4a"
                d="m505.73,332h-3.15v-25.35h3.15v25.35Zm28.81,0h-3.04l-14.78-20.44v20.44h-3.15v-25.35h3.23l14.59,20.03v-20.03h3.15v25.35Zm17.25,0h-3.15v-22.53h-8.02v-2.81h19.23v2.81h-8.06v22.53Zm12.08-12.65c0-7.49,5.05-13.11,12.58-13.11s12.58,5.62,12.58,13.11-5.09,13.11-12.58,13.11-12.58-5.62-12.58-13.11Zm21.89,0c0-5.93-3.65-10.3-9.31-10.3s-9.31,4.37-9.31,10.3,3.61,10.3,9.31,10.3,9.31-4.41,9.31-10.3Z"
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
            <p class="text-[1rem]">{{ $t('index_page_hero_writing_nft_content') }}</p>
          </div>

          <nav
            ref="heroSectionCTA"
            :class="[
              'absolute',
              'inset-x-0',
              'bottom-0',
              'mb-[3.5rem]',
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
              :to="localeLocation({
                name: 'nft-class-classId',
                params: { classId: freeMintNFTClassId },
                query: { action: 'collect' },
              })"
              @click.native="handleTryCollectButtonClickInHeroSection"
            />
            <!--
            <ButtonV2
              :text="$t('index_page_hero_publish_story_button')"
              :href="publishStoryURL"
              preset="tertiary"
              @click.native="handlePublishStoryButtonClickInHeroSection"
            />
            -->
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
                <path d="m22.11,441.49c-8.58,0-15.4-6.16-15.4-15.18s6.82-15.18,15.4-15.18c6.69,0,10.43,3.52,12.5,7.17l-5.37,2.64c-1.23-2.38-3.87-4.27-7.13-4.27-5.1,0-8.98,4.09-8.98,9.64s3.87,9.64,8.98,9.64c3.26,0,5.9-1.85,7.13-4.27l5.37,2.6c-2.11,3.65-5.81,7.22-12.5,7.22Zm15.69-15.18c0-8.84,6.47-15.18,15.31-15.18s15.36,6.34,15.36,15.18-6.47,15.18-15.36,15.18-15.31-6.34-15.31-15.18Zm24.24,0c0-5.5-3.52-9.64-8.93-9.64s-8.89,4.14-8.89,9.64,3.48,9.64,8.89,9.64,8.93-4.18,8.93-9.64Zm30.34,14.65h-18.66v-29.35h6.25v23.85h12.41v5.5Zm23.91,0h-18.66v-29.35h6.25v23.85h12.41v5.5Zm26.02,0h-20.77v-29.35h20.77v5.37h-14.52v6.38h14.21v5.37h-14.21v6.82h14.52v5.41Zm19.76.53c-8.58,0-15.4-6.16-15.4-15.18s6.82-15.18,15.4-15.18c6.69,0,10.43,3.52,12.5,7.17l-5.37,2.64c-1.23-2.38-3.87-4.27-7.13-4.27-5.1,0-8.98,4.09-8.98,9.64s3.87,9.64,8.98,9.64c3.26,0,5.9-1.85,7.13-4.27l5.37,2.6c-2.11,3.65-5.81,7.22-12.5,7.22Zm30.16-.53h-6.29v-23.85h-8.58v-5.5h23.41v5.5h-8.54v23.85Zm19.67,0h-6.25v-29.35h6.25v29.35Zm22.63,0h-15.93v-29.35h15.44c5.59,0,8.45,3.56,8.45,7.48,0,3.7-2.29,6.16-5.06,6.73,3.12.48,5.63,3.52,5.63,7.22,0,4.4-2.95,7.92-8.54,7.92Zm-9.68-24.02v6.47h7.83c2.11,0,3.43-1.36,3.43-3.26s-1.32-3.21-3.43-3.21h-7.83Zm0,11.79v6.91h8.05c2.38,0,3.78-1.36,3.78-3.48,0-1.85-1.32-3.43-3.78-3.43h-8.05Zm42.46,12.23h-18.66v-29.35h6.25v23.85h12.41v5.5Zm26.02,0h-20.77v-29.35h20.77v5.37h-14.52v6.38h14.21v5.37h-14.21v6.82h14.52v5.41Zm3.74-4.14l3.43-4.75c2.07,2.16,5.28,3.96,9.33,3.96,3.43,0,5.1-1.63,5.1-3.3,0-2.2-2.55-2.95-5.94-3.74-4.8-1.1-10.96-2.42-10.96-8.98,0-4.88,4.22-8.84,11.13-8.84,4.66,0,8.54,1.41,11.44,4.09l-3.48,4.58c-2.38-2.2-5.54-3.21-8.4-3.21s-4.31,1.23-4.31,2.99c0,1.98,2.46,2.6,5.85,3.39,4.84,1.1,11,2.55,11,9.06,0,5.37-3.83,9.42-11.75,9.42-5.63,0-9.68-1.89-12.45-4.66Z" fill="none"/>
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
                    :to="localeLocation({
                      name: 'nft-class-classId',
                      params: { classId: freeMintNFTClassId },
                      query: { action: 'collect' },
                    })"
                    @click.native="handleTryCollectButtonClickInHeroSection"
                  />
                  <!--
                  <ButtonV2
                    :text="$t('index_page_hero_publish_story_button')"
                    :href="publishStoryURL"
                    preset="tertiary"
                    @click.native="handlePublishStoryButtonClickInHeroSection"
                  />
                  -->
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
              'gap-[0.5rem]',
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
                'text-center laptop:text-left',
                'whitespace-pre-line',
              ]"
            >{{ $t('index_page_nft_book_heading').replaceAll(/\\n/g, '\n') }}</h2>
            <p class="mt-[0.5rem] text-[1rem]">{{ $t('index_page_nft_book_content') }}</p>

            <footer
              :class="[
                'flex',
                'flex-row',
                'flex-wrap',
                'justify-center laptop:justify-start',
                'gap-[1rem]',
                'mt-[1rem]',
              ]"
            >
              <ButtonV2
                :text="$t('index_page_nft_book_free_mint_button')"
                preset="secondary"
                :to="localeLocation({
                  name: 'nft-class-classId',
                  params: { classId: freeMintNFTClassId },
                  query: { action: 'collect' },
                })"
                @click.native="handleTryCollectButtonClickInNFTBookSection"
              />
              <ButtonV2
                :text="$t('index_page_nft_book_paid_mint_button')"
                preset="tertiary"
                :to="localeLocation({
                  name: 'nft-class-classId',
                  params: { classId: featuredNFTBookClassId },
                  query: { action: 'collect' },
                })"
                @click.native="handleBuyFullVersionButtonInNFTBookSection"
              />
            </footer>

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
              'pointer-events-none',
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
                <image width="158" height="228" transform="translate(44.99 75)" xlink:href="~assets/images/index/nft-book-cover-old.jpg"/>
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
          :image-src="staticBookCoverSrc"
          :video-src="animatedBookCoverSrc"
          :should-resize-src="false"
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
              :to="localeLocation({
                name: 'nft-class-classId',
                params: { classId: freeMintNFTClassId },
                query: { action: 'collect' },
              })"
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
          <!--
          <template #append>
            <ButtonV2
              :text="$t('index_page_new_culture_section_3_cta_button')"
              :href="publishStoryURL"
              preset="tertiary"
              @click.native="handlePublishStoryButtonClickInNewCultureSection"
            />
          </template>
          -->
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
        >{{ $t('index_page_all_stories_matter_sub_heading') }}</p>

        <ul class="grid laptop:grid-cols-3 gap-[2.5rem] mt-[3rem]">
          <li class="text-center">
            <img
              class="max-w-[200px] mx-auto mb-[1rem]"
              src="~assets/images/index/reader-insights.png"
              :alt="$t('index_page_all_stories_matter_reader_insights_heading')"
            />
            <h3 class="text-[1.5rem] text-like-green font-proxima font-[600]">{{ $t('index_page_all_stories_matter_reader_insights_heading') }}</h3>
            <p class="mt-[8px] ">{{ $t('index_page_all_stories_matter_reader_insights_content') }}</p>
          </li>
          <li class="text-center">
            <img
              class="max-w-[200px] mx-auto mb-[1rem]"
              src="~assets/images/index/payment-systems.png"
              :alt="$t('index_page_all_stories_matter_social_interaction_heading')"
            />
            <h3 class="text-[1.5rem] text-like-green font-proxima font-[600]">{{ $t('index_page_all_stories_matter_payment_systems_heading') }}</h3>
            <p class="mt-[8px]">{{ $t('index_page_all_stories_matter_payment_systems_content') }}</p>
          </li>
          <li class="text-center">
            <img
              class="max-w-[200px] mx-auto mb-[1rem]"
              src="~/assets/images/index/social-interaction.png"
              :alt="$t('index_page_all_stories_matter_social_interaction_heading')"
            />
            <h3 class="text-[1.5rem] text-like-green font-proxima font-[600]">{{ $t('index_page_all_stories_matter_social_interaction_heading') }}</h3>
            <p class="mt-[8px]">{{ $t('index_page_all_stories_matter_social_interaction_content') }}</p>
          </li>
        </ul>

        <ul class="grid laptop:grid-cols-2 gap-[4rem] mt-[5rem]">
          <li>
            <h3 class="text-like-green font-proxima font-[600]">{{ $t('index_page_all_stories_matter_blog_heading') }}</h3>
            <p class="mt-[8px] ">{{ $t('index_page_all_stories_matter_blog_content') }}</p>
          </li>
          <li>
            <h3 class="text-like-green font-proxima font-[600]">{{ $t('index_page_all_stories_matter_ebook_heading') }}</h3>
            <p class="mt-[8px]">{{ $t('index_page_all_stories_matter_ebook_content') }}</p>
          </li>
        </ul>

        <IndexPageQuote
          class="text-black max-w-[650px] mt-[5rem] mx-auto"
          :text="$t('index_page_all_stories_matter_quote')"
          :author="$t('index_page_all_stories_matter_quote_author')"
          :author-title="$t('index_page_all_stories_matter_quote_author_title')"
          :is-small="true"
        />

        <!--
        <footer class="flex flex-col items-center gap-[1rem] mt-[3rem]">
          <ButtonV2
            :text="$t('index_page_all_stories_matter_cta_button')"
            :href="publishStoryURL"
            preset="secondary"
            @click.native="handlePublishStoryButtonClickInAllStoriesMatterSection"
          />
        </footer>
        -->
      </div>
    </section>

  </main>
</template>

<script>
import Logo from '~/assets/icons/logo.svg?inline';
import heroSectionBgImage from '~/assets/images/index/grain.png';
import staticBookCover from '~/assets/images/index/nft-book-cover.jpg';
import animatedBookCover from '~/assets/images/index/nft-book-cover.mp4';

import {
  APP_LIKE_CO_URL_BASE,
  LIKECOIN_NFT_CLASS_FREE_MINT,
  LIKECOIN_NFT_BOOK_ITEMS,
} from '~/constant';
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
    freeMintNFTClassId() {
      return LIKECOIN_NFT_CLASS_FREE_MINT;
    },
    featuredNFTBookClassId() {
      return LIKECOIN_NFT_BOOK_ITEMS[0];
    },
    animatedBookCoverSrc() {
      return animatedBookCover;
    },
    staticBookCoverSrc() {
      return staticBookCover;
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
      // Turn your stories (into [zh])
      return this.isEnglish
        ? 'm75.51,331.91v-22.38h-7.96v-2.79h19.09v2.79h-8v22.38h-3.13Zm15.43-25.17h3.13v15.32c0,4.6,2.49,7.51,7.13,7.51s7.13-2.91,7.13-7.51v-15.32h3.13v15.36c0,6.26-3.43,10.26-10.26,10.26s-10.26-4.04-10.26-10.23v-15.4Zm41.13,25.17l-6.41-10h-5.02v10h-3.13v-25.17h10.11c4.6,0,7.89,2.94,7.89,7.58s-3.09,7.02-6.53,7.32l6.79,10.26h-3.7Zm-4.83-22.38h-6.6v9.62h6.6c2.98,0,5.02-2,5.02-4.83s-2.04-4.79-5.02-4.79Zm31.17,22.38l-14.68-20.3v20.3h-3.13v-25.17h3.21l14.49,19.89v-19.89h3.13v25.17h-3.02Zm26.26,0v-10.64l-9.92-14.53h3.66l7.81,11.7,7.81-11.7h3.66l-9.89,14.53v10.64h-3.13Zm26.41-25.58c7.43,0,12.49,5.58,12.49,13.02s-5.06,13.02-12.49,13.02-12.49-5.58-12.49-13.02,5.02-13.02,12.49-13.02Zm0,2.79c-5.66,0-9.24,4.34-9.24,10.23s3.58,10.23,9.24,10.23,9.25-4.38,9.25-10.23-3.62-10.23-9.25-10.23Zm17.54-2.38h3.13v15.32c0,4.6,2.49,7.51,7.13,7.51s7.13-2.91,7.13-7.51v-15.32h3.13v15.36c0,6.26-3.43,10.26-10.26,10.26s-10.26-4.04-10.26-10.23v-15.4Zm41.13,25.17l-6.41-10h-5.02v10h-3.13v-25.17h10.11c4.6,0,7.89,2.94,7.89,7.58s-3.09,7.02-6.53,7.32l6.79,10.26h-3.7Zm-4.83-22.38h-6.6v9.62h6.6c2.98,0,5.02-2,5.02-4.83s-2.04-4.79-5.02-4.79Zm23.58,16.45c1.66,1.85,4.38,3.58,7.92,3.58,4.49,0,5.92-2.42,5.92-4.34,0-3.02-3.06-3.85-6.38-4.75-4.04-1.06-8.53-2.19-8.53-7.13,0-4.15,3.7-6.98,8.64-6.98,3.85,0,6.83,1.28,8.94,3.51l-1.89,2.3c-1.89-2.08-4.53-3.02-7.28-3.02-3.02,0-5.17,1.62-5.17,4,0,2.53,2.91,3.28,6.11,4.15,4.11,1.09,8.79,2.38,8.79,7.66,0,3.66-2.49,7.4-9.28,7.4-4.38,0-7.58-1.66-9.66-4l1.85-2.38Zm27.92,5.92v-22.38h-7.96v-2.79h19.09v2.79h-8v22.38h-3.13Zm25.88-25.58c7.43,0,12.49,5.58,12.49,13.02s-5.06,13.02-12.49,13.02-12.49-5.58-12.49-13.02,5.02-13.02,12.49-13.02Zm0,2.79c-5.66,0-9.24,4.34-9.24,10.23s3.58,10.23,9.24,10.23,9.25-4.38,9.25-10.23-3.62-10.23-9.25-10.23Zm32.11,22.79l-6.41-10h-5.02v10h-3.13v-25.17h10.11c4.6,0,7.89,2.94,7.89,7.58s-3.09,7.02-6.53,7.32l6.79,10.26h-3.7Zm-4.83-22.38h-6.6v9.62h6.6c2.98,0,5.02-2,5.02-4.83s-2.04-4.79-5.02-4.79Zm13.36,22.38v-25.17h3.13v25.17h-3.13Zm9.17,0v-25.17h16.49v2.79h-13.36v8.11h13.09v2.79h-13.09v8.68h13.36v2.79h-16.49Zm21.96-5.92c1.66,1.85,4.38,3.58,7.92,3.58,4.49,0,5.92-2.42,5.92-4.34,0-3.02-3.06-3.85-6.38-4.75-4.04-1.06-8.53-2.19-8.53-7.13,0-4.15,3.7-6.98,8.64-6.98,3.85,0,6.83,1.28,8.94,3.51l-1.89,2.3c-1.89-2.08-4.53-3.02-7.28-3.02-3.02,0-5.17,1.62-5.17,4,0,2.53,2.91,3.28,6.11,4.15,4.11,1.09,8.79,2.38,8.79,7.66,0,3.66-2.49,7.4-9.28,7.4-4.38,0-7.58-1.66-9.66-4l1.85-2.38Z'
        : 'm232.16,305.34v2.53h-14.07v-2.53h14.07Zm-10.11,17.87v15.09h-2.32v-15.09h2.32Zm8.89-11.98v2.43h-11v-2.43h11Zm0,5.97v2.43h-11v-2.43h11Zm-.02,6.01v12.94h-9.24v-2.49h6.9v-7.96h-6.9v-2.49h9.24Zm-6.15-25.17c1.15,1.85,2.26,4.33,2.58,5.88l-2.33.87c-.34-1.6-1.37-4.13-2.5-6.06l2.24-.7Zm21.46,28.12c-2.84,3.28-8.17,5.89-12.8,7.48-.31-.5-1.1-1.58-1.6-2.05,4.57-1.27,9.57-3.4,12.05-6.17l2.34.75Zm12.96-1.33v2.29h-26.66v-2.29h26.66Zm-.41-23.68v2.35h-25.7v-2.35h25.7Zm-.59,14.36v2.09h-24.28v-2.09h24.28Zm-.88,4.66v2.09h-22.56v-2.09h22.56Zm-12.59-14.73v7.54h-9.86v-7.54h9.86Zm-7.8,31.24c.64-.43,1.7-1.47,1.7-3.43v-3.65l2.45.13v5.85s-2.79,2.12-2.79,3.13c-.23-.56-.92-1.56-1.36-2.03Zm.29-25.6h5.08v-3.7h-5.08v3.7Zm.98,25.35l1.34-1,8.52-1.72c-.05.73.01,1.82.1,2.39-7.97,1.82-9.15,2.19-9.87,2.61l-.1-2.27Zm4.05-23.89v12.94h-2.75v-12.94h2.75Zm3.62-15.16c.96,1.38,1.88,3.26,2.2,4.53l-2.59.94c-.32-1.28-1.2-3.23-2.05-4.66l2.45-.81Zm13.79,38.96c-.59.56-1.33,1.55-1.7,2.24-6.01-1.97-10.24-6.43-12.31-12.34l2.3-.55c1.86,5.09,6.02,9.14,11.71,10.64Zm-2.36-30.9v7.54h-10.02v-7.54h10.02Zm-5.21,7.1v12.94h-2.73v-12.94h2.73Zm-2.47-1.46h5.22v-3.7h-5.22v3.7Zm8.7,18.3c-2.05,1.53-4.82,2.86-6.93,3.81l-1.47-1.5c2.05-.97,5.03-2.7,6.71-3.89l1.69,1.58Zm37.72-22.86v2.82h-19.51v-2.82h19.51Zm-14.77,11.28v19.01h-2.83v-19.01h2.83Zm12.95,0v15.81h-14.12v-2.82h11.26v-10.18h-11.26v-2.82h14.12Zm-6.38-20.11v21.53h-3.01v-21.53h3.01Zm26.39,10.26c-2.53,15.99-7.97,25.29-20.42,30.86-.31-.72-1.22-2.03-1.74-2.67,11.98-4.79,16.99-13.68,19.19-28.56l2.98.37Zm-10.08-9.76c-1.69,8.26-4.49,15.9-8.27,20.9-.53-.46-1.84-1.45-2.57-1.89,3.83-4.61,6.39-11.89,7.84-19.49l3,.48Zm13.63,38.05c-.72.58-1.64,1.73-2.12,2.54-9.8-4.91-14.78-15.73-17.37-29.59l2.7-.5c2.31,12.78,7.29,23.29,16.79,27.55Zm-.26-30.2v2.85h-17.85v-2.85h17.85Zm57.96,17.41v2.45h-40.45v-2.45h40.45Zm-.85-22.05v2.5h-38.79v-2.5h38.79Zm-5.29,28.1v2.39h-30.55v-2.39h30.55Zm1.46-11.64v16.05h-3v-13.79h-28.57v-2.26h31.57Zm-.68-11.11v7.73h-29.57v-7.73h29.57Zm-26.69,5.54h23.67v-3.38h-23.67v3.38Zm13.11-14.59v37.54c0,1.98-.58,2.75-1.93,3.19-1.35.44-3.66.47-7.42.47-.16-.72-.66-1.86-1.07-2.58,2.78.09,5.51.06,6.29.03.82-.04,1.09-.28,1.09-1.11v-37.54h3.03Zm43.47,7.78v12.54c0,6.27-.67,15.16-4.78,21.02-.51-.6-1.79-1.62-2.51-1.98,3.77-5.53,4.18-13.24,4.18-19.08v-12.49h3.11Zm9.83,9.02v2.81h-11.27v-2.81h11.27Zm23.69-9.02v2.93h-34.7v-2.93h34.7Zm-21.97,9.02s-.01.93-.01,1.34c-.23,10.2-.48,13.96-1.4,15.15-.68.78-1.41,1.08-2.63,1.19-1.15.1-3.21.09-5.43-.04-.06-.86-.38-2.04-.83-2.8,2.12.2,4.13.21,4.91.21.64,0,1.08-.07,1.4-.46.68-.81.9-4.22,1.08-14.08v-.51h2.9Zm19.16-1.63c-3.84,11.68-10.53,20.25-19.75,25.66-.45-.63-1.55-1.87-2.21-2.45,9.15-4.86,15.54-13.07,18.97-23.96l2.99.75Zm-12.02-15.09c-.05,21.06,4.39,37.61,10.42,37.61,1.32,0,1.89-2.33,2.15-8.34.69.67,1.81,1.34,2.62,1.62-.56,7.55-1.72,9.79-4.99,9.79-9,0-13.11-19.03-13.3-40.67h3.11Zm4.2.23c2.86,1.42,6.42,3.61,8.21,5.18l-1.86,2.06c-1.74-1.58-5.24-3.89-8.15-5.38l1.81-1.86Zm52.34.46c-4.06,12.49-11.16,24.27-22.87,31.33-.37-.7-1.12-1.88-1.67-2.52,11.08-6.44,18.04-17.94,21.52-29.58l3.02.78Zm7.02,6.99v2.78h-29.21v-2.78h29.21Zm-20.69,22.37c-1.06,3.7-2.65,7.99-5.37,10.69l-2.34-1.6c2.55-2.41,4.28-6.45,5.18-9.9l2.53.82Zm-.31-29.96c1.77,1.79,3.74,4.36,4.63,6.05l-2.75,1.32c-.79-1.77-2.69-4.38-4.48-6.28l2.59-1.1Zm28.05,23.76v2.66h-30.52v-2.66h30.52Zm-22.11,5.99c.9,2.83,1.38,6.52,1.38,8.92l-2.66.38c.1-2.42-.39-6.08-1.18-8.98l2.47-.32Zm18.92-14.1v2.69h-20.57v-2.69h20.57Zm-12.45,13.46c1.2,2.43,2.32,5.62,2.7,7.7l-2.52.69c-.32-2.12-1.42-5.37-2.53-7.85l2.35-.54Zm6.41-.93c1.47,1.81,2.93,4.33,3.51,5.94l-2.22.97c-.59-1.64-2.01-4.24-3.4-6.11l2.1-.81Zm10.91-4.42s-.06.93-.12,1.35c-.85,9.51-1.69,13.24-3.12,14.68-.8.81-1.61,1.08-2.94,1.15-1.13.09-3.36.07-5.67-.06-.06-.82-.38-1.98-.86-2.78,2.31.24,4.51.25,5.35.24.84,0,1.29-.06,1.69-.45,1.08-1.02,1.92-4.61,2.69-13.67v-.47h2.99Zm-6.57-16.16c-.61,3.07-1.42,6.75-2.06,9.14l-2.69-.38c.66-2.34,1.4-5.92,1.89-8.77h2.85Zm3.43,8.06c-.6,3.07-1.36,6.81-2,9.18l-2.75-.29c.69-2.4,1.45-6.03,1.9-8.89h2.85Z';
    },
    heroSectionTaglineRightPath() {
      // Collectibles
      return this.isEnglish
        ? 'm630.05,335.56c-9.16,0-16.45-6.58-16.45-16.21s7.28-16.21,16.45-16.21c7.14,0,11.14,3.76,13.35,7.66l-5.73,2.82c-1.32-2.54-4.14-4.56-7.61-4.56-5.45,0-9.59,4.37-9.59,10.29s4.14,10.29,9.59,10.29c3.48,0,6.3-1.97,7.61-4.56l5.73,2.77c-2.26,3.9-6.2,7.71-13.35,7.71Zm16.76-16.21c0-9.45,6.91-16.21,16.36-16.21s16.4,6.77,16.4,16.21-6.91,16.21-16.4,16.21-16.36-6.77-16.36-16.21Zm25.9,0c0-5.88-3.76-10.29-9.54-10.29s-9.49,4.42-9.49,10.29,3.71,10.29,9.49,10.29,9.54-4.46,9.54-10.29Zm32.41,15.65h-19.93v-31.35h6.67v25.47h13.25v5.88Zm25.54,0h-19.93v-31.35h6.67v25.47h13.25v5.88Zm27.8,0h-22.18v-31.35h22.18v5.73h-15.51v6.82h15.18v5.73h-15.18v7.29h15.51v5.78Zm21.1.56c-9.16,0-16.45-6.58-16.45-16.21s7.29-16.21,16.45-16.21c7.14,0,11.14,3.76,13.35,7.66l-5.73,2.82c-1.32-2.54-4.14-4.56-7.61-4.56-5.45,0-9.59,4.37-9.59,10.29s4.14,10.29,9.59,10.29c3.48,0,6.3-1.97,7.61-4.56l5.73,2.77c-2.26,3.9-6.2,7.71-13.35,7.71Zm32.22-.56h-6.72v-25.47h-9.17v-5.88h25v5.88h-9.12v25.47Zm21.01,0h-6.67v-31.35h6.67v31.35Zm24.18,0h-17.01v-31.35h16.5c5.97,0,9.02,3.81,9.02,7.99,0,3.95-2.44,6.58-5.4,7.19,3.34.52,6.02,3.76,6.02,7.71,0,4.7-3.15,8.46-9.12,8.46Zm-10.34-25.66v6.91h8.37c2.26,0,3.67-1.46,3.67-3.48s-1.41-3.43-3.67-3.43h-8.37Zm0,12.6v7.38h8.6c2.54,0,4.04-1.46,4.04-3.71,0-1.97-1.41-3.67-4.04-3.67h-8.6Zm45.36,13.07h-19.93v-31.35h6.67v25.47h13.25v5.88Zm27.8,0h-22.18v-31.35h22.18v5.73h-15.51v6.82h15.18v5.73h-15.18v7.29h15.51v5.78Zm3.99-4.42l3.67-5.08c2.21,2.3,5.64,4.23,9.96,4.23,3.67,0,5.45-1.74,5.45-3.52,0-2.35-2.73-3.15-6.35-3.99-5.12-1.18-11.7-2.58-11.7-9.59,0-5.22,4.51-9.45,11.89-9.45,4.98,0,9.12,1.5,12.22,4.37l-3.71,4.89c-2.54-2.35-5.92-3.43-8.98-3.43s-4.61,1.32-4.61,3.2c0,2.12,2.63,2.77,6.25,3.62,5.17,1.17,11.75,2.73,11.75,9.68,0,5.73-4.09,10.06-12.55,10.06-6.02,0-10.34-2.02-13.3-4.98Z'
        : 'm617.58,329.99c1.06-.64,2.15-1.84,2.15-4.24v-28.64h6.96v33.85s-6.45,3.1-6.45,5.53c-.42-1.8-1.62-4.96-2.66-6.49Zm1.82-.16l2.73-2.39,14.13-4.2c.41,1.91,1.28,4.57,1.89,6.03-13.93,4.66-16.33,5.96-17.91,7.22l-.84-6.66Zm20.58-38.21v54.65h-7.02v-54.65h7.02Zm16.02.25c-1.99,11.89-5.72,23.04-11.73,30.11-.94-1.54-3.4-4.77-4.92-6.17,5-5.72,7.91-15.12,9.35-25.11l7.3,1.17Zm12.83,14.41c-3.07,19.48-9.72,32.49-23.62,40.14-.84-1.46-3.12-4.43-4.54-5.81,13.04-6.22,18.86-17.86,21.22-35.23l6.95.89Zm3.61,33.86c-1.58,1.32-3.78,3.99-4.86,5.83-12.13-6.99-18.83-20.55-22.78-37.14l5.73-1.28c3.38,14.31,10.39,26.85,21.92,32.59Zm-.49-38.42v6.69h-24.3v-6.69h24.3Zm29.18,24.45v5.03c0,4.09-.6,10.81-4.35,15.02-.92-.86-2.85-2.18-4.01-2.8,2.97-3.61,3.37-9.04,3.37-12.37v-4.88h4.98Zm4.86-2.18v5.73h-12.65v-5.73h12.65Zm13.86-29.74v5.83h-25.24v-5.83h25.24Zm-18.95,11.57v9.01h5.32v5.63h-10.45v-14.64h5.13Zm8.95-.68v17.8c0,7.28-.51,17.13-3.88,23.42-1.12-.91-3.81-2.34-5.29-2.88,3.1-5.8,3.34-14.14,3.34-20.59v-17.75h5.83Zm2.77-14.46v12.4h-7.01v-12.4h7.01Zm35.43,14.46v5.95h-40.93v-5.95h40.93Zm-19.06,8.23v4.43h-12.2v22.1h-4.95v-26.53h17.15Zm.45,22.07v4.43h-15.34v-4.43h15.34Zm-.26-14.83v11.76h-14.45v-4.15h9.6v-3.45h-9.6v-4.15h14.45Zm-4.53-4.64v6.65h-4.63v-6.65h4.63Zm0,14.44v6.69h-4.63v-6.69h4.63Zm22.82-36.17v5.83h-25.39v-5.83h25.39Zm-1.21,20.03c-2.91,14.13-8.56,25.21-17.25,32.11-1.03-1.14-3.63-3.33-5.12-4.27,8.64-5.98,13.75-16.15,16.1-28.88l6.27,1.03Zm-10.55-12.53c-.04,24.75,4.34,38.34,7.17,38.34.98-.01,1.55-1.85,1.8-7.48,1.26,1.23,3.16,2.55,4.65,3.05-.8,8.94-2.67,10.61-6.97,10.61-8.07,0-12.23-17.59-12.92-44.52h6.27Zm1.02-11.06v11.76h-7.01v-11.76h7.01Zm5.21,8.92c1.82,1.15,4.06,2.93,5.08,4.28l-4.41,3.35c-.93-1.36-3.02-3.29-4.84-4.55l4.16-3.08Zm53.09,19.87v26.4h-7.07v-19.61h-8.81v19.94h-6.7v-26.72h22.58Zm-4.12,16.96v6.79h-15.5v-6.79h15.5Zm24.54-43.37v21.46h-34.88v-21.46h34.88Zm-28.04,14.71h20.78v-7.93h-20.78v7.93Zm36,11.7v26.45h-7.12v-19.67h-9.48v19.94h-6.78v-26.72h23.38Zm-3.58,16.96v6.79h-16.57v-6.79h16.57Z';
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
    this.resizeListener = window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.animate();
  },
  beforeDestroy() {
    if (this.resizeListener) {
      window.removeEventListener(this.resizeListener);
      this.resizeListener = null;
    }
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
        /h2|p|footer/i.test(node.tagName)
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
    handleTryCollectButtonClickInNFTBookSection() {
      logTrackerEvent(
        this,
        'IndexPage',
        'IndexNFTBookTryCollectClick',
        this.featuredNFTBookClassId,
        1
      );
    },
    handleBuyFullVersionButtonInNFTBookSection() {
      logTrackerEvent(
        this,
        'IndexPage',
        'IndexNFTBookBuyFullVersionClick',
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
