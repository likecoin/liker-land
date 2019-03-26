<template>
  <component
    :is="tag"
    :class="[
      'civic-pricing-card',
      `civic-pricing-card--${type}`,
    ]"
  >
    <div class="civic-pricing-card__header">
      <div class="civic-pricing-card__type">
        {{ $t(`LikerType.${type}`) }}
      </div>
      <div>
        <span
          class="civic-pricing-card__price"
        >{{ $options.pricing[type].price }}</span>
        <span
          class="civic-pricing-card__payment-cycle"
        >{{ $t($options.pricing[type].paymentCycle) }}</span>
      </div>
      <slot name="header" />
    </div>
    <ul
      v-if="isShowFeatures"
      class="civic-pricing-card__body"
    >
      <li
        v-for="key in $options.featureList"
        :key="key"
        :class="[
          'civic-pricing-card__feature',
          {
            'civic-pricing-card__feature--disabled': !$options.pricing[type].features[key],
          },
        ]"
      >
        <TickIcon class="civic-pricing-card__feature-bullet" />{{ $t(`CivicLikerPricing.${key}`) }}
      </li>
    </ul>
  </component>
</template>

<script>
import TickIcon from '~/assets/icons/tick.svg';

export default {
  name: 'CivicPricingCard',
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
.civic-pricing-card {
  max-width: 288px;

  @apply bg-white;

  @apply rounded;

  @apply p-24;

  @apply w-full;

  &__header {
    min-height: 124px;
  }

  &__header + &__body {
    @apply border-gray-d8;
    @apply border-t;

    @apply pt-24;
  }

  &__body {
    @apply list-reset;
  }

  &__type {
    @apply text-gray-9b;
    @apply text-14;

    @apply mb-8;

    .civic-pricing-card--civic & {
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

      .civic-pricing-card--civic & {
        @apply text-like-cyan;
      }
    }
  }
}
</style>
