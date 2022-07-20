<template>
  <section class="laptop:min-h-[600px] nft-portfolio-graph">
    <h1
      class="
        text-[48px] text-center
        laptop:text-left laptop:text-[72px]
        font-proxima font-[300]
        text-like-green
        laptop:-mb-[40px]
        relative
        z-1
      "
    >
      {{ $t('about_nft_page_nft_portfolio_title') }}
    </h1>
    <div class="items-start justify-center w-full laptop:flex">
      <div class="overflow-hidden laptop:max-w-[375px] w-full">
        <svg
          class="transform scale-[2]"
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
          text-center
          laptop:text-left
          nft-portfolio-graph__description
          mt-[16px]
          laptop:mt-[24px] laptop:max-w-[470px] laptop:mr-[24px]
          leading-[22px]
        "
      >
        {{ $t('about_nft_page_nft_portfolio_description') }}
      </div>
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
      const tl = this.$gsap.gsap.timeline({
        duration: 0.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: `.nft-portfolio-graph`,
          start: 'top-=50% center',
          end: 'top center',
          scrub: true,
        },
      });
      tl.from('.nft-portfolio-graph h1', {
        x: '-=100',
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
        duration: 0.5,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: `.nft-portfolio-graph`,
          start: 'top+=25% center',
          end: 'center center',
          scrub: true,
          pin: window.innerWidth >= 768,
        },
      });
      tl2.from(
        '.nft-portfolio-graph__box',
        {
          scale: 0.3,
          opacity: 0,
          transformOrigin: 'center center',
          stagger: {
            grid: [7, 5],
            from: 'random',
            ease: 'back.out(2)',
            each: 0.25,
          },
        },
        '<+=0.25'
      );
      [
        [{ x: 1, y: -1 }, { x: 3, y: -1 }],
        [{ x: -2, y: -1 }, { x: -1, y: -2 }],
        [{ x: -3, y: -2 }, { x: 2, y: -1 }],
        [{ x: 1, y: 2 }, { x: 4, y: -2 }],
        [{ x: -4, y: 0 }, { x: 5, y: 1 }],
        [{ x: -3, y: -1 }, { x: 2, y: -2 }],
        [{ x: 0, y: 0 }, { x: 0, y: 0 }],
      ]
        .map(params =>
          params.map(param => ({
            x: param.x * 47.335,
            y: param.y * 34.1219,
          }))
        )
        .forEach(([p1, p2]) => {
          tl2.set('.nft-portfolio-graph__highlight-box1', p1);
          tl2.set('.nft-portfolio-graph__highlight-box2', p2);
          tl2.fromTo(
            '.nft-portfolio-graph__highlight-box',
            {
              transformOrigin: 'center center',
              scale: 0,
              opacity: 0,
            },
            {
              transformOrigin: 'center center',
              scale: 1,
              opacity: 1,
              stagger: 0.75,
            }
          );
          if (p1.x !== 0) {
            tl2.to(
              '.nft-portfolio-graph__highlight-box',
              {
                transformOrigin: 'center center',
                scale: 0,
                stagger: 0.5,
                opacity: 0,
              },
              '>-=0.25'
            );
          }
        });
    },
  },
};
</script>
