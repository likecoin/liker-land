<template>
  <div class="w-full">
    <div
      ref="hero"
      :class="[
        'relative',
        'flex',
        'flex-col',
        'items-stretch',
        'w-full',
        'h-full',
        'min-h-[320px] laptop:min-h-[420px] desktop:min-h-[544px]',
      ]"
      style="background-color: #cee3e3; opacity: 0"
    >
      <div class="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center">
        <svg
          ref="bgOutlinedBoxes"
          :class="[
            'w-full',
            'max-w-[1920px]',
            'max-h-[1920px]',
            'scale-150 desktop:scale-110',
          ]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1920"
          fill="none"
          stroke="#fff"
          stroke-miterlimit="10"
          stroke-width="2"
        >
          <g><path d="m737.72,1113.6l70.48-377.19,374.1,69.9-70.48,377.19-374.1-69.9Z" /></g>
          <g><path d="m1423.98,821.12l-323.81,603.31-604.16-325.7,323.81-603.31,604.16,325.7Z" /></g>
          <g><path d="m254.14,1082.24L833.32,254.94l832.55,582.85-579.17,827.3L254.14,1082.24Z" /></g>
          <g><path d="m12.84,1062.66L849.56,13.72l1057.59,843.62-836.72,1048.94L12.84,1062.66Z" /></g>
        </svg>
      </div>

      <div ref="prepend" class="relative z-1 bg-gradient-to-b from-[#cee3e3] from-25%">
        <slot name="prepend" />
      </div>
      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#cee3e3] from-25% h-[60px]" />

      <div
        ref="banner"
        class="relative pointer-events-none grow"
        style="transform-style: preserve-3d"
      >
        <div
          ref="keyArtWrapper"
          :class="[
            'w-full',
            'absolute',
            'left-[50%]',
            'bottom-[50%]',
            'translate-x-[-50%]',
            'translate-y-[50%]',
            'max-w-[320px] laptop:max-w-[420px] desktop:max-w-[480px]',
            'pointer-events-none',
          ]"
        >
          <div class="scale-[0.7] laptop:scale-75 desktop:scale-100">
            <svg
              ref="keyArtSVG"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 480 480"
            >
              <defs>
                <clipPath id="key-art-piece-a">
                  <circle cx="420" cy="420" r="60" fill="none" />
                </clipPath>
                <clipPath id="key-art-piece-b">
                  <circle cx="300" cy="60" r="60" fill="none" />
                </clipPath>
                <clipPath id="key-art-piece-c">
                  <circle cx="180" cy="420" r="60" fill="none" />
                </clipPath>
                <clipPath id="key-art-piece-d">
                  <path fill="none" d="M360 480c-66.27 0-120-53.73-120-120s53.73-120 120-120v240Z" />
                </clipPath>
                <clipPath id="key-art-piece-e">
                  <path fill="none" d="M120 240C53.73 240 0 186.27 0 120S53.73 0 120 0v240Z" />
                </clipPath>
                <clipPath id="key-art-piece-f">
                  <path fill="none" d="M480 0c-66.27 0-120 53.73-120 120h120V0Z" />
                </clipPath>
                <clipPath id="key-art-piece-g">
                  <path fill="none" d="M240 240c66.27 0 120-53.73 120-120H240v120Z" />
                </clipPath>
                <clipPath id="key-art-piece-h">
                  <path fill="none" d="M240 120c-66.27 0-120 53.73-120 120h120V120Z" />
                </clipPath>
                <clipPath id="key-art-piece-i">
                  <path fill="none" d="M240 360c0-66.27-53.73-120-120-120v120h120Z" />
                </clipPath>
                <clipPath id="key-art-piece-j">
                  <path fill="none" d="M360 240c66.27 0 120-53.73 120-120H360v120Z" />
                </clipPath>
                <clipPath id="key-art-piece-k">
                  <path fill="none" d="M0 360c0 66.27 53.73 120 120 120V360H0Z" />
                </clipPath>
                <clipPath id="book-cover-mask-left">
                  <path fill="none" d="m240,116c68.48,0,124,55.52,124,124s-55.52,124-124,124V116Z" />
                </clipPath>
                <clipPath id="book-cover-mask-right">
                  <path fill="none" d="m240,116c-68.48,0-124,55.52-124,124s55.52,124,124,124V116Z" />
                </clipPath>
              </defs>

              <g ref="bookCoverGroup" style="opacity: 0">
                <circle cx="240" cy="240" r="120" fill="#1d4449" />
                <g clip-path="url(#book-cover-mask-left)">
                  <path
                    ref="bookCoverLeft"
                    d="m240,116c68.48,0,124,55.52,124,124s-55.52,124-124,124V116Z"
                    fill="#cee3e3"
                  />
                </g>
                <g clip-path="url(#book-cover-mask-right)">
                  <path
                    ref="bookCoverRight"
                    d="m240,116c-68.48,0-124,55.52-124,124s55.52,124,124,124V116Z"
                    fill="#cee3e3"
                  />
                </g>
              </g>
              <g ref="bookBindGroup" style="opacity: 0">
                <g ref="bookBindLeft" class="text-[#1d4449]">
                  <circle ref="dot1" cx="240" cy="240" r="120" fill="currentColor" />
                  <circle ref="dot2" cx="240" cy="240" r="120" fill="currentColor" />
                  <line
                    ref="line1"
                    x1="240"
                    y1="144"
                    x2="240"
                    y2="240"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="48"
                  />
                  <line
                    ref="line2"
                    x1="240"
                    y1="336"
                    x2="240"
                    y2="240"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="48"
                  />
                </g>
                <rect
                  ref="bookBindRight"
                  x="216"
                  y="120"
                  width="48"
                  rx="24"
                  ry="24"
                  height="240"
                  fill="#1d4449"
                  style="opacity: 0"
                />
              </g>

              <g ref="keyArtGroup">
                <g ref="keyArtTopRight">
                  <g ref="keyArtTopRightCircle" fill="none" clip-path="url(#key-art-piece-b)">
                    <image v-bind="keyArtImageProps" transform="matrix(0 -.41 .41 0 -714.29 843.96)" />
                  </g>
                  <g ref="keyArtTopRightQuarterTopRight" fill="none" clip-path="url(#key-art-piece-f)">
                    <image v-bind="keyArtImageProps" transform="matrix(.62 0 0 .62 -447.28 -1237.99)" />
                  </g>
                  <g ref="keyArtTopRightQuarterTopLeft" fill="none" clip-path="url(#key-art-piece-g)">
                    <image v-bind="keyArtImageProps" transform="matrix(-.18 0 0 -.18 637.18 450)" />
                  </g>
                  <g fill="none" clip-path="url(#key-art-piece-j)">
                    <image v-bind="keyArtImageProps" transform="rotate(-180 753.98 789.03) scale(.62)" />
                  </g>
                </g>
                <g ref="keyArtBottomRight">
                  <g ref="keyArtBottomRightCircle" fill="none" clip-path="url(#key-art-piece-a)">
                    <image v-bind="keyArtImageProps" transform="matrix(.31 0 0 .31 -183 -69)" />
                  </g>
                  <g fill="none" clip-path="url(#key-art-piece-d)">
                    <image v-bind="keyArtImageProps" transform="matrix(.24 0 0 .24 -126 -162)" />
                  </g>
                </g>
                <g ref="keyArtTopLeft">
                  <g fill="none" clip-path="url(#key-art-piece-e)">
                    <image v-bind="keyArtImageProps" transform="matrix(.22 0 0 .22 -48 -325)" />
                  </g>
                  <g ref="keyArtTopLeftQuarterBottomRight" fill="none" clip-path="url(#key-art-piece-h)">
                    <image v-bind="keyArtImageProps" transform="matrix(.26 0 0 .26 -107 -404)" />
                  </g>
                </g>
                <g ref="keyArtBottomLeft">
                  <g ref="keyArtBottomLeftCircle" fill="none" clip-path="url(#key-art-piece-c)">
                    <image v-bind="keyArtImageProps" transform="matrix(.6 0 0 .6 -579 -939)" />
                  </g>
                  <g fill="none" clip-path="url(#key-art-piece-i)">
                    <image v-bind="keyArtImageProps" transform="matrix(0 .38 -.38 0 1168.26 -401)" />
                  </g>
                  <g fill="none" clip-path="url(#key-art-piece-k)">
                    <image v-bind="keyArtImageProps" transform="matrix(0 -.62 .62 0 -1575 1225)" />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 544"
          :class="[
            'absolute',
            'left-[50%]',
            'bottom-[50%]',
            'w-full',
            'max-w-[1440px]',
            'translate-x-[-50%]',
            'translate-y-[50%]',
            'origin-center',
          ]"
        >
          <g class="scale-[1.2] translate-y-[64px] sm:scale-100 sm:translate-y-0 origin-center">
            <g ref="titleRightDotsGroup">
              <component
                :is="type"
                v-for="({ type, ...props}, i) in titleRightDotsList"
                :key="`${type}-${i}`"
                v-bind="props"
              />
            </g>
            <image
              v-if="isEnglish"
              ref="titleLeft"
              x="150"
              y="200"
              width="450"
              height="180"
              :xlink:href="titleLeftImage"
            />
            <image
              v-else
              ref="titleLeft"
              x="150"
              y="120"
              width="400"
              height="270"
              :xlink:href="titleLeftImage"
            />
            <image
              v-if="isEnglish"
              ref="titleRight"
              x="850"
              y="264"
              width="450"
              height="180"
              :xlink:href="titleRightImage"
            />
            <image
              v-else
              ref="titleRight"
              x="900"
              y="200"
              width="520"
              height="238"
              :xlink:href="titleRightImage"
            />
          </g>
        </svg>
      </div>

      <Transition name="fade">
        <div v-if="isAnimationCompleted" class="absolute top-full sm:top-auto sm:bottom-0 right-0 m-[0.5rem] sm:m-[1rem]">
          <ToolTips :tool-tip-text="$t('nft_book_hero_replay_animation_button')">
            <ButtonV2
              preset="outline"
              size="mini"
              :circle="true"
              @click="replayAnimation"
            >
              <IconRefresh class="w-[16px]" />
            </ButtonV2>
          </ToolTips>
        </div>
        <div v-else-if="isShowSkipButton" class="absolute bottom-0 right-0 m-[0.5rem] sm:m-[1rem]">
          <ToolTips :tool-tip-text="$t('nft_book_hero_skip_animation_button')">
            <ButtonV2
              preset="outline"
              size="mini"
              :circle="true"
              @click="skipAnimation"
            >
              <IconSkipNext class="w-[16px]" />
            </ButtonV2>
          </ToolTips>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import { checkIsMobileClient } from '~/util/client';
