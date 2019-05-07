<template lang="pug">
  .civic-page
    PageHeader
      template
        SiteNavBar.text-like-green

    main.page-content
      .civic-page__intro-video(
        @mouseenter="onMouseEnterIntroVideo"
        @mouseleave="onMouseLeaveIntroVideo"
      )
        div
          Transition(
            :css="false"
            @enter="fadeInIntroVideo"
          )
            div(v-show="isIntroVideoVisible")
              no-ssr
                vimeo-player(
                  ref="introVideoPlayer"
                  :video-id="introVideoVimeoId"
                  :loop="true"
                  :options="{ background: true }"
                  @play="isIntroVideoVisible = true"
                )
                button.civic-page__intro-video-volume-button(
                  @click="toggleIntroVideoVolume"
                )
                  VolumeOffIcon(v-if="isIntroVideoMuted")
                  VolumeOnIcon(v-else)

      section.max-w-desktop.mx-auto.mt-24
        ul.list-reset.flex.justify-center
          LikerComparisonCard.mx-8(
            tag="li"
            class="tablet:hidden phone:hidden"
            type="general"
          )
          LikerComparisonCard.mx-8(
            tag="li"
            type="civic"
          )
            template(#header)
              .relative.mt-12.mx-12
                button.btn.btn--outlined.btn--block.m-0.w-full(
                  :class="{ 'btn--disabled': !!getUserIsCivicLiker }"
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

        .relative.bg-white.flex.justify-center.items-center
          LcChopCivicLiker.absolute.z-10.m-24.my-0(
            class="phone:hidden "
            :text="civicLikerStampText"
            style="right: 0;transform: rotate(20deg)"
            size="120"
          )
          LikerComparisonCard(
            type="civic"
            :is-show-features="false"
          )
            template(#header)
              .mt-12.mx-12
                button.btn.btn--outlined.btn--block.mx-0.-mb-12.w-full(
                  :class="{ 'btn--disabled': !!getUserIsCivicLiker }"
                  @click="onClickActionButton"
                )
                 | {{ actionButtonText }}

      section.w-full.max-w-desktop.mx-auto.text-gray-9b.text-12.p-20.pb-64(
        class="laptop:px-20 desktop:px-32"
      )
        //- p {{ $t('CivicPage.footnote.0') }}
        p.mt-16 {{ $t('CivicPage.footnote.1') }}
</template>

<script>
import { mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';
import LikerComparisonCard from '~/components/LikerComparisonCard';
import { logTrackerEvent } from '~/util/EventLogger';

import VolumeOnIcon from '~/assets/icons/volume-on.svg';
import VolumeOffIcon from '~/assets/icons/volume-off.svg';

export default {
  components: {
    PageHeader,
    SiteNavBar,
    LikerComparisonCard,
    VolumeOnIcon,
    VolumeOffIcon,
  },
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

    introVideoVimeoId() {
      switch (this.getLocale) {
        case 'zh-Hant':
          return '334615825';

        case 'en':
        default:
          return '334616132';
      }
    },

    actionButtonText() {
      if (this.getUserIsCivicLikerTrial) {
        return this.$t('upgrade');
      }
      return this.$t(this.getUserIsCivicLiker ? 'registered' : 'join');
    },
    civicLikerStampText() {
      if (this.getUserIsCivicLiker || this.getUserIsCivicLikerTrial) {
        return dateFormat(
          new Date(this.getUserInfo.civicLikerSince),
          'YYYY.MM.DD'
        );
      }
      return 'LIKE';
    },
  },
  head() {
    return {
      title: this.$t('CivicPage.title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('CivicPage.slogan'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('CivicPage.slogan'),
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/civic.png',
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
    };
  },
  mounted() {
    const { from, referrer } = this.$route.query;
    if (window.sessionStorage) {
      if (from) window.sessionStorage.setItem('civicLikerFrom', from);
      if (referrer)
        window.sessionStorage.setItem('civicLikerReferrer', referrer);
    }
    logTrackerEvent(this, 'Civic', 'CivicPageLoad', 'CivicPageLoad(civic)', 1);
  },
  methods: {
    onClickActionButton() {
      if (!this.getUserId) {
        this.$nuxt.error({
          message: 'LOGIN_NEEDED_TO_REGISTER_CIVIC_LIKER',
          statusCode: 401,
        });
        return;
      }
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
        name: 'civic-register',
        query: this.$route.query,
      });
    },
    onMouseEnterIntroVideo() {
      if (this.isIntroVideoMuted && this.$refs.introVideoPlayer) {
        this.$refs.introVideoPlayer.unmute();
      }
    },
    onMouseLeaveIntroVideo() {
      if (this.isIntroVideoMuted && this.$refs.introVideoPlayer) {
        this.$refs.introVideoPlayer.mute();
      }
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
    toggleFullScreen() {
      const iframe = this.$refs.introVideoPlayer.$el.querySelector('iframe');
      iframe.requestFullscreen();
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

        @apply pointer-events-none;
      }
    }

    &-volume-button {
      transition: opacity 0.25s ease;

      @apply absolute;
      @apply pin-l pin-b;

      @apply text-like-green;

      @apply ml-4;
      @apply mb-4;

      @apply w-32;
      @apply h-32;
      @apply p-4;

      @apply fill-current;

      &:hover {
        @apply opacity-75;
      }

      &:active {
        @apply opacity-50;
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
