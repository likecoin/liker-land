<template lang="pug">
  mixin PaymentSelect
    .civic-page__payment-select.relative.my-12
      .civic-page__payment-select-fake
        svg(v-if="selectedPaymentMethod === 'stripe'" height="24px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28.21 24')
          defs
            mask#a(x='0' y='2.1' width='28.21' height='19.8' maskUnits='userSpaceOnUse')
              polygon(points='0 2.1 28.21 2.1 28.21 21.9 0 21.9 0 2.1', style='fill: #fff;fill-rule: evenodd')
          g(style='fill: #28646e')
            g(style='mask: url(#a)')
              path(d='M25.31,20.1H2.9A1.1,1.1,0,0,1,1.8,19V10.37H26.41V19a1.1,1.1,0,0,1-1.1,1.1M2.9,3.9H25.31A1.1,1.1,0,0,1,26.41,5V6.75H1.8V5A1.1,1.1,0,0,1,2.9,3.9M25.31,2.1H2.9A2.9,2.9,0,0,0,0,5V19a2.9,2.9,0,0,0,2.9,2.9H25.31a2.91,2.91,0,0,0,2.9-2.9V5a2.91,2.91,0,0,0-2.9-2.9', style='fill-rule: evenodd')
            circle(cx='4.72' cy='17.19' r='1',)
            circle(cx='8' cy='17.19' r='1')
        svg(v-else-if="selectedPaymentMethod === 'paypal'" height="24px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20.36 24')
          path(d='M5.79,23.19l.42-2.64H.85L3.93,1A.25.25,0,0,1,4.18.8h7.46c2.48,0,4.18.53,5.07,1.59a3.54,3.54,0,0,1,.8,1.52,5.7,5.7,0,0,1,0,2.1v.61l.42.23a3.2,3.2,0,0,1,.85.65A3,3,0,0,1,19.47,9a6.76,6.76,0,0,1-.1,2.24,7.85,7.85,0,0,1-.92,2.53A5.25,5.25,0,0,1,17,15.4a5.88,5.88,0,0,1-2,.88,9.57,9.57,0,0,1-2.44.28H12a1.76,1.76,0,0,0-1.14.42,1.81,1.81,0,0,0-.53,1l0,.24-.75,4.66v.17a.12.12,0,0,1,0,.1.11.11,0,0,1-.08,0Z' style='fill: #253b80')
          path(d='M18.34,6.1a1.78,1.78,0,0,1-.08.44c-1,5.05-4.35,6.79-8.64,6.79H7.43a1.07,1.07,0,0,0-1.06.9L5.26,21.34l-.32,2a.56.56,0,0,0,.45.64h4a.93.93,0,0,0,.92-.8l0-.19.73-4.64,0-.26a.93.93,0,0,1,.92-.79h.58c3.77,0,6.71-1.53,7.57-5.94.36-1.85.18-3.39-.8-4.48A4,4,0,0,0,18.34,6.1Z' style='fill: #179bd7')
          path(d='M17.31,5.69c-.31-.09-.63-.16-.95-.22a12.56,12.56,0,0,0-1.94-.13H8.58a.94.94,0,0,0-.93.79L6.41,14v.23a1.06,1.06,0,0,1,1-.9H9.65c4.3,0,7.67-1.74,8.65-6.79a2.14,2.14,0,0,1,.08-.44,5.65,5.65,0,0,0-.8-.34Z' style='fill: #222d65')
          path(d='M7.65,6.13a.94.94,0,0,1,.93-.8h5.84a11.44,11.44,0,0,1,1.94.14,6.68,6.68,0,0,1,1.15.29,4.59,4.59,0,0,1,.79.34,4.75,4.75,0,0,0-1-4.29C16.28.65,14.21,0,11.64,0H4.18a1.06,1.06,0,0,0-1,.9L0,20.6a.63.63,0,0,0,.52.73H5.26L6.41,14Z' style='fill: #253b80')

        span.civic-page__payment-select-fake-label {{ $t(`CivicPage.paymentMethod.${selectedPaymentMethod}`) }}
        svg(width="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 7")
          polyline(points="1 1 7 6 13 1" style="fill: none;stroke: #28646e;stroke-linecap: round;stroke-linejoin: round;stroke-width: 2px")

      select.absolute.pin.opacity-0(
        ref="paymentSelect"
        v-model="selectedPaymentMethod"
      )
        option(
          v-for="method in paymentMethods"
          :key="method"
          :value="method"
        )
          | {{ $t(`CivicPage.paymentMethod.${method}`) }}

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
                  +PaymentSelect
                  .mt-4.mx-12
                    NuxtLink.btn.btn--outlined.btn--block.m-0.w-full(
                      :to="{ name: `civic-register-${selectedPaymentMethod}` }"
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
          NuxtLink.btn.btn--plain.btn--auto-size.text-12(
            :to="{ name: 'creators' }"
            target="_blank"
            rel="noopener"
            @click="onClickActionButton"
          )
            | {{ $t('WelcomeDialog.becomeCreator') }}
</template>

<script>
import { mapGetters } from 'vuex';
import { Linear, Power1, Power2, Power3, Power4, Back, Sine } from 'gsap';

import BaseDialog from '~/components/BaseDialog';

import LikerComparisonCard from '~/components/LikerComparisonCard';

import { updateProfile } from '~/util/api';

import { PAYMENT_METHOD_LIST } from '~/constant';

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
        !/civic-payment-[a-z]+-success/.test(this.$route.name) &&
        !getUserIsCivicLiker &&
        !getUserInfo.isNew &&
        !getUserInfo.hasReadWelcomeDialog,
      isFeatureListCollapsible: false,
      selectedPaymentMethod: PAYMENT_METHOD_LIST[0],
    };
  },
  computed: {
    ...mapGetters(['getIsHK']),

    paymentMethods() {
      return PAYMENT_METHOD_LIST;
    },
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
  mounted() {
    if (this.getIsHK) {
      this.selectedPaymentMethod =
        PAYMENT_METHOD_LIST[PAYMENT_METHOD_LIST.length - 1];
    }
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

      @media screen and (max-width: config('screens.tablet.max')) {
        align-items: center;
        flex-direction: column;
      }

      > li {
        width: 20rem;

        @apply p-8;

        .liker-comparison-card {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
