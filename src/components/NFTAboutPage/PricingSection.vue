<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/max-attributes-per-line -->
<template>
  <section
    class="relative justify-center nft-pricing-graph laptop:flex"
    style="opacity: 0"
  >
    <h1
      class="
        text-center text-[48px]
        leading-[72px]
        laptop:text-[72px]
        font-proxima font-[300]
        text-like-green
        laptop:text-right laptop:absolute laptop:mt-[1em]
        inset-x-0
        top-0
      "
    >
      {{ $t('about_nft_page_dynamic_pricing_title') }}
    </h1>
    <div class="max-w-[800px] w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 800 480"
      >
        <filter id="nft-pricing-graph-blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <defs>
          <radialGradient
            id="nft-pricing-graph-a"
            cx="-1339.79"
            cy="-223.95"
            fx="-1339.79"
            fy="-223.95"
            r="1"
            gradientTransform="translate(898985.72 -530595.29) rotate(-19.48) scale(764.77 -896.78)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".36" stop-color="#8af5e9" />
            <stop offset="1" stop-color="#33d875" stop-opacity="0" />
          </radialGradient>
          <radialGradient
            id="nft-pricing-graph-b"
            cx="-1342.1"
            cy="-220.92"
            fx="-1342.1"
            fy="-220.92"
            r="1"
            gradientTransform="translate(-896186.58 671011.17) rotate(152.6) scale(823.41 -827.67)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#f1ff9a" />
            <stop offset=".73" stop-color="#71a988" stop-opacity=".24" />
          </radialGradient>
          <radialGradient
            id="nft-pricing-graph-c"
            cx="-1337.96"
            cy="-224.98"
            fx="-1337.96"
            fy="-224.98"
            r="1"
            gradientTransform="translate(546985.09 -123671.9) rotate(-3.88) scale(413.95 -385.01)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".22" stop-color="#a5f0e7" />
            <stop offset="1" stop-color="#f7c7c7" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect
          x="62.41"
          y="229"
          width="589"
          height="193"
          rx="24"
          ry="24"
          fill="#fff"
        />
        <g class="nft-pricing-graph__grid-line">
          <rect
            x="28.41"
            y="375"
            width="730"
            height="10"
            rx="4"
            ry="4"
            fill="#ebebeb"
          />
          <path
            d="M29.41,331H757.41c.55,0,1,.45,1,1h0c0,.55-.45,1-1,1H29.41c-.55,0-1-.45-1-1h0c0-.55,.45-1,1-1Z"
            fill="#ebebeb"
            isolation="isolate"
            opacity=".8"
          />
          <path
            d="M29.41,253H757.41c.55,0,1,.45,1,1h0c0,.55-.45,1-1,1H29.41c-.55,0-1-.45-1-1h0c0-.55,.45-1,1-1Z"
            fill="#ebebeb"
            isolation="isolate"
            opacity=".6"
          />
          <path
            d="M29.41,175H757.41c.55,0,1,.45,1,1h0c0,.55-.45,1-1,1H29.41c-.55,0-1-.45-1-1h0c0-.55,.45-1,1-1Z"
            fill="#ebebeb"
            isolation="isolate"
            opacity=".2"
          />
        </g>
        <g
          class="nft-pricing-graph__graph-line"
          filter="url(#nft-pricing-graph-blur)"
        >
          <path
            d="M34.41,382c118,0,81-177,209-177,144,0,109,240,249,240,152,0,71-282,239-410"
            fill="none"
            stroke="#fff"
            stroke-linecap="round"
            stroke-width="16"
          />
          <path
            d="M34.41,382c118,0,81-177,209-177,144,0,109,240,249,240,152,0,71-282,239-410"
            fill="none"
            stroke="url(#nft-pricing-graph-a)"
            stroke-linecap="round"
            stroke-width="16"
          />
          <path
            d="M34.41,382c118,0,81-177,209-177,144,0,109,240,249,240,152,0,71-282,239-410"
            fill="none"
            stroke="url(#nft-pricing-graph-b)"
            stroke-linecap="round"
            stroke-width="16"
          />
          <path
            d="M34.41,382c118,0,81-177,209-177,144,0,109,240,249,240,152,0,71-282,239-410"
            fill="none"
            stroke="url(#nft-pricing-graph-c)"
            stroke-linecap="round"
            stroke-opacity=".3"
            stroke-width="16"
          />
        </g>
      </svg>
      <div
        class="
          nft-pricing-graph__description
          mt-[16px]
          laptop:mt-[0px]
          leading-[22px]
          laptop:max-w-[540px]
        "
        v-html="$t('about_nft_page_dynamic_pricing_description')"
      />
    </div>
  </section>
</template>

<script>
export default {
  name: 'NFTPricingGraph',
  mounted() {
    this.initAnimation();
  },
  methods: {
    initAnimation() {
      this.$gsap.gsap.to('.nft-pricing-graph', {
        opacity: 1,
        duration: 0.2,
        clearProps: 'opacity',
      });
      const tl = this.$gsap.gsap.timeline({
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: `.nft-pricing-graph`,
          start: 'top-=125% center',
          end: 'bottom center',
          scrub: true,
        },
      });

      tl.from('.nft-pricing-graph h1', {
        opacity: 0.5,
        scale: 0,
        transformOrigin:
          window.innerWidth > 768 ? '100% 100%' : 'center center',
        ease: 'elastic.out(1, 0.9)',
      });

      tl.from(
        '.nft-pricing-graph__grid-line',
        {
          opacity: 0.5,
          scaleX: 0,
          stagger: 0.25,
        },
        '<'
      );

      tl.from(
        '.nft-pricing-graph__graph-line',
        {
          ease: 'elastic.out(1, 0.9)',
          opacity: 0.3,
          scale: 0,
          transformOrigin: 'left 84%',
        },
        '>-0.3'
      );

      tl.from(
        '.nft-pricing-graph__description',
        {
          x: -100,
          opacity: 0,
        },
        '>-=0.7'
      );
    },
  },
};
</script>
