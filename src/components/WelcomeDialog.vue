<template lang="pug">
  BaseDialog(
    :is-show="isShow"
    :is-animated="false"
    :is-fullscreen="true"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
    @resize="onResize"
  )
    .welcome-dialog
      .welcome-dialog__header(ref="header")
        a.btn.btn--plain.btn--auto-size.welcome-dialog__skip-button(
          ref="skipButton"
          @click="hide"
        )
          | {{ $t('WelcomeDialog.skip') }}

        .welcome-dialog__header-content
          svg.welcome-dialog__planet-art(
            ref="planet"
            width="320"
            height="96"
            viewBox="0 0 320 96"
          )
            mixin dot(x, y, r)
              circle(cx=x, cy=y, r=r)&attributes(attributes)
            mixin dotted-ring(radius, ...coordinates)
              g&attributes(attributes)
                each coordinate in coordinates
                  +dot(coordinate[0], coordinate[1], r=radius)
            g(ref="globe")
              +dot(156.5, 34.7, 1.3)(ref="newDot")
              +dotted-ring(
                1.3, [163.5, 61.0], [169.6, 57.5], [150.4, 38.2], [173.2, 51.4], [146.8, 44.3], [173.2, 44.3], [146.8, 51.4], [169.6, 38.2], [150.4, 57.5], [163.5, 34.7], [156.5, 61.0]
              )
              +dotted-ring(
                1.7, [154.7, 28.1], [165.3, 67.6], [148.3, 31.1], [171.8, 64.6], [143.3, 36.2], [176.8, 59.6], [140.3, 42.6], [179.8, 53.1], [139.6, 49.7], [180.4, 46.1], [141.5, 56.5], [178.5, 39.2], [145.6, 62.3], [174.5, 33.4], [151.4, 66.4], [168.6, 29.3], [158.3, 68.2], [161.8, 27.5]
              )(ref="planetRing2")
              +dotted-ring(
                1.7, [160.1, 20.7], [160.1, 75.2], [153.1, 21.6], [167.2, 74.3], [146.5, 24.4], [173.7, 71.6], [140.8, 28.7], [179.4, 67.2], [136.5, 34.3], [183.7, 61.6], [133.8, 40.9], [186.4, 55], [132.8, 48], [187.4, 48], [133.8, 55], [186.4, 40.9], [136.5, 61.6], [183.7, 34.3], [140.8, 67.2], [179.4, 28.7], [146.5, 71.6], [173.7, 24.4], [153.1, 74.3], [167.2, 21.6]
              )(ref="planetRing3")
              +dotted-ring(
                1.3, [125.9, 46.1], [194.0, 49.7], [126.3, 53.2], [193.7, 42.5], [128.1, 60.1], [191.8, 35.7], [131.4, 66.4], [188.6, 29.3], [135.8, 72.0], [184.1, 23.8], [141.4, 76.5], [178.5, 19.3], [147.7, 79.7], [172.2, 16.0], [154.6, 81.6], [165.3, 14.2], [161.7, 81.9], [158.2, 13.8], [168.8, 80.8], [151.1, 14.9], [175.4, 78.3], [144.5, 17.5], [181.4, 74.4], [138.5, 21.4], [186.5, 69.3], [133.5, 26.4], [190.4, 63.4], [129.6, 32.4], [192.9, 56.7], [127.0, 39.0]
              )(ref="planetRing4")
            circle(
              v-for="moon, idx in moons"
              :ref="`moon${idx}`"
              cx="160"
              cy="48"
              :r="moon.r"
            )

          i18n.welcome-dialog__header-slogan(
            ref="headerSlogan"
            path="WelcomeDialog.headerSlogan"
            tag="div"
          )
            br(place="br")

      .welcome-dialog__body(ref="body")
        .text-gray-4a.text-14.text-center.font-200.p-16 {{ $t('WelcomeDialog.pickSubscription') }}
        .welcome-dialog__liker-comparison-card-container
          ul
            li
              LikerComparisonCard(
                type="civic"
                :header-title="$t('WelcomeDialog.comparisonCard.civic.header')"
                :is-feature-list-collapsible="isFeatureListCollapsible"
              )
                template(#header)
                  .mt-12.mx-12
                    NuxtLink.btn.btn--outlined.btn--block.m-0.w-full(
                      :to="{ name: 'civic-register' }"
                      @click.native="onClickActionButton"
                    )
                      | {{ $t('WelcomeDialog.comparisonCard.civic.button') }}
                    .text-gray-9b.text-12.text-center.mt-8
                      | {{ $t('WelcomeDialog.comparisonCard.civic.buttonFootnote') }}

            li
              LikerComparisonCard(
                type="general"
                :header-title="$t('WelcomeDialog.comparisonCard.general.header')"
                :is-show-price="false"
                :is-show-features="false"
              )
                template(#header)
                  .mt-12.mx-12.pb-8
                    button.btn.btn--outlined.btn--block.btn--grayscale.m-0.w-full(
                      @click="onClickActionButton"
                    )
                      | {{ $t('WelcomeDialog.comparisonCard.general.button') }}
        .text-center.p-16
          a.btn.btn--plain.btn--auto-size.text-12(
            :href="getCreatorURL"
            target="_blank"
            rel="noopener"
            @click="onClickActionButton"
          )
            | {{ $t('WelcomeDialog.becomeCreator') }}
</template>

<script>
import {
  Linear,
  Power1,
  Power2,
  Power3,
  Power4,
  Back,
  Sine,
} from 'gsap/EasePack';

import BaseDialog from '~/components/BaseDialog';

import LikerComparisonCard from '~/components/LikerComparisonCard';

import { updateProfile } from '~/util/api';
import { getCreatorURL } from '~/util/links';

export default {
  name: 'WelcomeDialog',
  components: {
    BaseDialog,
    LikerComparisonCard,
  },
  data() {
    const { getUserId, getUserInfo, getUserIsCivicLiker } = this.$store.getters;
    return {
      isShow:
        getUserId &&
        !getUserIsCivicLiker &&
        !getUserInfo.isNew &&
        !getUserInfo.hasReadWelcomeDialog,
      isFeatureListCollapsible: false,
    };
  },
  computed: {
    getCreatorURL,

    moons() {
      return [
        { r: 1.5, x: 38, y: 50 },
        { r: 1.5, x: 84, y: 67 },
        { r: 3, x: 105, y: 19.5 },
        { r: 1.5, x: 204, y: 70 },
        { r: 3, x: 242, y: 62 },
        { r: 1.5, x: 221, y: 47 },
        { r: 1.5, x: 289, y: 54 },
      ];
    },
  },
  methods: {
    onBeforeEnter(el) {
      this.$gsap.TweenLite.set(el, {
        opacity: 0,
      });
    },
    onEnter(el, onComplete) {
      const {
        header,
        headerSlogan,
        skipButton,
        planet,
        globe,
        newDot,
        body,
      } = this.$refs;

      const tl = new this.$gsap.TimelineLite({ delay: 1 });
      // Fade in root element
      tl.to(el, 1, {
        opacity: 1,
        clearProps: 'all',
      });

      // Fade in new dot
      const zoomValue = 16;
      tl.from(
        newDot,
        3,
        {
          fill: 'white',
          attr: {
            cx: 160,
            cy: 48,
            r: Math.max(window.innerWidth, window.innerHeight) / zoomValue,
          },
          ease: Power3.easeInOut,
        },
        0
      );

      tl.addLabel('planetEnter', 1.5);
      // Show rest of the planet
      tl.from(
        globe.querySelectorAll('g'),
        2.5,
        { opacity: 0, ease: Power3.easeInOut },
        'planetEnter'
      );
      // Fade in header slogan
      tl.from(headerSlogan, 1.5, {
        scale: 3,
        y: 200,
        opacity: 0,
        ease: Power2.easeOut,
        delay: -0.5,
        clearProps: 'all',
        onComplete,
      });
      // Zoom out planet
      tl.fromTo(
        planet,
        3,
        { scale: zoomValue },
        { scale: 1, ease: Power3.easeInOut },
        'planetEnter'
      );

      tl.addLabel('showBody', '+=1');
      // Shorten header height
      tl.from(header, 2, {
        height: window.innerHeight,
        ease: Power4.easeInOut,
        clearProps: 'height',
      });
      tl.from(
        skipButton,
        0.5,
        { opacity: 0, clearProps: 'all', delay: 0.5 },
        'showBody'
      );
      tl.staggerFrom(
        body.children,
        1,
        { opacity: 0, y: 20, clearProps: 'all', ease: Back.easeOut },
        0.25,
        'showBody'
      );

      // Moons start orbiting
      this.moons.forEach((moon, i) => {
        const moonTl = new this.$gsap.TimelineMax({
          delay: 3 + Math.random(i),
          repeat: -1,
        });
        const duration = (i % 2 ? 1 : 0.5) + Math.random();
        const moonEl = this.$refs[`moon${i}`];
        const r = moon.r * 0.75;
        moonTl.from(moonEl, duration, {
          attr: { cx: moon.x, cy: moon.y, r },
          ease: Sine.easeIn,
        });
        moonTl.to(moonEl, duration, {
          attr: {
            cx: 160 + (160 - moon.x),
            cy: 48 + (48 - moon.y),
            r,
          },
          ease: Sine.easeOut,
        });
        moonTl.to(moonEl, duration, {
          attr: { cx: 160, cy: 48, r: r * 0.75 },
          ease: Sine.easeIn,
        });
        moonTl.to(moonEl, duration, {
          attr: { cx: moon.x, cy: moon.y, r },
          ease: Sine.easeOut,
        });
        tl.add(moonTl, 0);
      });

      // Constantly rotate the Planet
      tl.to(
        globe,
        20,
        {
          transformOrigin: 'center',
          rotation: 360,
          ease: Linear.easeNone,
          repeat: -1,
        },
        2
      );
      for (let i = 2; i < 4; i += 1) {
        tl.to(
          this.$refs[`planetRing${i}`],
          80 - i * 10,
          {
            transformOrigin: 'center',
            rotation: (i % 2 ? 1 : -1) * 360,
            ease: Linear.easeNone,
            repeat: -1,
          },
          0
        );
      }
    },
    onLeave(el, onComplete) {
      const tl = new this.$gsap.TimelineMax({ onComplete });
      tl.to(el, 0.25, {
        scale: 0.9,
        opacity: 0,
        ease: Power1.easeIn,
      });
      const pageWrapper = document.querySelector('.page-wrapper');
      if (pageWrapper) {
        tl.from(
          pageWrapper,
          0.5,
          {
            opacity: 0.5,
            ease: Power1.easeOut,
          },
          0
        );
      }
    },
    onResize({ width }) {
      this.isFeatureListCollapsible = width <= 600;
    },
    hide() {
      this.isShow = false;
    },
    onClickActionButton() {
      this.hide();
      this.$axios.$post(updateProfile(), {
        hasReadWelcomeDialog: true,
      });
    },
  },
};
</script>

<style lang="scss">
.welcome-dialog {
  display: flex;
  flex-direction: column;

  min-height: 100vh;

  &__planet-art {
    display: block;

    fill: currentColor;
  }

  &__header {
    position: relative;

    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    @apply bg-like-green;
    @apply text-like-cyan;

    @apply p-24;

    &-content {
      text-align: center;

      @apply text-24;
    }

    &-slogan {
      @apply font-200;
      @apply leading-1_5;
    }
  }

  &__skip-button {
    position: absolute;
    right: 0;

    cursor: pointer;

    @apply text-white;
    @apply mr-80;

    @media screen and (max-width: config('screens.desktop.min')) {
      top: 0;

      @apply mt-16;
      @apply mr-24;
    }
  }

  &__body {
    flex-grow: 1;

    @apply bg-gray-f7;
  }

  &__liker-comparison-card-container {
    @apply max-w-desktop;
    @apply mx-auto;

    > ul {
      display: flex;
      align-items: flex-start;
      justify-content: center;

      @apply list-reset;
      @apply -m-8;

      @media screen and (max-width: config('screens.phone.max')) {
        align-items: center;
        flex-direction: column;
      }

      > li {
        width: 18rem;

        @apply p-8;
      }
    }
  }
}
</style>
