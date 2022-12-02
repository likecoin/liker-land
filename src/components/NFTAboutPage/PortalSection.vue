<!-- eslint-disable vue/no-v-html -->
<template>
  <section
    class="items-start justify-center w-full laptop:flex nft-portal-graph"
    style="opacity: 0"
  >
    <div
      class="
        laptop:mt-[260px] laptop:-mr-[224px] laptop:max-w-[400px]
        relative
        z-1
      "
    >
      <h1
        class="
          laptop:mb-[16px]
          text-[48px] text-center
          leading-[72px]
          laptop:text-left laptop:text-[72px]
          font-proxima font-[300]
          laptop:leading-[72px]
          text-like-green
        "
      >
        {{ $t('about_nft_page_nft_portal_title') }}
      </h1>
      <div
        class="hidden laptop:block leading-[22px] nft-portal-graph__description"
        v-html="$t('about_nft_page_nft_portal_description')"
      />
    </div>
    <div class="max-w-[690px] w-full relative">
      <svg
        class="absolute laptop:relative"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 690 410"
      >
        <filter id="nft-portal-graph-blur">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter id="nft-portal-graph-shadow" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="10" stdDeviation="8" flood-opacity="0.04" />
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.1" />
        </filter>
        <defs>
          <radialGradient
            id="a"
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
            id="b"
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
            id="c"
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
            id="d"
            cx="-1075.04"
            cy="801.27"
            fx="-1075.04"
            fy="801.27"
            r="1"
            gradientTransform="translate(101743.74 296548.9) rotate(21.37) scale(188.44 -298.45)"
            xlink:href="#a"
          />
          <radialGradient
            id="e"
            cx="-1084.98"
            cy="796.25"
            fx="-1084.98"
            fy="796.25"
            r="1"
            gradientTransform="translate(-48435.96 -262564.19) rotate(-149.92) scale(160.3 -254.68)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#f1ff9a" />
            <stop offset=".73" stop-color="#71a988" stop-opacity=".24" />
          </radialGradient>
          <radialGradient
            id="f"
            cx="-1074.99"
            cy="799.85"
            fx="-1074.99"
            fy="799.85"
            r="1"
            gradientTransform="translate(251940.03 193681.04) rotate(-3.66) scale(222.19 -261.66)"
            xlink:href="#c"
          />
          <radialGradient
            id="g"
            cx="-1075.93"
            cy="801"
            fx="-1075.93"
            fy="801"
            r="1"
            gradientTransform="translate(77924.5 377702.03) rotate(25.85) scale(218.08 -382.02)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".36" stop-color="#2ec0af" />
            <stop offset="1" stop-color="#33d875" stop-opacity="0" />
          </radialGradient>
          <radialGradient
            id="h"
            cx="-1084.55"
            cy="797.75"
            fx="-1084.55"
            fy="797.75"
            gradientTransform="translate(-58705.11 -406693.09) rotate(-157.38) scale(194.59 -442.2)"
            xlink:href="#e"
          />
          <radialGradient
            id="i"
            cx="-1052.75"
            cy="787.98"
            fx="-1052.75"
            fy="787.98"
            gradientTransform="translate(51990 2797.52) rotate(-39) scale(36.5 -43.89)"
            xlink:href="#c"
          />
          <clipPath id="nft-portal-def-clip">
            <path
              d="M298.61,63.35h348c4.42,0,8,3.58,8,8V215.35H290.61V71.35c0-4.42,3.58-8,8-8Z"
            />
          </clipPath>
        </defs>
        <rect
          y="50.9"
          width="259"
          height="320"
          rx="16"
          ry="16"
          fill="#fff"
        />
        <g class="nft-portal-graph__lines">
          <rect
            x="32"
            y="82.9"
            width="140.73"
            height="8"
            rx="4"
            ry="4"
            fill="#ebebeb"
          />
          <rect
            x="32"
            y="110.9"
            width="192"
            height="8"
            rx="4"
            ry="4"
            fill="#ebebeb"
          />
          <rect
            x="32"
            y="138.9"
            width="192"
            height="8"
            rx="4"
            ry="4"
            fill="#ebebeb"
          />
          <rect
            x="32.5"
            y="166.9"
            width="192"
            height="8"
            rx="4"
            ry="4"
            fill="#ebebeb"
          />
          <rect
            x="32.5"
            y="194.9"
            width="192"
            height="8"
            rx="4"
            ry="4"
            fill="#ebebeb"
          />
          <rect
            x="32.5"
            y="222.9"
            width="140.23"
            height="8"
            rx="4"
            ry="4"
            fill="#ebebeb"
          />
          <rect
            x="32.5"
            y="250.9"
            width="62.83"
            height="8"
            rx="4"
            ry="4"
            fill="#ebebeb"
          />
        </g>

        <g
          class="nft-portal-graph__url-bar"
          filter="url(#nft-portal-graph-shadow)"
        >
          <g>
            <path
              d="M47,30.9H212c8.28,0,15,6.72,15,15h0c0,8.28-6.72,15-15,15H47c-8.28,0-15-6.72-15-15h0c0-8.28,6.72-15,15-15Z"
              fill="#fff"
            />
            <path
              d="M47,31.9H212c7.73,0,14,6.27,14,14h0c0,7.73-6.27,14-14,14H47c-7.73,0-14-6.27-14-14h0c0-7.73,6.27-14,14-14Z"
              fill="none"
              stroke="#fff"
              stroke-width="2"
            />
            <path
              d="M47,31.9H212c7.73,0,14,6.27,14,14h0c0,7.73-6.27,14-14,14H47c-7.73,0-14-6.27-14-14h0c0-7.73,6.27-14,14-14Z"
              fill="none"
              stroke="url(#a)"
              stroke-width="2"
            />
            <path
              d="M47,31.9H212c7.73,0,14,6.27,14,14h0c0,7.73-6.27,14-14,14H47c-7.73,0-14-6.27-14-14h0c0-7.73,6.27-14,14-14Z"
              fill="none"
              stroke="url(#b)"
              stroke-width="2"
            />
            <path
              d="M47,31.9H212c7.73,0,14,6.27,14,14h0c0,7.73-6.27,14-14,14H47c-7.73,0-14-6.27-14-14h0c0-7.73,6.27-14,14-14Z"
              fill="none"
              stroke="url(#c)"
              stroke-opacity=".3"
              stroke-width="2"
            />
          </g>
          <g class="nft-portal-graph__url">
            <path
              d="M45.97,42.31v1.91c0,.2,0,.39-.02,.58,0,.19-.02,.34-.03,.44h.06c.11-.19,.25-.34,.42-.46,.17-.12,.35-.22,.56-.28,.21-.06,.43-.09,.66-.09,.41,0,.76,.07,1.05,.21,.29,.14,.51,.35,.66,.64,.16,.29,.23,.67,.23,1.13v3.53h-1.15v-3.31c0-.42-.09-.73-.26-.94-.17-.21-.44-.32-.8-.32s-.62,.07-.83,.22c-.2,.14-.35,.36-.43,.64-.09,.28-.13,.62-.13,1.03v2.69h-1.15v-7.6h1.15Z"
              fill="#4a4a4a"
              fill-rule="evenodd"
            />
            <path
              d="M53.19,49.07c.15,0,.3-.01,.44-.04,.15-.03,.28-.06,.4-.1v.87c-.13,.06-.29,.1-.49,.14s-.41,.06-.63,.06c-.31,0-.58-.05-.83-.15-.24-.1-.44-.28-.58-.53-.14-.25-.21-.6-.21-1.04v-2.91h-.74v-.51l.79-.41,.38-1.16h.72v1.2h1.55v.87h-1.55v2.89c0,.27,.07,.48,.21,.61,.14,.13,.32,.2,.54,.2Z"
              fill="#4a4a4a"
              fill-rule="evenodd"
            />
            <path
              d="M57.14,49.07c.15,0,.3-.01,.44-.04,.15-.03,.28-.06,.4-.1v.87c-.13,.06-.29,.1-.49,.14-.2,.04-.41,.06-.63,.06-.31,0-.58-.05-.83-.15-.24-.1-.44-.28-.58-.53-.14-.25-.21-.6-.21-1.04v-2.91h-.74v-.51l.79-.41,.38-1.16h.72v1.2h1.55v.87h-1.55v2.89c0,.27,.07,.48,.21,.61,.14,.13,.32,.2,.54,.2Z"
              fill="#4a4a4a"
              fill-rule="evenodd"
            />
            <path
              d="M61.86,44.4c.64,0,1.16,.23,1.54,.7,.39,.47,.59,1.17,.59,2.09,0,.61-.09,1.13-.27,1.55-.18,.42-.43,.73-.76,.95-.32,.21-.7,.32-1.13,.32-.27,0-.51-.04-.71-.11-.2-.07-.37-.16-.52-.28-.14-.12-.26-.24-.36-.38h-.07c.02,.13,.03,.28,.04,.43,.02,.16,.02,.3,.02,.43v2.2h-1.15v-7.8h.94l.16,.75h.05c.1-.15,.22-.29,.37-.42,.15-.13,.32-.23,.53-.31,.21-.08,.45-.12,.73-.12Zm-.31,.94c-.32,0-.57,.06-.76,.19-.19,.12-.33,.31-.42,.56-.08,.25-.13,.56-.14,.94v.16c0,.4,.04,.74,.12,1.02,.08,.28,.22,.49,.42,.63,.2,.14,.46,.21,.79,.21,.28,0,.51-.08,.69-.23,.19-.15,.32-.37,.42-.65,.09-.28,.14-.62,.14-1,0-.58-.1-1.04-.31-1.36-.21-.32-.52-.48-.95-.48Z"
              fill="#4a4a4a"
              fill-rule="evenodd"
            />
            <path
              d="M68.95,48.36c0,.35-.09,.65-.26,.9-.17,.24-.42,.43-.76,.56-.33,.12-.73,.19-1.21,.19-.38,0-.7-.03-.98-.08-.27-.05-.53-.13-.77-.24v-.99c.26,.12,.55,.22,.86,.31,.32,.09,.63,.13,.91,.13,.38,0,.65-.06,.82-.18,.17-.12,.25-.28,.25-.48,0-.12-.03-.22-.1-.31-.07-.09-.19-.19-.37-.29-.18-.1-.44-.22-.79-.36-.34-.14-.63-.27-.86-.41-.23-.14-.41-.3-.53-.49-.12-.2-.18-.44-.18-.75,0-.48,.19-.84,.57-1.09,.38-.25,.88-.38,1.51-.38,.33,0,.64,.03,.94,.1,.3,.07,.59,.16,.87,.29l-.36,.86c-.24-.11-.49-.2-.74-.26-.24-.07-.49-.11-.75-.11-.3,0-.52,.05-.68,.14-.15,.09-.23,.22-.23,.39,0,.13,.04,.23,.11,.32,.07,.09,.2,.18,.39,.26,.19,.09,.44,.2,.77,.33,.32,.12,.6,.25,.83,.39,.24,.13,.42,.3,.55,.49,.13,.2,.19,.45,.19,.76Z"
              fill="#4a4a4a"
              fill-rule="evenodd"
            />
            <path
              d="M70.03,49.3c0-.27,.07-.45,.21-.56,.14-.11,.31-.17,.51-.17s.37,.06,.51,.17c.14,.11,.21,.29,.21,.56s-.07,.45-.21,.57c-.14,.11-.31,.17-.51,.17s-.37-.06-.51-.17c-.14-.12-.21-.31-.21-.57Zm0-4.18c0-.27,.07-.46,.21-.57,.14-.11,.31-.17,.51-.17s.37,.06,.51,.17c.14,.11,.21,.3,.21,.57s-.07,.44-.21,.56c-.14,.11-.31,.17-.51,.17s-.37-.06-.51-.17c-.14-.12-.21-.3-.21-.56Z"
              fill="#4a4a4a"
              fill-rule="evenodd"
            />
            <polygon
              points="75.94 42.77 73.28 49.9 72.2 49.9 74.86 42.77 75.94 42.77"
              fill="#4a4a4a"
              fill-rule="evenodd"
            />
            <polygon
              points="79.84 42.77 77.18 49.9 76.11 49.9 78.77 42.77 79.84 42.77"
              fill="#4a4a4a"
              fill-rule="evenodd"
            />
            <circle
              v-for="(props, index) in dotProps"
              :key="`nft-portal-graph__url-dot-${index}`"
              v-bind="props"
              r="1.5"
              fill="#4a4a4a"
            />
          </g>
        </g>
      </svg>
      <div
        class="
          laptop:absolute
          top-0
          right-0
          w-full
          ml-auto
          mt-[24px]
          laptop:pl-[16px]
          max-w-[435px]
          scale-[0.8]
          laptop:scale-100
          nft-portal-graph__dummy-widget
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
      <svg
        class="absolute inset-0 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 690 410"
      >
        <g
          class="nft-portal-graph__pointer"
          filter="url(#nft-portal-graph-blur)"
        >
          <path
            d="M393.61,106.77c-7.06-10.49-23.05-34.26-30.58-45.45C327.08,7.9,254.78,7,209.34,46.21"
            fill="none"
            stroke="#fff"
            stroke-linecap="round"
            stroke-width="10"
          />
          <path
            d="M393.61,106.77c-7.06-10.49-23.05-34.26-30.58-45.45C327.08,7.9,254.78,7,209.34,46.21"
            fill="none"
            stroke="url(#d)"
            stroke-linecap="round"
            stroke-width="10"
          />
          <path
            d="M393.61,106.77c-7.06-10.49-23.05-34.26-30.58-45.45C327.08,7.9,254.78,7,209.34,46.21"
            fill="none"
            stroke="url(#e)"
            stroke-linecap="round"
            stroke-width="10"
          />
          <path
            d="M393.61,106.77c-7.06-10.49-23.05-34.26-30.58-45.45C327.08,7.9,254.78,7,209.34,46.21"
            fill="none"
            stroke="url(#f)"
            stroke-linecap="round"
            stroke-opacity=".3"
            stroke-width="10"
          />
          <path
            d="M350.15,99.5l45.38,8.87,8.87-45.38"
            fill="none"
            stroke="#fff"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="10"
          />
          <path
            d="M350.15,99.5l45.38,8.87,8.87-45.38"
            fill="none"
            stroke="url(#g)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="10"
          />
          <path
            d="M350.15,99.5l45.38,8.87,8.87-45.38"
            fill="none"
            stroke="url(#h)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="10"
          />
          <path
            d="M350.15,99.5l45.38,8.87,8.87-45.38"
            fill="none"
            stroke="url(#i)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-opacity=".3"
            stroke-width="10"
          />
        </g>
      </svg>
    </div>
    <div
      class="
        laptop:hidden
        leading-[22px]
        nft-portal-graph__description
      "
      v-html="$t('about_nft_page_nft_portal_description')"
    />
  </section>
