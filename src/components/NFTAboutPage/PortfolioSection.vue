<!-- eslint-disable vue/no-v-html -->
<template>
  <section class="laptop:min-h-[600px] nft-portfolio-graph" style="opacity: 0">
    <h1
      class="
        text-[48px] text-center
        leading-[72px]
        laptop:text-left laptop:text-[72px]
        font-proxima font-[300]
        text-like-green
        laptop:-mb-[24px]
        relative
        z-1
      "
    >
      {{ $t('about_nft_page_nft_portfolio_title') }}
    </h1>
    <div class="mt-[16px] laptop:mt-0 items-start justify-center w-full laptop:flex">
      <div class="overflow-hidden">
        <svg
          class="transform scale-[2] mx-auto max-w-[375px] w-full"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 750 360"
        >
          <filter id="nft-portfolio-graph-blur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <defs>
            <radialGradient
              id="nft-portfolio-def-b"
              cx="-43.65"
              cy="475.48"
              fx="-43.65"
              fy="475.48"
              r="1"
              gradientTransform="translate(33821.91 54770.08) rotate(-27.85) scale(93.75 -134.33)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".36" stop-color="#8af5e9" />
              <stop offset="1" stop-color="#33d875" stop-opacity="0" />
            </radialGradient>
            <radialGradient
              id="nft-portfolio-def-c"
              cx="-48.46"
              cy="479.94"
              fx="-48.46"
              fy="479.94"
              r="1"
              gradientTransform="translate(-3143.5 -47087.92) rotate(-180) scale(74 -98.5)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color="#f1ff9a" />
              <stop offset=".73" stop-color="#71a988" stop-opacity=".24" />
            </radialGradient>
            <radialGradient
              id="nft-portfolio-def-d"
              cx="-31.02"
              cy="476.04"
              fx="-31.02"
              fy="476.04"
              r="1"
              gradientTransform="translate(-5498.64 11013.51) rotate(31.99) scale(23.61 -25.91)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".22" stop-color="#a5f0e7" />
              <stop offset="1" stop-color="#f7c7c7" stop-opacity="0" />
            </radialGradient>
            <radialGradient
              id="nft-portfolio-def-e"
              cx="-42.27"
              cy="473.24"
              fx="-42.27"
              fy="473.24"
              r="1"
              gradientTransform="translate(16780.01 27706.67) rotate(-27.44) scale(47.2 -67.63)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".36" stop-color="#8af5e9" />
              <stop offset="1" stop-color="#33d875" stop-opacity="0" />
            </radialGradient>
            <radialGradient
              id="nft-portfolio-def-f"
              cx="-44.59"
              cy="488.29"
              fx="-44.59"
              fy="488.29"
              r="1"
              gradientTransform="translate(-14084.84 -6163.86) rotate(124.91) scale(68.39 -31.57)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color="#f1ff9a" />
              <stop offset=".73" stop-color="#71a988" stop-opacity=".24" />
            </radialGradient>
            <radialGradient
              id="nft-portfolio-def-g"
              cx="-31.02"
              cy="476.04"
              fx="-31.02"
              fy="476.04"
              r="1"
              gradientTransform="translate(-5640.05 11048.12) rotate(31.99) scale(23.61 -25.91)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".22" stop-color="#a5f0e7" />
              <stop offset="1" stop-color="#f7c7c7" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect
            v-for="(props, index) in gridProps"
            :key="`box${index}`"
            class="nft-portfolio-graph__box"
            v-bind="props"
            width="43.27"
            height="30.19"
            rx="6"
            ry="6"
            fill="#fff"
          />
          <g filter="url(#nft-portfolio-graph-blur)">
            <g
              class=" nft-portfolio-graph__highlight-box nft-portfolio-graph__highlight-box1"
            >
              <rect
                x="402.5"
                y="166.79"
                width="39.52"
                height="20.66"
                rx="4"
                ry="4"
                fill="url(#nft-portfolio-def-b)"
              />
              <rect
                x="402.5"
                y="166.79"
                width="39.52"
                height="20.66"
                rx="4"
                ry="4"
                fill="url(#nft-portfolio-def-c)"
              />
              <rect
                x="402.5"
                y="166.79"
                width="39.52"
                height="20.66"
                rx="4"
                ry="4"
                fill="url(#nft-portfolio-def-d)"
                fill-opacity=".3"
              />
            </g>
            <g
              class=" nft-portfolio-graph__highlight-box nft-portfolio-graph__highlight-box2"
            >
              <rect
                x="261.09"
                y="201.39"
                width="39.52"
                height="20.66"
                rx="4"
                ry="4"
                fill="url(#nft-portfolio-def-e)"
              />
              <rect
                x="261.09"
                y="201.39"
                width="39.52"
                height="20.66"
                rx="4"
                ry="4"
                fill="url(#nft-portfolio-def-f)"
              />
              <rect
                x="261.09"
                y="201.39"
                width="39.52"
                height="20.66"
                rx="4"
                ry="4"
                fill="url(#nft-portfolio-def-g)"
                fill-opacity=".3"
              />
            </g>
          </g>
        </svg>
      </div>
      <div
        class="
          text-left
          nft-portfolio-graph__description
          mt-[16px]
          laptop:mt-[48px] laptop:max-w-[470px] laptop:mr-[24px]
          leading-[22px]
        "
        v-html="$t('about_nft_page_nft_portfolio_description')"
      />
    </div>
  </section>
