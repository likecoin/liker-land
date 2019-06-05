<template lang="pug">
  component.liker-comparison-card(
    :is="tag"
    :class="`liker-comparison-card--${type}`"
  )
    .liker-comparison-card__header
      .liker-comparison-card__type {{ $t(`LikerType.${type}`) }}

      div
        span.liker-comparison-card__price {{ plan.price }}
        span.liker-comparison-card__payment-cycle {{ $t(plan.billingCycle) }}

      slot(name="header")

    .liker-comparison-card__feature-prepend(
      v-if="$slots['feature-prepend']"
    )
      slot(name="feature-prepend")

    ul.liker-comparison-card__feature-list(
      v-if="isShowFeatures"
    )
      li.liker-comparison-card__feature(
        v-for="feature in featureList"
        :key="feature"
        :class="{ 'liker-comparison-card__feature--disabled': !getFeatureAvailability(feature) }"
      )
        TickIcon.liker-comparison-card__feature-bullet
        | {{ getFeatureText(feature) }}

</template>

<script>
import TickIcon from '~/assets/icons/tick.svg';

const LIKER_FEATURE = {
  DISTRIBUTE_FUND: 'distributeFund',
  DISTRIBUTE_OWN_FEE: 'distributeOwnFee',
  DETAILED_REPORT: 'detailedReport',
  PARTICIPATE_IN_COMMUNITY: 'participateInCommunity',
  BONUS_CONTENT: 'bonusContent',
  OFFLINE_EVENTS: 'offlineEvents',
};

export default {
  name: 'LikerComparisonCard',
  components: {
    TickIcon,
  },
  props: {
    type: {
      type: String,
      default: 'general',
    },
    tag: {
      type: String,
      default: 'div',
    },
    isShowFeatures: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    featureList() {
      return [
        LIKER_FEATURE.DISTRIBUTE_FUND,
        LIKER_FEATURE.DISTRIBUTE_OWN_FEE,
        LIKER_FEATURE.DETAILED_REPORT,
        LIKER_FEATURE.PARTICIPATE_IN_COMMUNITY,
        LIKER_FEATURE.BONUS_CONTENT,
        LIKER_FEATURE.OFFLINE_EVENTS,
      ];
    },
    plan() {
      switch (this.type) {
        case 'civic':
          return {
            price: 'USD5.00',
            billingCycle: 'month',
            features: this.featureList,
          };

        case 'general':
        default:
          return {
            price: 'USD0.00',
            billingCycle: 'month',
            features: [LIKER_FEATURE.DISTRIBUTE_FUND],
          };
      }
    },
  },
  methods: {
    getFeatureAvailability(feature) {
      return this.plan.features.includes(feature);
    },
    getFeatureText(feature) {
      const i18nPath = `LikerFeature.${feature}`;
      const i18nPathWithType = `${i18nPath}.${this.type}`;
      if (this.$te(i18nPathWithType)) {
        return this.$t(i18nPathWithType);
      }
      if (this.$te(i18nPathWithType, this.$i18n.fallbackLocale)) {
        return this.$t(i18nPathWithType, this.$i18n.fallbackLocale);
      }
      return this.$t(i18nPath);
    },
  },
};
</script>

<style lang="scss">
.liker-comparison-card {
  max-width: 288px;

  @apply relative;

  @apply w-full;

  @apply rounded;

  &::before {
    content: '';

    border-radius: inherit;

    @apply absolute;
    @apply overflow-hidden;
    @apply pin;

    @apply bg-white;
  }

  > * {
    position: relative;
  }

  &__b {
    @apply relative;

    &--mx {
      @apply px-24;
    }
  }

  &__header,
  &__feature-list {
    @extend .liker-comparison-card__b;
    @extend .liker-comparison-card__b--mx;
  }

  &__header {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;

    @apply pt-24;
    @apply pb-12;
  }

  &__header + &__feature-list {
    &::before {
      height: 1px;

      content: '';

      @apply block;

      @apply border-gray-d8;
      @apply border-t;

      @apply pt-24;

      @apply w-full;
    }
  }

  &__type {
    @apply text-gray-9b;
    @apply text-14;

    @apply mb-8;

    .liker-comparison-card--civic & {
      @apply text-like-green;
    }
  }

  &__price {
    @apply text-gray-4a;
    @apply text-30;
    @apply font-600;
  }

  &__payment-cycle {
    @apply text-gray-9b;
    @apply text-12;

    &::before {
      content: '/';
    }
  }

  &__feature {
    &-list {
      list-style: none;

      @apply pb-24;
    }

    @apply text-gray-4a;

    @apply flex;
    @apply items-center;

    &:not(:first-child) {
      @apply mt-16;
    }

    &--disabled {
      @apply opacity-25;
    }

    &-bullet {
      @apply flex-no-shrink;

      @apply w-16;
      @apply h-16;

      @apply mr-8;

      @apply fill-current;

      .liker-comparison-card--civic & {
        @apply text-like-cyan;
      }
    }
  }
}
</style>
