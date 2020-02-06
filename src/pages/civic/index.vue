<template lang="pug">
  mixin IntroVideo
    .civic-page__intro-video()&attributes(attributes)
      div
        Transition(
          :css="false"
          @enter="fadeInIntroVideo"
        )
          div(v-show="isIntroVideoVisible")
            vue-vimeo-player(
              ref="introVideoPlayer"
              :video-id="introVideoVimeoId"
              :autoplay="true"
              :loop="true"
              :options="{ muted: true }"
              @play="isIntroVideoVisible = true"
            )
            button.civic-page__intro-video-button.civic-page__intro-video-volume-button(
              @click="toggleIntroVideoVolume"
            )
              VolumeOffIcon(v-if="isIntroVideoMuted")
              VolumeOnIcon(v-else)

  mixin ReferrerBanner
    Transition(
      :css="false"
      appear
      @enter="fadeInReferrerBanner"
    )
      section.civic-page__referrer-banner(
        style="opacity:0"
      )
        div
          .civic-page__referrer-banner-inner-wrapper
            .civic-page__referrer-banner-lines-container
              .civic-page__referrer-banner-lines
                svg(ref="referrerBannerLeftLines" width="200" height="46" viewBox="0 0 200 46")
                  line(x1="30" y1="3" x2="98" y2="3")
                  line(x1="180" y1="3" x2="186" y2="3")
                  line(x1="14" y1="28" x2="150" y2="28")
                  line(x1="78" y1="44" x2="84" y2="44")
                  line(x1="112" y1="44" x2="172" y2="44")
                svg(ref="referrerBannerRightLines" width="220" height="60" viewBox="0 0 220 60")
                  line(x1="56" y1="3" x2="74" y2="3")
                  line(x1="88" y1="3" x2="204" y2="3")
                  line(x1="16" y1="22" x2="120" y2="22")
                  line(x1="130" y1="22" x2="138" y2="22")
                  line(x1="50" y1="56" x2="70" y2="56")

            template(v-if="referrer")
              i18n.civic-page__referrer-banner-slogan(
                ref="referrerBannerLeftSlogan"
                path="CivicPage.referrerBanner.sloganWithReferrer"
                tag="div"
              )
                br(place="br")
                span.civic-page__referrer-banner-slogan-name.whitespace-no-wrap(place="name")
                  | {{ referrer.displayName }}

              LcAvatar(
                ref="referrerBannerAvatar"
                :src="referrer.avatar"
                :halo="referrer.avatarHalo"
                size="100"
              )

            template(v-else)
              LcChopCivicLiker(
                :text="civicLikerStampText"
                style="transform: rotate(16deg)"
                size="106"
              )

              i18n.civic-page__referrer-banner-slogan(
                ref="referrerBannerLeftSlogan"
                path="CivicPage.referrerBanner.slogan"
                tag="div"
              )
                br(place="br")

  mixin PaymentSelect
    .civic-page__payment-select.relative.mb-8
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

  .civic-page
    PageHeader
      template
        SiteNavBar.text-like-green

    main.page-content
      no-ssr(v-if="true")
        CivicLikerPageContentV2(
          :referrer="referrer"
        )
      no-ssr(v-else)
        +ReferrerBanner()

        section.civic-page__block.bg-white
          .civic-page__liker-comparison-card-list
            ul.px-24
              LikerComparisonCard(
                tag="li"
                type="civic"
              )
                template(
                  v-if="!referrer"
                  #header
                )
                  .relative.mt-12.mx-12.flex.flex-col.items-center.justify-center
                    +PaymentSelect
                    button.btn.btn--outlined(
                      @click="onClickActionButton"
                    )
                      | {{ actionButtonText }}
              .flex.flex-col.items-center.justify-center.w-full.max-w-full(v-if="referrer")
                LcChopCivicLiker.mb-32(
                  :text="civicLikerStampText"
                  style="transform:rotate(16deg)"
                  size="128"
                )
                +PaymentSelect
                button.btn.btn--outlined(
                  @click="onClickActionButton"
                )
                  | {{ actionButtonText }}
              LikerComparisonCard(
                v-else
                tag="li"
                type="general"
              )
                template(#header)
                  .relative.mt-12.mx-12.flex.justify-center
                    a.btn.btn--outlined.btn--grayscale(
                      :class="actionButtonClassForGuest"
                      :href="getOAuthRegisterAPI"
                      @click="onClickActionButtonForGuest"
                    )
                      | {{ actionButtonTextForGuest }}

          .p-32
            +IntroVideo()

      //-
        section.mt-32(ref="visionSection")
          div.civic-feature-card-swiper-container.bg-like-gradient(
            v-swiper:featureSwiper="$options.featureSwiper"
          )
            ul.civic-feature-card-wrapper
              li.civic-feature-card(
                v-for="i in 3"
                :key="i"
              )
                .civic-feature-card__header(
                  v-html="$t(`CivicLikerFeature[${i - 1}].header`)"
                )
                .civic-feature-card__body(
                  v-html="$t(`CivicLikerFeature[${i - 1}].body`)"
                )
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import dateFormat from 'date-fns/format';
import { vueVimeoPlayer } from 'vue-vimeo-player';

import CivicLikerPageContentV2 from '~/components/CivicLikerPageContentV2';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';
import LikerComparisonCard from '~/components/LikerComparisonCard';
import { logTrackerEvent } from '~/util/EventLogger';
// import swiperDirective from '~/util/SwiperDirectives';

import VolumeOnIcon from '~/assets/icons/volume-on.svg';
import VolumeOffIcon from '~/assets/icons/volume-off.svg';

import { checkIsMobileClient } from '~/util/client';
import { getOAuthRegisterAPI, getUserMinAPI } from '~/util/api';
import { getAvatarHaloTypeFromUser, checkUserNameValid } from '~/util/user';

import { IntercomMixinFactory } from '~/mixins/intercom';
import experimentMixin from '~/mixins/experiment';

import { PAYMENT_METHOD_LIST } from '~/constant';

export default {
  components: {
    CivicLikerPageContentV2,
    vueVimeoPlayer,
    PageHeader,
    SiteNavBar,
    LikerComparisonCard,
    VolumeOnIcon,
    VolumeOffIcon,
  },
  mixins: [
    IntercomMixinFactory({ isBootAtMounted: false }),
    experimentMixin('isExperimenting', 'civic-register-page', 'variant'),
  ],
  // directives: {
  //   swiper: swiperDirective,
  // },
  featureSwiper: {
    slidesPerView: 'auto',
    spaceBetween: 16,
    centeredSlides: true,

    slideToClickedSlide: true,

    slideClass: 'civic-feature-card',
    slideActiveClass: 'civic-feature-card--active',
    wrapperClass: 'civic-feature-card-wrapper',
  },
  data() {
    return {
      isIntroVideoVisible: false,
      isIntroVideoMuted: true,
      referrer: undefined,
      selectedPaymentMethod: PAYMENT_METHOD_LIST[0],
    };
  },
  computed: {
    ...mapGetters([
      'getLocale',
      'getIsHK',
      'getUserId',
      'getUserInfo',
      'getUserIsCivicLikerTrial',
      'getUserIsCivicLiker',
    ]),
    paymentMethods() {
      return PAYMENT_METHOD_LIST;
    },
    getOAuthRegisterAPI() {
      const { from, referrer } = this.$route.query;
      return getOAuthRegisterAPI(from, referrer);
    },
    introVideoVimeoId() {
      switch (this.getLocale) {
        case 'zh-Hant': {
          if (this.isCantonese) return '334865461';
          return '334615825';
        }
        case 'en':
        default:
          return '334616132';
      }
    },
    isCantonese() {
      if (!process.client) return false;
      return (
        navigator &&
        ((navigator.language &&
          navigator.language.toLowerCase().includes('hk')) ||
          (navigator.languages &&
            navigator.languages.find(lang =>
              lang.toLowerCase().includes('hk')
            )))
      );
    },

    actionButtonText() {
      if (this.getUserInfo.isCivicLikerRenewalPeriod) {
        return this.$t('renew');
      }
      if (this.getUserIsCivicLikerTrial) {
        return this.$t('upgrade');
      }
      if (this.getUserIsCivicLiker) {
        return this.$t('registered');
      }
      return this.$t('register');
    },
    actionButtonClassForGuest() {
      return {
        'btn--disabled': this.getUserId,
      };
    },
    actionButtonTextForGuest() {
      if (this.getUserId) {
        return this.$t('registered');
      }
      return this.$t('CivicPage.registerForFree');
    },
    civicLikerStampText() {
      if (
        (this.getUserIsCivicLiker || this.getUserIsCivicLikerTrial) &&
        this.getUserInfo.civicLikerSince
      ) {
        return dateFormat(
          new Date(this.getUserInfo.civicLikerSince),
          'YYYY.MM.DD'
        );
      }
      return 'LIKE';
    },
  },
  async asyncData({ route, $axios }) {
    // Fetch referrer info
    const { from } = route.query;
    if (from && checkUserNameValid(from)) {
      try {
        const user = await $axios.$get(getUserMinAPI(from));
        return {
          referrer: {
            ...user,
            avatarHalo: getAvatarHaloTypeFromUser(user),
          },
        };
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    }
    return undefined;
  },
  head() {
    return {
      title: this.$t('CivicPage.title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('CivicPage.ogDescription'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('CivicPage.ogDescription'),
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/civic.png',
        },
      ],
      link: [
        { rel: 'canonical', href: `${this.$route.path}` },
        { rel: 'prefetch', href: 'https://js.stripe.com/v3' },
      ],
    };
  },
  mounted() {
    if (this.getIsHK) {
      this.selectedPaymentMethod =
        PAYMENT_METHOD_LIST[PAYMENT_METHOD_LIST.length - 1];
      this.$i18n.locale = 'zh-Hant';
      this.setLocale(this.$i18n.locale);
    }
    const {
      from,
      referrer,
      utm_source: utmSource,
      is_popup: isPopup,
    } = this.$route.query;
    if (window.sessionStorage) {
      if (isPopup)
        window.sessionStorage.setItem(
          'civicLikerIsPopup',
          document.referrer || '1'
        );
      if (from) window.sessionStorage.setItem('civicLikerFrom', from);
      if (referrer)
        window.sessionStorage.setItem('civicLikerReferrer', referrer);
      if (utmSource)
        window.sessionStorage.setItem('civicLikerUtmSource', utmSource);
    }
    logTrackerEvent(this, 'Civic', 'CivicPageLoad', 'CivicPageLoad(civic)', 1);

    if (checkIsMobileClient()) {
      this.isIntroVideoVisible = true;
    }
  },
  methods: {
    ...mapActions(['setLocale']),
    onClickActionButton() {
      logTrackerEvent(
        this,
        'Civic',
        'CivicClickRegister',
        `CivicClick${
          this.getUserIsCivicLikerTrial ? 'Upgrade' : 'Register'
        }(civic)`,
        1
      );
      this.$router.push({
        name: `civic-register-${this.selectedPaymentMethod}`,
        query: this.$route.query,
      });
    },
    onClickActionButtonForGuest() {
      logTrackerEvent(
        this,
        'Register',
        'RegisterSignUp',
        'RegisterSignUp(civic)',
        1
      );
    },

    fadeInIntroVideo(el, done) {
      this.$gsap.TweenLite.fromTo(
        el,
        2,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'easeOutPower2',
          onComplete: () => {
            el.removeAttribute('style');
            done();
          },
        }
      );
    },
    toggleIntroVideoVolume() {
      this.$refs.introVideoPlayer[this.isIntroVideoMuted ? 'unmute' : 'mute']();
      this.isIntroVideoMuted = !this.isIntroVideoMuted;
    },
    fadeInReferrerBanner(el, done) {
      const { TweenLite, TweenMax } = this.$gsap;
      const {
        referrerBannerLeftLines: leftLines,
        referrerBannerRightLines: rightLines,
        referrerBannerLeftSlogan: slogan,
        referrerBannerAvatar,
      } = this.$refs;
      const avatar = referrerBannerAvatar && referrerBannerAvatar.$el;

      // Animation preparation
      TweenLite.set([leftLines, rightLines], { opacity: 0.5 });
      TweenLite.set(leftLines, { x: 100 });
      TweenLite.set(rightLines, { x: -100 });

      // Fade in & scale the banner
      TweenLite.fromTo(
        el,
        0.75,
        {
          opacity: 0,
          scaleY: 0,
          backfaceVisibility: 'hidden',
        },
        {
          opacity: 1,
          scaleY: 1,
          ease: 'easeOutPower2',
          onComplete: done,
        }
      );

      if (avatar && slogan) {
        // Scale up the avatar & the slogan
        TweenLite.fromTo(
          [avatar, slogan],
          1.25,
          { scale: 0.8 },
          { scale: 1, ease: 'easeOutBack' }
        );

        const avatarHalo = avatar.querySelector('.lc-avatar__content__halo');
        if (avatarHalo) {
          // Rotate and scale down the avatar's halo
          TweenLite.from(avatarHalo, 1.25, {
            scale: 1.5,
            rotation: 120,
            ease: 'easeOutPower2',
          });
        }
      }

      // Translate the lines
      TweenLite.to([leftLines, rightLines], 1, {
        x: 0,
        opacity: 1,
        ease: 'easeOutPower2',
      });
      [...(rightLines.children || []), ...(leftLines.children || [])]
        .sort(() => 0.5 - Math.random()) // Randomize the order of the lines
        .forEach((line, i) => {
          // Add randomized floating animation to each line
          TweenMax.to(line, 2 + Math.random() * 2, {
            x: 10 * (Math.random() < 0.5 ? -1 : 1),
            yoyo: true,
            ease: 'easeInOut',
            repeat: -1,
            delay: Math.random() * i,
          });
        });
    },
  },
};
</script>

