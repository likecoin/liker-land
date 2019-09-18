<template lang="pug">
  mixin IntroVideo
    .civic-page__intro-video()&attributes(attributes)
      div
        no-ssr
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
                span.civic-page__referrer-banner-slogan-name(place="name")
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
        svg(v-if="selectedPaymentMethod === 'stripe'" height="24px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 43 24')
          path(d='M43,12.3c0-3.07-1.48-5.5-4.31-5.5s-4.56,2.43-4.56,5.48c0,3.61,2,5.43,4.94,5.43a6.6,6.6,0,0,0,3.31-.78v-2.4a6.31,6.31,0,0,1-2.93.66c-1.16,0-2.18-.41-2.31-1.82H43C43,13.21,43,12.59,43,12.3Zm-5.9-1.14c0-1.36.82-1.92,1.58-1.92s1.5.56,1.5,1.92Z', style='fill: #32325d;fill-rule: evenodd')
          path(d='M29.51,6.8a3.39,3.39,0,0,0-2.34.94L27,7H24.39V21l3-.64V17a3.36,3.36,0,0,0,2.11.75c2.14,0,4.09-1.73,4.09-5.53C33.58,8.7,31.6,6.8,29.51,6.8Zm-.71,8.27a1.79,1.79,0,0,1-1.41-.56V10.06a1.77,1.77,0,0,1,1.42-.59c1.09,0,1.84,1.22,1.84,2.79S29.9,15.07,28.8,15.07Z', style='fill: #32325d;fill-rule: evenodd')
          polygon(points='20.28 6.1 23.28 5.45 23.28 3.01 20.28 3.65 20.28 6.1', style='fill: #32325d;fill-rule: evenodd')
          rect(x='20.28', y='7.01', width='3', height='10.5', style='fill: #32325d')
          path(d='M17.07,7.9,16.88,7H14.3v10.5h3V10.39a2.11,2.11,0,0,1,2.27-.62V7A2,2,0,0,0,17.07,7.9Z', style='fill: #32325d;fill-rule: evenodd')
          path(d='M11.1,4.4,8.18,5v9.61a3,3,0,0,0,3.09,3.08,4.68,4.68,0,0,0,2.09-.39V14.89c-.38.16-2.27.71-2.27-1.07V9.56h2.27V7H11.08Z', style='fill: #32325d;fill-rule: evenodd')
          path(d='M3,10.06c0-.47.38-.65,1-.65a6.53,6.53,0,0,1,3,.77V7.36A7.77,7.77,0,0,0,4,6.8c-2.43,0-4,1.28-4,3.4C0,13.51,4.54,13,4.54,14.41c0,.55-.48.73-1.15.73a7.29,7.29,0,0,1-3.26-1V17a8.26,8.26,0,0,0,3.26.68c2.49,0,4.19-1.23,4.19-3.38C7.57,10.76,3,11.4,3,10.06Z', style='fill: #32325d;fill-rule: evenodd')
        svg(v-else-if="selectedPaymentMethod === 'paypal'" height="24px" xmlns='http://www.w3.org/2000/svg', viewBox='0 0 73.42 24')
          path(d='M27.45,7.05H23.39a.56.56,0,0,0-.56.47L21.19,17.94a.35.35,0,0,0,.28.39h2a.56.56,0,0,0,.56-.48L24.46,15a.57.57,0,0,1,.56-.47h1.29c2.67,0,4.22-1.3,4.62-3.86a3.13,3.13,0,0,0-.52-2.63A3.75,3.75,0,0,0,27.45,7.05Zm.47,3.8c-.22,1.46-1.34,1.46-2.41,1.46h-.62l.43-2.72a.34.34,0,0,1,.34-.29h.28c.73,0,1.43,0,1.78.42A1.33,1.33,0,0,1,27.92,10.85Zm11.68,0h-2a.33.33,0,0,0-.33.29l-.09.54-.14-.19a2.74,2.74,0,0,0-2.29-.82,4.48,4.48,0,0,0-4.35,3.91,3.68,3.68,0,0,0,.73,3,3,3,0,0,0,2.45,1,3.72,3.72,0,0,0,2.69-1.11l-.09.54a.35.35,0,0,0,.28.39h1.81a.56.56,0,0,0,.56-.48l1-6.66a.34.34,0,0,0-.28-.38Zm-2.72,3.79a2.16,2.16,0,0,1-2.19,1.86,1.62,1.62,0,0,1-1.31-.53,1.67,1.67,0,0,1-.3-1.36,2.17,2.17,0,0,1,2.18-1.88,1.53,1.53,0,0,1,1.62,1.91ZM50,10.8H48a.57.57,0,0,0-.46.25l-2.7,4L43.7,11.21a.59.59,0,0,0-.55-.41H41.23a.34.34,0,0,0-.34.34.36.36,0,0,0,0,.11l2.15,6.32-2,2.86a.34.34,0,0,0,.08.47.36.36,0,0,0,.2.06h2a.56.56,0,0,0,.46-.24l6.51-9.38a.36.36,0,0,0-.09-.48A.33.33,0,0,0,50,10.8Z', style='fill: #253b80')
          path(d='M56.43,7.05H52.37a.56.56,0,0,0-.56.47L50.17,17.94a.34.34,0,0,0,.28.39h2.14A.4.4,0,0,0,53,18l.46-3a.56.56,0,0,1,.56-.47h1.28c2.68,0,4.23-1.3,4.63-3.86a3.13,3.13,0,0,0-.52-2.63A3.76,3.76,0,0,0,56.43,7.05Zm.47,3.8c-.22,1.46-1.34,1.46-2.41,1.46h-.62l.43-2.72a.34.34,0,0,1,.34-.29h.28c.73,0,1.43,0,1.78.42A1.33,1.33,0,0,1,56.9,10.85Zm11.67,0H66.63a.33.33,0,0,0-.33.29l-.09.54-.14-.19a2.74,2.74,0,0,0-2.29-.82,4.48,4.48,0,0,0-4.35,3.91,3.68,3.68,0,0,0,.73,3,3,3,0,0,0,2.45,1A3.72,3.72,0,0,0,65.3,17.4l-.09.54a.35.35,0,0,0,.28.39H67.3a.57.57,0,0,0,.56-.48l1-6.66a.34.34,0,0,0-.28-.38Zm-2.71,3.79a2.16,2.16,0,0,1-2.19,1.86,1.51,1.51,0,0,1-1.61-1.89,2.17,2.17,0,0,1,2.18-1.88,1.64,1.64,0,0,1,1.29.53A1.66,1.66,0,0,1,65.86,14.59Zm5-7.26L69.2,17.94a.35.35,0,0,0,.28.39h1.73a.56.56,0,0,0,.56-.48L73.41,7.44a.33.33,0,0,0-.28-.39H71.2A.35.35,0,0,0,70.87,7.33Z', style='fill: #179bd7')
          path(d='M4.32,20.36l.31-2h-4L2.93,3.8a.18.18,0,0,1,.18-.16H8.69c1.85,0,3.12.39,3.79,1.15a2.71,2.71,0,0,1,.61,1.14,4.11,4.11,0,0,1,0,1.57V8l.32.17a2.28,2.28,0,0,1,.63.49,2.17,2.17,0,0,1,.51,1.15,4.84,4.84,0,0,1-.07,1.67,5.63,5.63,0,0,1-.69,1.89,3.84,3.84,0,0,1-1.08,1.19,4.55,4.55,0,0,1-1.46.66,7.28,7.28,0,0,1-1.82.21H9a1.3,1.3,0,0,0-1.29,1.1l0,.17-.55,3.48,0,.13s0,.06,0,.07a.09.09,0,0,1-.06,0Z', style='fill: #253b80')
          path(d='M13.69,7.59a1.91,1.91,0,0,1-.06.33C12.9,11.69,10.39,13,7.18,13H5.54a.79.79,0,0,0-.78.68L3.92,19l-.24,1.51A.43.43,0,0,0,4,21H7a.69.69,0,0,0,.69-.58l0-.15.55-3.47,0-.19A.71.71,0,0,1,9,16h.44c2.8,0,5-1.14,5.65-4.44a3.78,3.78,0,0,0-.58-3.34A2.79,2.79,0,0,0,13.69,7.59Z', style='fill: #179bd7')
          path(d='M12.92,7.28a5.59,5.59,0,0,0-.71-.15A8.73,8.73,0,0,0,10.77,7H6.4a.7.7,0,0,0-.69.59l-.93,5.88,0,.18A.79.79,0,0,1,5.54,13H7.18c3.21,0,5.72-1.3,6.45-5.07a1.91,1.91,0,0,0,.06-.33,3.16,3.16,0,0,0-.6-.25Z', style='fill: #222d65')
          path(d='M5.71,7.61A.7.7,0,0,1,6.4,7h4.37a9.26,9.26,0,0,1,1.44.11,4.51,4.51,0,0,1,.88.21,3.27,3.27,0,0,1,.6.25,3.57,3.57,0,0,0-.75-3.2C12.11,3.44,10.61,3,8.69,3H3.11a.79.79,0,0,0-.78.67L0,18.42A.47.47,0,0,0,.4,19H3.92l.86-5.48Z', style='fill: #253b80')

        span.civic-page__payment-select-fake-label {{ $t('CivicPage.usingPayment', { method: $t(`CivicPage.paymentMethod.${selectedPaymentMethod}`) }) }}
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
                    :class="actionButtonClass"
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
                :class="actionButtonClass"
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

import { checkIsMobileClient } from '~/util/client';
import { getOAuthRegisterAPI, getUserMinAPI } from '~/util/api';
import { getAvatarHaloTypeFromUser } from '~/util/user';

import { PAYMENT_METHOD_LIST } from '~/constant';

export default {
  components: {
    vueVimeoPlayer,
    PageHeader,
    SiteNavBar,
    LikerComparisonCard,
    VolumeOnIcon,
    VolumeOffIcon,
  },
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
