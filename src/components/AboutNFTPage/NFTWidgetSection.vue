<template>
  <section class="relative nft-widget-graph">
    <h1
      class="
        laptop:absolute
        inset-x-0
        top-0
        text-[48px]
        laptop:text-[72px]
        font-proxima font-[300]
        text-like-green text-center
        laptop:mt-[48px]
      "
    >
      {{ $t('about_nft_page_nft_widget_title') }}
    </h1>
    <div class="items-end justify-center w-full laptop:flex">
      <svg
        class="max-w-[557px] w-full"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 557 564"
      >
        <filter id="nft-widget-graph-blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="nft-widget-graph-shadow" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="10" stdDeviation="8" flood-opacity="0.04" />
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.1" />
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
        <g
          class="nft-widget-graph__dummy-widget"
          filter="url(#nft-widget-graph-shadow)"
        >
          <rect
            x="152"
            y="201"
            width="395"
            height="344"
            rx="15"
            ry="15"
            fill="#fff"
            stroke="#ebebeb"
            stroke-width="2"
          />
          <rect
            x="167"
            y="216"
            width="364"
            height="250"
            rx="8"
            ry="8"
            fill="#f7f7f7"
          />
          <image
            xlink:href="~assets/images/about/dummy-og.png"
            x="167"
            y="216"
            width="364"
            height="152"
            clip-path="url(#nft-widget-def-clip)"
          />
          <foreignObject x="183" y="384" width="332" height="40">
            <div class="text-[16px] leading-[20px] font-600">{{ title }}</div>
          </foreignObject>
          <foreignObject x="183" y="427.82" width="332" height="22">
            <div class="text-[16px] leading-[20px] text-[#4a4a4a]">
              {{ description }}
            </div>
          </foreignObject>

          <foreignObject x="183" y="491" width="73" height="22">
            <div>{{ priceLabel }}</div>
          </foreignObject>
          <g>
            <rect
              x="354"
              y="482"
              width="161"
              height="40"
              rx="12"
              ry="12"
              fill="#aaf1e7"
            />
            <foreignObject x="354" y="482" width="161" height="40">
              <div class="text-[#28646e] text-center font-600 leading-[40px]">
                {{ buttonTitle }}
              </div>
            </foreignObject>
          </g>
        </g>
      </svg>
      <div
        class="
          text-center
          laptop:text-left
          nft-widget-graph__description
          mt-[16px]
          laptop:mt-[0px] laptop:max-w-[320px] laptop:mb-[70px] laptop:ml-[32px]
          leading-[22px]
        "
      >
        {{ $t('about_nft_page_nft_widget_description') }}
      </div>
    </div>
  </section>
</template>


<script>
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
  props: {
    triggerClass: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'A Declaration of the Independence of Cyberspace',
    },
    description: {
      type: String,
      default: 'Governments of the Industrial World...',
    },
    priceLabel: {
      type: String,
      default: '250 $LIKE',
    },
    buttonTitle: {
      type: String,
      default: 'Collect this work',
    },
  },
  computed: {
    lineProps() {
      return lineProps;
    },
  },
  mounted() {
    this.scrollAnimation();
  },
  methods: {
    scrollAnimation() {
      const isLargerScreen = window.innerWidth >= 768;
      const tl = this.$gsap.gsap.timeline({
        duration: 0.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: isLargerScreen
            ? '.nft-widget-graph'
            : '.nft-widget-graph svg',
          start: isLargerScreen ? 'top-=100% top+=10%' : 'top-=200% top',
          end: isLargerScreen ? 'bottom center' : 'center center',
          scrub: true,
        },
      });
      tl.from('.nft-widget-graph h1', {
        scale: 0.3,
        opacity: 0,
      });
      tl.from(
        '.nft-widget-graph__description',
        {
          y: '+=100',
          opacity: 0,
        },
        '<'
      );
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
        x: -60,
        scale: 0.3,
        opacity: 0,
        transformOrigin: '0 240',
        duration: 0.5,
      });
    },
  },
};
</script>