<style lang="scss">
$civic-feature-card-width: 272px;
$civic-feature-card-inter-space: 16px;
$civic-feature-card-swiper-max-width: (
  $civic-feature-card-width * 3 + $civic-feature-card-inter-space * 4
);

.civic-page {
  perspective: 800px;

  &__block {
    max-width: config('screens.desktop.min');

    @apply w-full;
    @apply mx-auto;

    @apply mt-24;
    @apply mb-32;
  }

  &__intro-video {
    max-width: config('screens.desktop.min');

    @apply w-full;
    @apply mx-auto;

    @apply relative;

    > div {
      padding-top: 56.25%; // Aspect ratio of video

      background-image: url('~assets/images/civic/hero.png');

      @apply bg-center;
      @apply bg-no-repeat;
      @apply bg-cover;

      iframe {
        @apply absolute;
        @apply pin;

        @apply w-full;
        @apply h-full;
      }
    }

    &-button {
      transition: opacity 0.25s ease;

      @apply absolute;

      @apply text-like-green;

      @apply m-4;
      @apply p-4;

      @apply w-32;
      @apply h-32;

      @apply fill-current;

      &:hover {
        @apply opacity-75;
      }

      &:active {
        @apply opacity-50;
      }
    }

    &-volume-button {
      @apply pin-t;
      @apply pin-l;
    }
  }

  &__payment-select {
    select {
      width: 100%;
    }

    &-fake {
      display: flex;
      align-items: center;
      justify-content: space-between;

      min-width: 16rem;

      padding: 0.75rem 1rem;
      border: 1px solid config('colors.gray-9b');
      border-radius: 8px;

      &-label {
        padding: 0 1rem;
      }
    }
  }

  &__referrer-banner {
    overflow: hidden;

    > div {
      position: relative;

      max-width: config('screens.desktop.min');

      @apply text-like-cyan;
      @apply text-24;
      @apply leading-1_5;

      @apply bg-like-green;

      @apply mt-24;
      @apply mx-auto;
    }

    &-inner-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: 1rem 16%;

      @media screen and (max-width: config('screens.tablet.min')) {
        flex-direction: column-reverse;

        @apply px-16;
      }
    }

    &-lines {
      position: absolute;
      right: 0;
      left: 0;

      display: flex;
      align-items: center;
      justify-content: space-between;

      fill: none;
      stroke: config('colors.like-cyan');
      stroke-linecap: round;
      stroke-width: 0.25rem;

      @media screen and (max-width: config('screens.tablet.min')) {
        visibility: hidden;
      }

      > svg {
        position: absolute;

        &:first-child {
          right: 100%;

          margin-right: -14%;
        }

        &:last-child {
          left: 100%;

          margin-left: -14%;
        }
      }
    }

    .lc-chop {
      flex-shrink: 0;
      fill: currentColor;

      @apply text-like-cyan;

      &__content__value {
        color: inherit;
      }
    }

    &-slogan,
    .lc-avatar {
      @apply mx-16;
      @apply my-8;
    }

    &-slogan {
      flex-grow: 1;

      @media screen and (max-width: config('screens.tablet.min')) {
        text-align: center;
      }

      @apply font-200;

      &-name {
        @apply text-white;
        @apply font-600;
      }
    }

    .lc-avatar .lc-avatar__content {
      @media screen and (max-width: config('screens.tablet.min')) {
        width: 4rem !important;
      }
    }
  }

  &__liker-comparison-card-list {
    @apply max-w-desktop;

    @apply mt-24;
    @apply mx-auto;

    > ul {
      @apply flex;
      @apply justify-center;

      @apply list-reset;

      @media screen and (max-width: config('screens.tablet.max')) {
        flex-direction: column;
      }
    }

    .liker-comparison-card {
      max-width: 100%;
      border-radius: 0;
      margin: 0;

      border-color: #e6e6e6;
      border-style: solid;

      @media screen and (min-width: config('screens.tablet.max')) {
        @apply px-32;

        &--general {
          border-left-width: 2px;
        }
      }

      @media screen and (max-width: config('screens.tablet.max')) {
        &--general {
          border-top-width: 2px;
        }
      }

      &__feature-list {
        &::before {
          content: none;
        }
      }
    }
  }
}

.civic-feature-card {
  width: $civic-feature-card-width;

  @apply overflow-hidden;

  @apply bg-white;

  @apply flex-no-shrink;

  @apply rounded;

  &-swiper-container {
    z-index: 1;

    @apply relative;
    @apply overflow-hidden;

    @apply p-16;
  }

  &-wrapper {
    @media screen and (min-width: $civic-feature-card-swiper-max-width) {
      // Disable swiper
      transform: none !important;

      @apply justify-center;

      // Counter space between option of the swiper
      .civic-feature-card:last-child {
        margin-right: 0 !important;
      }
    }

    @apply relative;

    @apply list-reset;

    @apply w-full;
    @apply h-full;

    @apply flex;
  }

  &__header {
    @apply text-like-cyan;
    @apply text-24;
    @apply font-200;
    @apply leading-1_25;
    @apply text-center;

    @apply bg-like-green;

    @apply p-16;
  }

  &__body {
    @apply text-gray-4a;
    @apply text-14;
    @apply leading-1_5;

    @apply p-16;

    * {
      &:not(:first-child) {
        @apply mt-12;
      }
    }
  }
}
</style>
