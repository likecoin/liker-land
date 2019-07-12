<template lang="pug">
  .civic-page
    PageHeader
      template
        SiteNavBar.text-like-green

    main.page-content
      no-ssr
        .civic-page__intro-video(
          :style="introVideoStyle"
        )
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

      Transition(
        :css="false"
        appear
        @enter="fadeInReferrerBanner"
      )
        section.civic-page__referrer-banner(
          v-if="isShowReferrerBanner"
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

              i18n.civic-page__referrer-banner-slogan(
                ref="referrerBannerLeftSlogan"
                path="CivicPage.referrerBanner.slogan"
                tag="div"
              )
                br(place="br")
                span.civic-page__referrer-banner-slogan-name(place="name")
                  | {{ referrer.displayName }}

              LcAvatar(
                ref="referrerBannerAvatar"
                :src="referrer.avatar"
                :halo="referrer.avatarHalo"
                size="100"
              )

      section.civic-page__liker-comparison-card-list
        ul
          LikerComparisonCard(
            v-if="!isShowReferrerBanner"
            tag="li"
            type="general"
          )
            template(#header)
              .relative.mt-12.mx-12
                a.btn.btn--outlined.btn--block.btn--grayscale.m-0.w-full(
                  :class="actionButtonClassForGuest"
                  :href="getOAuthRegisterAPI"
                  @click="onClickActionButtonForGuest"
                )
                  | {{ actionButtonTextForGuest }}

          LikerComparisonCard(
            tag="li"
            type="civic"
          )
            template(#header)
              .relative.mt-12.mx-12
                button.btn.btn--outlined.btn--block.m-0.w-full(
                  :class="actionButtonClass"
                  @click="onClickActionButton"
                )
                  | {{ actionButtonText }}
                LcChopCivicLiker.absolute(
                  class="phone:hidden"
                  :text="civicLikerStampText"
                  style="left: 100%;margin-left: 0.75rem;transform: translateY(-65%) rotate(20deg)"
                  size="180"
                )

      section.mt-32(ref="visionSection")
        //-
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
import { mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';
import { vueVimeoPlayer } from 'vue-vimeo-player';

import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';
import LikerComparisonCard from '~/components/LikerComparisonCard';
import { logTrackerEvent } from '~/util/EventLogger';
// import swiperDirective from '~/util/SwiperDirectives';

import VolumeOnIcon from '~/assets/icons/volume-on.svg';
import VolumeOffIcon from '~/assets/icons/volume-off.svg';

import experimentMixin from '~/mixins/experiment';

import { checkIsMobileClient } from '~/util/client';
import { getOAuthRegisterAPI, getUserMinAPI } from '~/util/api';
import { getAvatarHaloTypeFromUser } from '~/util/user';

export default {
  components: {
    vueVimeoPlayer,
    PageHeader,
    SiteNavBar,
    LikerComparisonCard,
    VolumeOnIcon,
    VolumeOffIcon,
  },
  mixins: [experimentMixin('isDirectSignIn', 'direct-signin', 'direct')],
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
    };
  },
  computed: {
    ...mapGetters([
      'getLocale',
      'getUserId',
      'getUserInfo',
      'getUserIsCivicLikerTrial',
      'getUserIsCivicLiker',
    ]),
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
    introVideoStyle() {
      if (this.isPlacingIntroVideoBottom) {
        return { order: 999, marginBottom: '5rem' };
      }
      return undefined;
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
    isShowReferrerBanner() {
      return (
        this.referrer &&
        !(this.getUserIsCivicLiker && !this.getUserIsCivicLikerTrial)
      );
    },
    isPlacingIntroVideoBottom() {
      return this.isShowReferrerBanner;
    },

    actionButtonClass() {
      return {
        'btn--disabled':
          this.getUserIsCivicLiker &&
          !this.getUserInfo.isCivicLikerRenewalPeriod,
      };
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
    if (from) {
      try {
        const user = await $axios.$get(getUserMinAPI(from));
        return {
          referrer: {
            ...user,
            avatarHalo: getAvatarHaloTypeFromUser(user),
          },
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
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
    const { from, referrer, utm_source: utmSource } = this.$route.query;
    if (window.sessionStorage) {
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
      if (this.isDirectSignIn && !this.getUserId) {
        if (window.sessionStorage) {
          // HACK: set post auth redirect
          window.sessionStorage.setItem(
            'USER_POST_AUTH_ROUTE',
            JSON.stringify({
              name: 'civic-register',
              query: this.$route.query,
            })
          );
        }
        window.location.href = this.getOAuthRegisterAPI;
      } else {
        this.$router.push({
          name: 'civic-register',
          query: this.$route.query,
        });
      }
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
      const avatar = referrerBannerAvatar.$el;

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

      // Translate the lines
      TweenLite.to([leftLines, rightLines], 1, {
        x: 0,
        opacity: 1,
        ease: 'easeOutPower2',
      });
      [...rightLines.children, ...leftLines.children]
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

  &__referrer-banner {
    overflow: hidden;

    > div {
      position: relative;

      max-width: config('screens.desktop.min');
      min-height: 9.375rem;

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

    &-slogan,
    .lc-avatar {
      @apply mx-16;
      @apply my-8;
    }

    &-slogan {
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
        @apply flex-col-reverse;
      }
    }

    .liker-comparison-card {
      @apply m-8;
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
