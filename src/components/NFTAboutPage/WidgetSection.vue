<!-- eslint-disable vue/no-v-html -->
<template>
  <section class="relative nft-widget-graph" style="opacity: 0">
    <h1
      class="
        laptop:absolute
        inset-x-0
        z-1
        top-0
        text-[48px]
        leading-[72px]
        laptop:text-[72px]
        font-proxima font-[300]
        text-like-green text-center
        laptop:mt-[48px]
      "
    >
      {{ $t('about_nft_page_nft_widget_title') }}
    </h1>
    <div
      class="mt-[16px] laptop:mt-0 items-end justify-center w-full laptop:flex"
    >
      <div class="relative laptop:max-w-[557px] w-full">
        <svg
          class="absolute inset-y-0 h-full laptop:relative"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 557 564"
        >
          <filter id="nft-widget-graph-blur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <defs>
            <radialGradient
              id="nft-widget-def-b"
              cx="-141.41"
              cy="580.35"
              fx="-141.41"
              fy="580.35"
              r="1"
              gradientTransform="translate(-24100.08 200369.26) rotate(16.44) scale(236.68 -342.28)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".36" stop-color="#8af5e9" />
              <stop offset="1" stop-color="#33d875" stop-opacity="0" />
            </radialGradient>
            <radialGradient
              id="nft-widget-def-c"
              cx="-142.44"
              cy="580.58"
              fx="-142.44"
              fy="580.58"
              r="1"
              gradientTransform="translate(-139849.23 -128123.55) rotate(142.84) scale(238.4 -322.04)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color="#f1ff9a" />
              <stop offset=".73" stop-color="#71a988" stop-opacity=".24" />
            </radialGradient>
            <radialGradient
              id="nft-widget-def-d"
              cx="-141.37"
              cy="580.13"
              fx="-141.37"
              fy="580.13"
              r="1"
              gradientTransform="translate(52011.94 135563.12) rotate(-8.61) scale(220.48 -243.7)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".22" stop-color="#a5f0e7" />
              <stop offset="1" stop-color="#f7c7c7" stop-opacity="0" />
            </radialGradient>
            <clipPath id="nft-widget-def-clip">
              <path
                d="M175,216h348c4.42,0,8,3.58,8,8v144H167V224c0-4.42,3.58-8,8-8Z"
              />
            </clipPath>
          </defs>
          <g>
            <rect
              x="0"
              y="0"
              width="414"
              height="564"
              rx="24"
              ry="24"
              fill="#fff"
            />
            <g
              class="nft-widget-graph__dummy-widget-small"
              filter="url(#nft-widget-graph-blur)"
            >
              <rect
                x="32"
                y="380"
                width="169.36"
                height="90"
                rx="12"
                ry="12"
                fill="url(#nft-widget-def-b)"
              />
              <rect
                x="32"
                y="380"
                width="169.36"
                height="90"
                rx="12"
                ry="12"
                fill="url(#nft-widget-def-c)"
              />
              <rect
                x="32"
                y="380"
                width="169.36"
                height="90"
                rx="12"
                ry="12"
                fill="url(#nft-widget-def-d)"
                fill-opacity=".3"
              />
            </g>
            <rect
              v-for="(line, index) in lineProps"
              :key="`nft-widget-graph__line-${index + 1}`"
              class="nft-widget-graph__line"
              v-bind="line"
              x="32"
              height="8"
              rx="4"
              ry="4"
              fill="#ebebeb"
            />
          </g>
        </svg>
        <div
          class="
            w-full
            mx-auto
            mb-[24px]
            laptop:pl-[16px] laptop:ml-[24px] laptop:absolute
            bottom-0
            right-0
            laptop:scale-100
            max-w-[435px]
            nft-widget-graph__dummy-widget
          "
        >
          <NFTWidget
            class="shadow-lg"
            :title="NFTName"
            :description="NFTDescription"
            :price="NFTPrice"
            :img-src="NFTImageUrl"
            :collect-button-label="widgetCollectButtonLabel"
            @collect="handleClickCollectButton"
          />
        </div>
      </div>
      <div
        class="
          nft-widget-graph__description
          mt-[16px]
          laptop:mt-[0px] laptop:max-w-[320px] laptop:mb-[70px] laptop:ml-[32px]
          leading-[22px]
        "
        v-html="$t('about_nft_page_nft_widget_description')"
      />
    </div>
  </section>
</template>


<script>
import nftMixin from '~/mixins/nft';

const lineProps = [
  { y: 48, width: 141 },
  { y: 76, width: 141 },
  { y: 128, width: 141 },
  { y: 156, width: 192 },
  { y: 184, width: 350 },
  { y: 212, width: 350 },
  { y: 240, width: 141 },
  { y: 268, width: 141 },
  { y: 324, width: 172 },
  { y: 352, width: 54 },
  { y: 490, width: 54 },
];

export default {
  name: 'NFTWidgetGraph',
  mixins: [nftMixin],
  props: {
    classId: {
      type: String,
      required: true,
    },
    widgetCollectButtonLabel: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    lineProps() {
      return lineProps;
    },
  },
  mounted() {
    this.scrollAnimation();
    this.updateNFTClassMetadata();
    this.updateNFTPurchaseInfo();
  },
  methods: {
    scrollAnimation() {
      this.$gsap.gsap.to('.nft-widget-graph', {
        opacity: 1,
        duration: 0.2,
        clearProps: 'opacity',
      });
      const isLargerScreen = window.innerWidth > 768;
      const tl = this.$gsap.gsap.timeline({
        duration: 0.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: isLargerScreen
            ? '.nft-widget-graph'
            : '.nft-widget-graph svg',
          start: 'top-=150% top',
          end: isLargerScreen ? 'bottom center' : 'center center',
          scrub: true,
        },
      });
      tl.set('.nft-widget-graph__dummy-widget', {
        scale: isLargerScreen ? 1 : 0.8,
      });
      tl.from('.nft-widget-graph h1', {
        scale: 0.3,
        opacity: 0,
      });
      tl.from(
        '.nft-widget-graph__line',
        {
          x: (Math.random() > 0.5 ? 1 : -1) * Math.random() * 16,
          opacity: 0,
          stagger: 0.1,
        },
        '<'
      );
      tl.from('.nft-widget-graph__dummy-widget-small', {
        x: 60,
        opacity: 0,
      });
      tl.from('.nft-widget-graph__description', {
        x: isLargerScreen ? '+=100%' : 'y+=50%',
        opacity: 0,
      });
      const tl2 = this.$gsap.gsap.timeline({
        duration: 0.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: isLargerScreen
            ? '.nft-widget-graph'
            : '.nft-widget-graph svg',
          start: isLargerScreen ? 'center center' : 'top center',
          end: isLargerScreen ? 'bottom center' : 'center center',
          scrub: true,
          pin: isLargerScreen,
        },
      });
      tl2.from('.nft-widget-graph__dummy-widget', {
        x: isLargerScreen ? '-10%' : '0%',
        y: '10%',
        scale: 0.3,
        opacity: 0,
        transformOrigin: '0 70%',
        duration: 0.5,
      });
    },
    handleClickCollectButton() {
      this.$emit('collect', this.classId);
    },
  },
};
</script>