</template>

<script>
import nftMixin from '~/mixins/nft';

const dotProps = [
  { cx: 85.5, cy: 46.4 },
  { cx: 94.5, cy: 46.4 },
  { cx: 103.5, cy: 46.4 },
  { cx: 112.5, cy: 46.4 },
  { cx: 121.5, cy: 46.4 },
  { cx: 130.5, cy: 46.4 },
];

export default {
  name: 'NFTPortalGraph',
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
    dotProps() {
      return dotProps;
    },
  },
  mounted() {
    this.initAnimation();
    this.updateNFTClassMetadata();
    this.updateNFTPurchaseInfo();
  },
  methods: {
    initAnimation() {
      this.$gsap.gsap.to('.nft-portal-graph', {
        opacity: 1,
        duration: 0.2,
        clearProps: 'opacity',
      });
      const isLargerScreen = window.innerWidth > 768;
      const tl = this.$gsap.gsap.timeline({
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: `.nft-portal-graph`,
          start: `top-=100% ${isLargerScreen ? 'top+=30%' : 'top+=100%'}`,
          end: `${isLargerScreen ? 'bottom' : 'center'} center`,
          scrub: true,
        },
      });

      tl.from('.nft-portal-graph__url > *', {
        opacity: 0,
        y: 10,
        stagger: 0.1,
      });

      tl.from('.nft-portal-graph svg', {
        x: isLargerScreen ? '+=30%' : '+=45%',
        y: isLargerScreen ? '-=40%' : '-=15%',
        scale: 1.5,
        ease: 'power4.inOut',
      });

      tl.from('.nft-portal-graph__lines > rect', {
        opacity: 0,
        stagger: 0.1,
      });

      tl.from(
        '.nft-portal-graph h1',
        {
          x: isLargerScreen ? '-=100' : 0,
          scale: isLargerScreen ? 1 : 0,
          opacity: 0,
        },
        isLargerScreen ? '>-=0.6' : '<'
      );
      tl.from(
        '.nft-portal-graph__description',
        {
          x: '+=100',
          opacity: 0,
        },
        '<+=0.2'
      );

      const tl2 = this.$gsap.gsap.timeline({
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: `.nft-portal-graph`,
          start: isLargerScreen ? 'center center' : 'top-=100% center',
          end: `${isLargerScreen ? 'bottom' : 'center'} center`,
          scrub: true,
          pin: isLargerScreen,
        },
      });

      tl2.from('.nft-portal-graph__pointer', {
        opacity: 0,
        scale: 0,
        rotation: -70,
        transformOrigin: 'left 32',
      });

      tl2.from(
        '.nft-portal-graph__dummy-widget',
        {
          opacity: 0,
          x: 16,
        },
        '>-=0.25'
      );
    },
    handleClickCollectButton() {
      this.$emit('collect', this.classId);
    },
  },
};
</script>
