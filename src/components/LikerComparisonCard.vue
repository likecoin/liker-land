<template lang="pug">
  component.liker-comparison-card(
    :is="tag"
    :class="`liker-comparison-card--${type}`"
  )
    .liker-comparison-card__header
      .liker-comparison-card__type {{ $t(`LikerType.${type}`) }}

      div
        span.liker-comparison-card__price {{ $options.pricing[type].price }}
        span.liker-comparison-card__payment-cycle {{ $t($options.pricing[type].paymentCycle) }}

      slot(name="header")

    ul.liker-comparison-card__body(v-if="isShowFeatures")
      li.liker-comparison-card__feature(
        v-for="key in $options.featureList"
        :key="key"
        :class="{ 'liker-comparison-card__feature--disabled': !$options.pricing[type].features[key] }"
      )
        TickIcon.liker-comparison-card__feature-bullet
        | {{ $t(`CivicLikerPricing.${key}`) }}

</template>

<script>
import TickIcon from '~/assets/icons/tick.svg';

export default {
  name: 'LikerComparisonCard',
  components: {
    TickIcon,
  },
  pricing: {
    general: {
      price: 'USD0.00',
      paymentCycle: 'month',
      features: {
        ICRpool: true,
        ownRewardPool: false,
        communityVoting: false,
        bonusContent: false,
        idolNewsletter: false,
        offlineEvent: false,
        report: false,
        badges: false,
      },
    },
    civic: {
      price: 'USD5.00',
      paymentCycle: 'month',
      features: {
        ICRpool: true,
        ownRewardPool: true,
        communityVoting: true,
        bonusContent: true,
        idolNewsletter: true,
        offlineEvent: true,
        report: true,
        badges: true,
      },
    },
  },
  featureList: [
    'ICRpool',
    'ownRewardPool',
    'communityVoting',
    'bonusContent',
    'idolNewsletter',
    'offlineEvent',
    'report',
    'badges',
  ],
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
    @apply relative;

    @apply px-24;

    &:first-child {
      @apply pt-24;
    }

    &:last-child {
      @apply pb-24;
    }
  }

  &__header {
    min-height: 148px;

    border-top-left-radius: inherit;
    border-top-right-radius: inherit;

    @apply pb-12;
  }

  &__header + &__body {
    &::before {
      content: '';

      height: 1px;

      @apply block;

      @apply border-gray-d8;
      @apply border-t;

      @apply pt-24;

      @apply w-full;
    }
  }

  &__body {
    list-style: none;
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
