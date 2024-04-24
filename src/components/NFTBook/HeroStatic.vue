<template>
  <div class="overflow-hidden w-full">
    <div
      :class="[
        'relative',
        'flex',
        'flex-col',
        'items-stretch',
        'w-full',
        'h-full',
        'my-[-4rem]',
        'min-h-[320px] laptop:min-h-[420px] desktop:min-h-[544px]',
        'bg-[#cee3e3]',
      ]"
    >
      <div
        class="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center"
      >
        <svg
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
          <g>
            <path
              d="m737.72,1113.6l70.48-377.19,374.1,69.9-70.48,377.19-374.1-69.9Z"
            />
          </g>
          <g>
            <path
              d="m1423.98,821.12l-323.81,603.31-604.16-325.7,323.81-603.31,604.16,325.7Z"
            />
          </g>
          <g>
            <path
              d="m254.14,1082.24L833.32,254.94l832.55,582.85-579.17,827.3L254.14,1082.24Z"
            />
          </g>
          <g>
            <path
              d="m12.84,1062.66L849.56,13.72l1057.59,843.62-836.72,1048.94L12.84,1062.66Z"
            />
          </g>
        </svg>
      </div>

      <div
        class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#cee3e3] from-25% h-[60px]"
      />

      <div class="relative pointer-events-none grow">
        <div
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
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 480 480"
            >
              <defs>
                <clipPath id="key-art-piece-a">
                  <circle cx="420" cy="420" r="60" />
                </clipPath>
                <clipPath id="key-art-piece-b">
                  <circle cx="300" cy="60" r="60" />
                </clipPath>
                <clipPath id="key-art-piece-c">
                  <circle cx="180" cy="420" r="60" />
                </clipPath>
                <clipPath id="key-art-piece-d">
                  <path
                    d="M360 480c-66.27 0-120-53.73-120-120s53.73-120 120-120v240Z"
                  />
                </clipPath>
                <clipPath id="key-art-piece-e">
                  <path
                    d="M120 240C53.73 240 0 186.27 0 120S53.73 0 120 0v240Z"
                  />
                </clipPath>
                <clipPath id="key-art-piece-f">
                  <path d="M480 0c-66.27 0-120 53.73-120 120h120V0Z" />
                </clipPath>
                <clipPath id="key-art-piece-g">
                  <path d="M240 240c66.27 0 120-53.73 120-120H240v120Z" />
                </clipPath>
                <clipPath id="key-art-piece-h">
                  <path d="M240 120c-66.27 0-120 53.73-120 120h120V120Z" />
                </clipPath>
                <clipPath id="key-art-piece-i">
                  <path d="M240 360c0-66.27-53.73-120-120-120v120h120Z" />
                </clipPath>
                <clipPath id="key-art-piece-j">
                  <path d="M360 240c66.27 0 120-53.73 120-120H360v120Z" />
                </clipPath>
                <clipPath id="key-art-piece-k">
                  <path d="M0 360c0 66.27 53.73 120 120 120V360H0Z" />
                </clipPath>
                <clipPath id="book-cover-mask-left">
                  <path
                    d="m240,116c68.48,0,124,55.52,124,124s-55.52,124-124,124V116Z"
                  />
                </clipPath>
                <clipPath id="book-cover-mask-right">
                  <path
                    d="m240,116c-68.48,0-124,55.52-124,124s55.52,124,124,124V116Z"
                  />
                </clipPath>
              </defs>

              <g clip-path="url(#book-cover-mask-left)">
                <path
                  d="m240,116c68.48,0,124,55.52,124,124s-55.52,124-124,124V116Z"
                  fill="#cee3e3"
                />
              </g>
              <g clip-path="url(#book-cover-mask-right)">
                <path
                  d="m240,116c-68.48,0-124,55.52-124,124s55.52,124,124,124V116Z"
                  fill="#cee3e3"
                />
              </g>
              <g clip-path="url(#key-art-piece-b)">
                <image
                  v-bind="keyArtImageProps"
                  transform="matrix(0 -.41 .41 0 -714.29 843.96)"
                />
              </g>
              <g clip-path="url(#key-art-piece-f)">
                <image
                  v-bind="keyArtImageProps"
                  transform="matrix(.62 0 0 .62 -447.28 -1237.99)"
                />
              </g>
              <g clip-path="url(#key-art-piece-g)">
                <image
                  v-bind="keyArtImageProps"
                  transform="matrix(-.18 0 0 -.18 637.18 450)"
                />
              </g>
              <g clip-path="url(#key-art-piece-j)">
                <image
                  v-bind="keyArtImageProps"
                  transform="rotate(-180 753.98 789.03) scale(.62)"
                />
              </g>
              <g clip-path="url(#key-art-piece-a)">
                <image
                  v-bind="keyArtImageProps"
                  transform="matrix(.31 0 0 .31 -183 -69)"
                />
              </g>
              <g clip-path="url(#key-art-piece-d)">
                <image
                  v-bind="keyArtImageProps"
                  transform="matrix(.24 0 0 .24 -126 -162)"
                />
              </g>
              <g clip-path="url(#key-art-piece-e)">
                <image
                  v-bind="keyArtImageProps"
                  transform="matrix(.22 0 0 .22 -48 -325)"
                />
              </g>
              <g clip-path="url(#key-art-piece-h)">
                <image
                  v-bind="keyArtImageProps"
                  transform="matrix(.26 0 0 .26 -107 -404)"
                />
              </g>
              <g clip-path="url(#key-art-piece-c)">
                <image
                  v-bind="keyArtImageProps"
                  transform="matrix(.6 0 0 .6 -579 -939)"
                />
              </g>
              <g clip-path="url(#key-art-piece-i)">
                <image
                  v-bind="keyArtImageProps"
                  transform="matrix(0 .38 -.38 0 1168.26 -401)"
                />
              </g>
              <g clip-path="url(#key-art-piece-k)">
                <image
                  v-bind="keyArtImageProps"
                  transform="matrix(0 -.62 .62 0 -1575 1225)"
                />
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
          <g
            class="scale-[1.2] translate-y-[64px] sm:scale-100 sm:translate-y-0 origin-center"
          >
            <component
              :is="type"
              v-for="({ type, ...props }, i) in titleRightDotsList"
              :key="`${type}-${i}`"
              v-bind="props"
            />
            <image
              v-if="isEnglish"
              x="150"
              y="200"
              width="450"
              height="180"
              :xlink:href="titleLeftImage"
            />
            <image
              v-else
              x="150"
              y="120"
              width="400"
              height="270"
              :xlink:href="titleLeftImage"
            />
            <image
              v-if="isEnglish"
              x="850"
              y="264"
              width="450"
              height="180"
              :xlink:href="titleRightImage"
            />
            <image
              v-else
              x="900"
              y="200"
              width="520"
              height="238"
              :xlink:href="titleRightImage"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import titleLeftImageEn from '~/assets/images/nft/hero/title-left-en.png';
import titleLeftImageZh from '~/assets/images/nft/hero/title-left-zh.png';
import titleRightImageEn from '~/assets/images/nft/hero/title-right-en.png';
import titleRightImageZh from '~/assets/images/nft/hero/title-right-zh.png';
import keyArtImage from '~/assets/images/nft/hero/key-art-graphic.jpg';
import shadowImage from '~/assets/images/nft/hero/key-art-shadow.png';

export default {
  name: 'NFTBookHeroStatic',
  computed: {
    isEnglish() {
      return this.$i18n.locale === 'en';
    },
    shadowStyle() {
      return {
        backgroundImage: `url(${shadowImage})`,
      };
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

      return elements;
    },
  },
};
</script>
