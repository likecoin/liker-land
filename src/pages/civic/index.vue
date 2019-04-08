<template>
  <div class="civic-page bg-gray-f7">
    <PageHeader>
      <template>
        <SiteNavBar class="text-like-green" />
      </template>
    </PageHeader>

    <main class="page-content">
      <div class="max-w-desktop w-full mx-auto">
        <img
          class="w-full"
          :src="CivicLikerHeroImage"
          :alt="$t('civicLiker')"
        >
      </div>
      <section class="max-w-desktop mx-auto -mt-24">
        <ul class="list-reset flex justify-center overflow-x-hidden">
          <CivicPricingCard
            tag="li"
            class="mx-8 tablet:hidden phone:hidden"
            type="general"
          />
          <CivicPricingCard
            tag="li"
            class="mx-8"
            type="civic"
          >
            <template #header>
              <div class="relative mt-12 mx-12">
                <button
                  :class="[
                    'btn btn--outlined btn--block m-0 w-full',
                    {
                      'btn--disabled': !!getUserIsCivicLiker,
                    },
                  ]"
                  @click="onClickActionButton"
                >{{ actionButtonText }}</button>
                <LcChopCivicLiker
                  class="absolute phone:hidden"
                  style="left: 100%;margin-left: 0.75rem;transform: translateY(-65%) rotate(20deg)"
                  size="180"
                  text="LIKE"
                />
              </div>
            </template>
          </CivicPricingCard>
        </ul>
        <div class="text-like-green text-20 leading-1_5 text-center p-24 desktop:px-32">
          {{ $t('CivicPage.slogan') }}
        </div>
      </section>

      <section ref="visionSection">
        <div
          v-swiper:featureSwiper="$options.featureSwiper"
          class="civic-feature-card-swiper-container bg-like-gradient"
        >
          <ul class="civic-feature-card-wrapper">
            <li
              v-for="i in 3"
              :key="i"
              class="civic-feature-card"
            >
              <!-- eslint-disable vue/no-v-html -->
              <div
                class="civic-feature-card__header"
                v-html="$t(`CivicLikerFeature[${i - 1}].header`)"
              />
              <div
                class="civic-feature-card__body"
                v-html="$t(`CivicLikerFeature[${i - 1}].body`)"
              />
              <!-- eslint-enable vue/no-v-html -->
            </li>
          </ul>
        </div>

        <div class="relative bg-white flex justify-center items-center">
          <LcChopCivicLiker
            class="absolute phone:hidden z-10 m-24 my-0"
            style="right: 0;transform: rotate(20deg)"
            size="120"
            text="LIKE"
          />
          <CivicPricingCard
            type="civic"
            :is-show-features="false"
          >
            <template #header>
              <div class="mt-12 mx-12">
                <button
                  :class="[
                    'btn btn--outlined btn--block mx-0 -mb-12 w-full',
                    {
                      'btn--disabled': !!getUserIsCivicLiker,
                    },
                  ]"
                  @click="onClickActionButton"
                >{{ actionButtonText }}</button>
              </div>
            </template>
          </CivicPricingCard>
        </div>
      </section>

      <section class="max-w-desktop mx-auto text-gray-9b text-12 p-20 laptop:px-20 desktop:px-32 pb-64">
        <p>{{ $t('CivicPage.footnote.0') }}</p>
        <p class="mt-16">{{ $t('CivicPage.footnote.1') }}</p>
      </section>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';
import CivicPricingCard from '~/components/CivicPricingCard';

import CivicLikerHeroImage from '~/assets/images/civic/hero.png';

export default {
  components: {
    PageHeader,
    SiteNavBar,
    CivicPricingCard,
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
      CivicLikerHeroImage,
    };
  },
  computed: {
    ...mapGetters([
      'getUserId',
      'getUserIsCivicLikerTrial',
      'getUserIsCivicLiker',
    ]),

    actionButtonText() {
      if (this.getUserIsCivicLikerTrial) {
        return this.$t('upgrade');
      }
      return this.$t(this.getUserIsCivicLiker ? 'registered' : 'register');
    },
  },
  head() {
    return {
      title: this.$t('CivicPage.title'),
    };
  },
  mounted() {
    const { from, referrer } = this.$route.query;
    if (window.sessionStorage) {
      if (from) window.sessionStorage.setItem('civicLikerFrom', from);
      if (referrer)
        window.sessionStorage.setItem('civicLikerReferrer', referrer);
    }
  },
  methods: {
    onClickActionButton() {
      if (!this.getUserId) {
        throw new Error('LOGIN_NEEDED_TO_REGISTER_CIVIC_LIKER');
      }
      this.$router.push({
        name: 'civic-register',
        query: this.$route.query,
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