</template>

<script>
const gridProps = [
  { x: 211.5, y: 95.5 },
  { x: 258.77, y: 95.5 },
  { x: 306.03, y: 95.5 },
  { x: 353.3, y: 95.5 },
  { x: 400.56, y: 95.5 },
  { x: 447.83, y: 95.5 },
  { x: 495.1, y: 95.5 },
  { x: 211.5, y: 130.17 },
  { x: 258.77, y: 130.17 },
  { x: 306.03, y: 130.17 },
  { x: 353.3, y: 130.17 },
  { x: 400.56, y: 130.17 },
  { x: 447.83, y: 130.17 },
  { x: 495.1, y: 130.17 },
  { x: 211.5, y: 164.73 },
  { x: 258.77, y: 164.73 },
  { x: 306.03, y: 164.73 },
  { x: 353.3, y: 164.73 },
  { x: 400.5, y: 164.73 },
  { x: 447.83, y: 164.73 },
  { x: 495.1, y: 164.73 },
  { x: 211.5, y: 199.31 },
  { x: 258.77, y: 199.31 },
  { x: 306.03, y: 199.31 },
  { x: 353.3, y: 199.31 },
  { x: 400.56, y: 199.31 },
  { x: 447.83, y: 199.31 },
  { x: 495.1, y: 199.31 },
  { x: 211.5, y: 233.5 },
  { x: 258.77, y: 233.5 },
  { x: 306.03, y: 233.5 },
  { x: 353.3, y: 233.5 },
  { x: 400.56, y: 233.5 },
  { x: 447.83, y: 233.5 },
  { x: 495.1, y: 233.5 },
];

export default {
  name: 'NFTPortfolioGraph',
  computed: {
    gridProps() {
      return gridProps;
    },
  },
  mounted() {
    this.initAnimation();
  },
  methods: {
    initAnimation() {
      this.$gsap.gsap.to('.nft-portfolio-graph', {
        opacity: 1,
        duration: 0.2,
        clearProps: 'opacity',
      });
      const isLargerScreen = window.innerWidth > 768;
      const tl = this.$gsap.gsap.timeline({
        duration: 0.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: `.nft-portfolio-graph`,
          start: 'top-=60% center',
          end: `${isLargerScreen ? 'top+=20%' : 'top'} center`,
          scrub: true,
        },
      });
      tl.from('.nft-portfolio-graph h1', {
        x: isLargerScreen ? '-=100' : 0,
        scale: isLargerScreen ? 1 : 0,
        opacity: 0,
      });
      tl.from(
        '.nft-portfolio-graph__description',
        {
          y: '+=100',
          opacity: 0,
        },
        '<'
      );
      const tl2 = this.$gsap.gsap.timeline({
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: `.nft-portfolio-graph`,
          start: 'top-=25% center-=25%',
          end: `${isLargerScreen ? 'bottom+=15%' : 'center'} center`,
          scrub: true,
          pin: isLargerScreen,
        },
      });
      tl2.addLabel('start');

      tl2.from('.nft-portfolio-graph__highlight-box', {
        opacity: 0,
        stagger: 1,
      });

      const randomBox1X = this.$gsap.gsap.utils.random(-4, 2, 1, true);
      const randomBox1Y = this.$gsap.gsap.utils.random(-2, 2, 1, true);
      const randomBox2X = this.$gsap.gsap.utils.random(-1, 5, 1, true);
      const randomBox2Y = this.$gsap.gsap.utils.random(-3, 1, 1, true);
      new Array(9)
        .fill()
        .map(() => [
          { x: randomBox1X(), y: randomBox1Y() },
          { x: randomBox2X(), y: randomBox2Y() },
        ])
        .concat([[{ x: 0, y: 0 }, { x: 0, y: 0 }]])
        .map((params, i) =>
          params.map(param => ({
            x: param.x * 47.335,
            y: param.y * 34.1219,
            duration: 2,
            opacity: 1,
            clearProps: 'opacity',
          }))
        )
        .forEach(([p1, p2]) => {
          tl2.to('.nft-portfolio-graph__highlight-box1', {
            ...p1,
          });
          tl2.to(
            '.nft-portfolio-graph__highlight-box2',
            {
              ...p2,
            },
            '<-=0.5'
          );
        });

      tl2.from(
        '.nft-portfolio-graph__box',
        {
          x: 'random([100, -100])',
          y: 'random([100, -100])',
          scale: 0,
          opacity: 0,
          transformOrigin: 'center center',
          stagger: {
            grid: [7, 5],
            from: 'random',
            amount: 20,
            ease: 'none',
          },
        },
        'start'
      );
    },
  },
};
</script>