import { logTrackerEvent } from '~/util/EventLogger';

import titleLeftImageEn from '~/assets/images/nft/hero/title-left-en.png';
import titleLeftImageZh from '~/assets/images/nft/hero/title-left-zh.png';
import titleRightImageEn from '~/assets/images/nft/hero/title-right-en.png';
import titleRightImageZh from '~/assets/images/nft/hero/title-right-zh.png';
import keyArtImage from '~/assets/images/nft/hero/key-art-graphic.jpg';

// NOTE: Control key art speed
const KEY_ART_SPEED = 0.5;

const SESSION_STORAGE_KEY = 'nft_book_hero_animation';

export default {
  name: 'NFTBookHero',
  data() {
    return {
      isAnimationCompleted: false,
      isShowSkipButton: false,
    };
  },
  computed: {
    isEnglish() {
      return this.$i18n.locale === 'en';
    },
    titleRightImage() {
      return this.isEnglish ? titleRightImageEn : titleRightImageZh;
    },
    titleLeftImage() {
      return this.isEnglish ? titleLeftImageEn : titleLeftImageZh;
    },
    keyArtImageProps() {
      return {
        'xlink:href': keyArtImage,
        width: 2400,
        height: 3600,
      };
    },
    titleRightDotRectProps() {
      return {
        rx: 6,
        ry: 6,
        height: 12,
        fill: '#fff',
      };
    },
    titleRightDotCircleProps() {
      return {
        r: 10.71,
        fill: 'none',
        stroke: '#fff',
        'stroke-miterlimit': 10,
        'stroke-width': 7.86,
      };
    },
    titleRightDotsList() {
      const elements = [];

      elements.push(
        ...(this.isEnglish
          ? [
              { x: 78.27, y: 289.08, width: 34 },
              { x: 324.6, y: 399.25, width: 34 },
              { x: 152.79, y: 399.25, width: 34 },
              { x: 243.22, y: 399.25, width: 68.21 },
              { x: 104.89, y: 258.42, width: 136.21 },
              { x: 266.54, y: 258.42, width: 36.57 },
              { x: 376.03, y: 258.42, width: 36.57 },
            ]
          : [
              { x: 943, y: 271.22, width: 36.31 },
              { x: 1320.69, y: 363.62, width: 59.25 },
              { x: 1206.11, y: 388.89, width: 36.31 },
              { x: 1022.6, y: 388.89, width: 36.31 },
              { x: 1119.19, y: 388.89, width: 72.86 },
              { x: 971.43, y: 238.47, width: 145.49 },
              { x: 1144.09, y: 238.47, width: 39.07 },
              { x: 1261.05, y: 238.47, width: 39.07 },
            ]
        ).map(props => ({
          ...this.titleRightDotRectProps,
          ...props,
          type: 'rect',
        }))
      );

      elements.push(
        ...(this.isEnglish
          ? [{ cx: 336.74, cy: 264.27 }, { cx: 214.54, cy: 405.09 }]
          : [{ cx: 1088.55, cy: 395.13 }, { cx: 1219.07, cy: 244.71 }]
        ).map(props => ({
          ...this.titleRightDotCircleProps,
          ...props,
          type: 'circle',
        }))
      );

      return elements.map(props => ({
        ...props,
        class: 'animate-pulse',
        style: `animation-delay: ${Math.random() * 2}s`,
      }));
    },
  },
  beforeUnmount() {
    this.stopMouseAnimation();
  },
  mounted() {
    this.animate();
  },
  methods: {
    animate() {
      const {
        hero,
        banner,
        dot1,
        dot2,
        line1,
        line2,
        bgOutlinedBoxes,
        bookBindLeft,
        bookBindRight,
        bookBindGroup,
        bookCoverLeft,
        bookCoverRight,
        bookCoverGroup,
        keyArtWrapper,
        keyArtSVG,
        keyArtGroup,
        keyArtTopRight,
        keyArtTopRightCircle,
        keyArtTopRightQuarterTopRight,
        keyArtTopRightQuarterTopLeft,
        keyArtBottomRight,
        keyArtBottomRightCircle,
        keyArtTopLeft,
        keyArtTopLeftQuarterBottomRight,
        keyArtBottomLeft,
        keyArtBottomLeftCircle,
        prepend,
        titleLeft,
        titleRight,
        titleRightDotsGroup,
      } = this.$refs;

      const boxesPaths = [...bgOutlinedBoxes.childNodes]
        .map(el => el.childNodes[0])
        .filter(el => el?.tagName === 'path');
      this.$gsap.gsap.to(boxesPaths, {
        rotation: 'random(-8, 8, 1)',
        duration: 'random(3, 5, 0.5)',
        stagger: {
          each: 0.1,
          repeat: -1,
          yoyo: true,
        },
        ease: 'power1.inOut',
        transformOrigin: 'center center',
      });

      const hasAnimatedInThisSession = this.getHasPreviouslyAnimated();
      if (hasAnimatedInThisSession) {
        this.$gsap.gsap.set(hero, { opacity: 1 });
        this.isAnimationCompleted = true;
        this.startMouseAnimation();
        this.startScrollingAnimation();
        this.notifyAnimationComplete();
        return;
      }
      this.isAnimationCompleted = false;
      this.isShowSkipButton = true;
      this.setHasPreviouslyAnimated();

      this.animation = this.$gsap.gsap.timeline({
        onComplete: () => {
          this.isAnimationCompleted = true;
        },
      });

      this.animation.set(bgOutlinedBoxes, { y: 0 });

      this.animation.fromTo(
        hero,
        { opacity: 0 },
        {
          opacity: 1,
          delay: 0.5,
        }
      );

      const dotTimeline = this.$gsap.gsap.timeline();
      // Reset elements transform
      dotTimeline.set(keyArtSVG, { transform: 'rotate3d(0, 0, 0, 0deg)' });
      dotTimeline.set([dot1, dot2], { transform: '' });
      dotTimeline.set([dot1, dot2], {
        scale: 0.1,
        svgOrigin: '240px 240px',
      });
      dotTimeline.set([line1, line2], { opacity: 0 });
      dotTimeline.set(
        [bookCoverGroup, bookBindGroup, bookCoverLeft, bookCoverRight],
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          scale: 1,
          clearProps: 'transform',
          svgOrigin: '240px 240px',
        }
      );
      dotTimeline.set([bookBindLeft, bookBindRight], {
        rotation: 0,
        scale: 1,
        svgOrigin: '240px 336px',
      });
      dotTimeline.set(bookBindRight, { opacity: 0 });

      dotTimeline.addLabel('dotAnimationStart');

      dotTimeline.from(keyArtWrapper, { opacity: 0 }, 'dotAnimationStart');

      dotTimeline.to(
        dot1,
        {
          keyframes: {
            scale: [0, 0.2, 0.2],
            y: [0, 0, -96],
          },
          duration: 1,
          svgOrigin: '240px 240px',
        },
        'dotAnimationStart'
      );

      dotTimeline.to(
        dot2,
        {
          keyframes: {
            scale: [0, 0.2, 0.2],
            y: [0, 0, 96],
          },
          duration: 1,
          svgOrigin: '240px 240px',
        },
        'dotAnimationStart'
      );

      dotTimeline.set([line1, line2], {
        opacity: 1,
        attr: { y2: 240 },
        clearProps: 'opacity',
      });

      dotTimeline.addLabel('dotAnimationEnd');

      dotTimeline.from(
        line1,
        {
          attr: { y2: 144 },
          duration: 0.5,
          ease: 'power1.out',
        },
        'dotAnimationEnd'
      );

      dotTimeline.from(
        line2,
        {
          attr: { y2: 336 },
          duration: 0.5,
          ease: 'power1.out',
        },
        'dotAnimationEnd'
      );

      dotTimeline.to(
        bookBindGroup,
        {
          y: -54,
          scale: 0.6,
          svgOrigin: '240px 240px',
          ease: 'power1.inOut',
          duration: 0.5,
        },
        'dotAnimationEnd'
      );

      dotTimeline.addLabel('openBook');

      dotTimeline.set(bookBindRight, { opacity: 1 });

      dotTimeline.to(
        bookBindLeft,
        {
          rotation: 75,
          duration: 0.65,
          scale: 0.93,
          svgOrigin: '240px 336px',
          ease: 'power1.in',
        },
        'openBook'
      );
      dotTimeline.to(
        bookBindRight,
        {
          rotation: -75,
          duration: 0.65,
          scale: 0.93,
          svgOrigin: '240px 336px',
          ease: 'power1.in',
        },
        'openBook'
      );

      dotTimeline.to(
        bookCoverLeft,
        {
          rotation: 75,
          duration: 0.65,
          svgOrigin: '240px 240px',
          ease: 'power1.in',
        },
        'openBook'
      );
      dotTimeline.to(
        bookCoverRight,
        {
          rotation: -75,
          duration: 0.65,
          svgOrigin: '240px 240px',
          ease: 'power1.in',
        },
        'openBook'
      );

      this.animation.add(dotTimeline);

      this.animation.addLabel('keyArtMorphingStart');

      const boxes = [...bgOutlinedBoxes.childNodes].filter(
        el => el.tagName === 'g'
      );
      this.animation.from(
        boxes,
        {
          scale: 0.5,
          rotation: -30,
          duration: 1,
          opacity: 0,
          clearProps: 'transform',
          stagger: 0.25,
          transformOrigin: 'center center',
          onComplete: () => {
            this.startMouseAnimation();
            this.startScrollingAnimation();
          },
        },
        'keyArtMorphingStart'
      );

      this.animation.to(
        [bookCoverGroup, bookBindGroup],
        {
          rotation: -360,
          duration: 0.8,
          scale: 0,
          svgOrigin: '240px 240px',
          ease: 'linear',
        },
        'keyArtMorphingStart'
      );
      this.animation.from(
        keyArtGroup,
        {
          opacity: 0,
          rotation: 135,
          duration: 1.5,
          svgOrigin: '240px 240px',
          ease: 'power3.out',
        },
        'keyArtMorphingStart'
      );

      this.animation.to(
        keyArtTopRight,
        {
          keyframes: {
            x: [-120, -120, 0, 0],
            y: [120, 120, 120, 0],
            rotation: [90, 0, 0, 0],
          },
          duration: 4 * KEY_ART_SPEED,
          svgOrigin: '360px 120px',
        },
        'keyArtMorphingStart'
      );

      this.animation.to(
        keyArtTopRightQuarterTopRight,
        {
          keyframes: {
            x: [-120, 0],
          },
          duration: 2 * KEY_ART_SPEED,
          svgOrigin: '360px 120px',
        },
        'keyArtMorphingStart'
      );

      this.animation.to(
        keyArtTopRightQuarterTopLeft,
        {
          keyframes: {
            y: [120, 120, 0],
            rotation: [90, 0, 0],
          },
          duration: 3 * KEY_ART_SPEED,
          svgOrigin: '360px 120px',
        },
        'keyArtMorphingStart'
      );

      this.animation.fromTo(
        keyArtTopRightCircle,
        {
          y: 60,
          x: 60,
          svgOrigin: '360px 120px',
        },
        {
          keyframes: {
            y: [60, 60, 0],
            x: [60, 0, 0],
          },
          duration: 3 * KEY_ART_SPEED,
          delay: 1.25,
        },
        'keyArtMorphingStart'
      );

      this.animation.to(
        keyArtBottomRight,
        {
          keyframes: {
            x: [-120, -120, -120, 0],
            y: [-120, -120, 0, 0],
            rotation: [90, 0, 0, 0],
          },
          duration: 4 * KEY_ART_SPEED,
          svgOrigin: '360px 360px',
        },
        'keyArtMorphingStart'
      );

      this.animation.fromTo(
        keyArtBottomRightCircle,
        {
          y: -60,
          x: -60,
          svgOrigin: '360px 360px',
        },
        {
          keyframes: {
            y: [-60, 0, 0],
            x: [-60, -60, 0],
          },
          delay: 1.5 * KEY_ART_SPEED,
          duration: 3 * KEY_ART_SPEED,
        },
        'keyArtMorphingStart'
      );

      this.animation.to(
        keyArtTopLeftQuarterBottomRight,
        {
          keyframes: {
            rotation: [-90, 0],
          },
          duration: 2 * KEY_ART_SPEED,
          svgOrigin: '120px 240px',
        },
        'keyArtMorphingStart'
      );

      this.animation.to(
        keyArtTopLeft,
        {
          keyframes: {
            x: [120, 120, 0, 0],
            y: [120, 0, 0, 0],
            rotation: [-90, -90, -90, 0],
          },
          duration: 4 * KEY_ART_SPEED,
          svgOrigin: '120px 120px',
        },
        'keyArtMorphingStart'
      );

      this.animation.to(
        keyArtBottomLeft,
        {
          keyframes: {
            x: [120, 0, 0, 0],
            y: [-120, -120, -120, 0],
            rotation: [90, 90, 0, 0],
          },
          duration: 4 * KEY_ART_SPEED,
          svgOrigin: '120px 360px',
        },
        'keyArtMorphingStart'
      );

      this.animation.fromTo(
        keyArtBottomLeftCircle,
        {
          y: -60,
          x: -60,
          svgOrigin: '120px 360px',
        },
        {
          keyframes: {
            y: [-60, 0, 0],
            x: [-60, -60, 0],
          },
          duration: 3 * KEY_ART_SPEED,
          delay: 1.75 * KEY_ART_SPEED,
        },
        'keyArtMorphingStart'
      );

      this.animation.from(
        titleLeft,
        {
          opacity: 0,
          duration: 1,
        },
        '-=0.8'
      );
      this.animation.from(
        [titleRight, titleRightDotsGroup],
        {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            this.isShowSkipButton = false;
            this.notifyAnimationComplete();
          },
        },
        '-=0.8'
      );

      this.animation.addLabel('keyArtAnimationEnd');

      this.animation.from(
        prepend,
        {
          y: '-100%',
          duration: 1,
          clearProps: 'transform',
          ease: 'power1.inOut',
        },
        'keyArtAnimationEnd'
      );

      this.animation.from(
        banner,
        {
          y: `${-prepend.clientHeight / 2}px`,
          duration: 2,
          clearProps: 'transform',
          ease: 'power1.inOut',
        },
        'keyArtAnimationEnd'
      );

      this.animation.to(
        bgOutlinedBoxes,
        {
          y: `+=${prepend.clientHeight / 2}px`,
          duration: 2,
          ease: 'power1.inOut',
          transformOrigin: 'center center',
        },
        'keyArtAnimationEnd'
      );

      this.animation.from(
        hero,
        {
          height: window.innerHeight,
          duration: 2,
          clearProps: 'height',
          ease: 'power1.inOut',
        },
        'keyArtAnimationEnd'
      );

      // NOTE: Uncomment to pause timeline for debugging
      // this.animation.pause('keyArtMorphingStart+=0.1');
    },
    animateKeyArtTransform() {
      if (!this.isAnimationCompleted) return;

      const dx = this.mouse.x - this.cx;
      const dy = this.mouse.y - this.cy;
      const tiltX = dy / this.cy;
      const tiltY = -(dx / this.cx);
      const radius = Math.sqrt(tiltX ** 2 + tiltY ** 2);
      const degree = radius * 20;

      this.$gsap.gsap.to(this.$refs.keyArtSVG, 1, {
        transform: `rotate3d(${tiltX}, ${tiltY}, 0, ${degree}deg)`,
        ease: 'power2.out',
        transformOrigin: 'center center',
      });
    },
    startMouseAnimation() {
      const isMobile = checkIsMobileClient();
      if (isMobile) return;

      // NOTE: These are not reactive, so we need to set them here
      this.mouse = { x: 0, y: 0 };
      this.cx = 0;
      this.cy = 0;

      window.addEventListener('mousemove', this.handleMouseMove);
      this.setCenterForMouseAnimation();
      window.addEventListener('resize', this.setCenterForMouseAnimation);
    },
    stopMouseAnimation() {
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('resize', this.setCenterForMouseAnimation);
    },
    startScrollingAnimation() {
      const { hero, bgOutlinedBoxes } = this.$refs;
      const boxes = [...bgOutlinedBoxes.childNodes].filter(
        el => el.tagName === 'g'
      );
      boxes.reverse();
      const scrollAnimation = this.$gsap.gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom+=25% top',
          scrub: true,
        },
      });
      scrollAnimation.to(boxes, {
        duration: 1,
        stagger: 0.1,
        rotation: 50,
        ease: 'power1.in',
        transformOrigin: 'center center',
      });
    },
    getHasPreviouslyAnimated() {
      let shouldStopAnimation = false;
      try {
        shouldStopAnimation = localStorage.getItem(SESSION_STORAGE_KEY) === '1';
      } catch {}
      return shouldStopAnimation;
    },
    setHasPreviouslyAnimated() {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, '1');
      } catch {}
    },
    removeHasPreviouslyAnimated() {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {}
    },
    notifyAnimationComplete() {
      this.$emit('animate-complete');
    },
    skipAnimation() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_book_skip_animation_button_clicked',
        '',
        1
      );
      this.isShowSkipButton = false;
      if (!this.animation) return;
      this.$gsap.gsap.to(this.animation, {
        progress: 1,
        duration: 1,
        ease: 'power1.out',
      });
    },
    replayAnimation() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_book_restart_animation_button_clicked',
        '',
        1
      );
      this.removeHasPreviouslyAnimated();
      this.stopMouseAnimation();
      this.animate();
    },
    setCenterForMouseAnimation() {
      const { hero } = this.$refs;
      if (!hero) return;
      this.cx = hero.clientWidth / 2;
      this.cy = hero.clientHeight / 2;
    },
    handleMouseMove(event) {
      const { hero } = this.$refs;
      if (!hero || !this.isAnimationCompleted) return;
      this.mouse.x = event.pageX;
      this.mouse.y = Math.min(event.pageY, hero.clientHeight);

      cancelAnimationFrame(this.animateKeyArtTransformRequest);
      this.animateKeyArtTransformRequest = requestAnimationFrame(
        this.animateKeyArtTransform
      );
    },
  },
};
</script>
