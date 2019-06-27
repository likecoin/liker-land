<template lang="pug">
  Transition(name="fade")
    main(
      :key="state"
      :class="rootClass"
    )
      LcLoadingIndicator.block.py-48.text-like-green.fill-current(
        v-if="state === 'loading'"
      )
      template(
        v-else-if="state === 'stripe'"
      )
        LikerComparisonCard(
          type="civic"
          :is-show-features="false"
        )
          template(#feature-prepend)
            .settings-civic-page__billing-summary
              .settings-civic-page__billing-summary-row.liker-comparison-card__b--mx
                component.settings-civic-page__billing-summary-row-card-icon(
                  :is="`${subscriptionInfo.card.brand}-icon`"
                )
                .settings-civic-page__billing-summary-row-value
                  | {{ subscriptionInfo.card.number }}
              .settings-civic-page__billing-summary-row.liker-comparison-card__b--mx
                label.settings-civic-page__billing-summary-row-label
                  | {{ $t('SettingsCivicPage.billingSummary.nextBillingDate') }}
                .settings-civic-page__billing-summary-row-value
                  | {{ subscriptionInfo.nextBillingDateString }}

      LikerComparisonCard(
        v-else
        :type="state"
      )
        template(#header)
          .mt-12.mx-12
            NuxtLink(
              class="buttonClass"
              :to="buttonTo"
            )
              | {{ buttonText }}
</template>

<script>
import { mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import LikerComparisonCard from '~/components/LikerComparisonCard';

import { getStripePaymentStatusAPI } from '~/util/api';

import AmexIcon from '~/assets/icons/billing-cards/amex.svg';
import VisaIcon from '~/assets/icons/billing-cards/visa.svg';
import MastercardIcon from '~/assets/icons/billing-cards/mastercard.svg';

function getMaskedCardNumber(brand, last4) {
  switch (brand) {
    case 'visa':
    case 'mastercard':
      return `•••• •••• •••• ${last4}`;

    case 'amex':
      return `•••• •••••• •${last4}`;

    default:
      return `•••• ${last4}`;
  }
}

export default {
  components: {
    LikerComparisonCard,
    AmexIcon,
    VisaIcon,
    MastercardIcon,
  },
  middleware: 'authenticated',
  data() {
    return {
      isFetchedSubscriptionInfo: false,
      subscriptionInfo: undefined,
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsCivicLiker',
      'getUserIsCivicLikerTrial',
      'getUserIsCivicLikerPaid',
    ]),

    rootClass() {
      return {
        'settings-civic-page': true,
        'settings-civic-page--subscribed': !!this.getUserIsCivicLiker,
      };
    },
    state() {
      if (!this.isFetchedSubscriptionInfo) return 'loading';
      if (this.subscriptionInfo) return 'stripe';
      if (this.getUserIsCivicLiker) return 'civic';
      return 'general';
    },
    buttonClass() {
      return {
        'btn btn--outlined btn--block m-0 w-full': true,
        'btn--disabled text-like-green border-like-green': !!this
          .getUserIsCivicLiker,
      };
    },
    buttonText() {
      if (this.getUserIsCivicLikerPaid) {
        return this.$t('SettingsCivicPage.subscribed');
      }
      if (this.getUserIsCivicLikerTrial) {
        return this.$t('upgrade');
      }
      return this.$t('SettingsCivicPage.knowMoreAbout');
    },
    buttonTo() {
      if (this.getUserIsCivicLikerTrial) {
        return { name: 'civic-register' };
      }
      return { name: 'civic' };
    },
  },
  head() {
    return {
      title: this.$t('SettingsCivicPage.title'),
    };
  },
  mounted() {
    this.fetchSubscriptionInfo();
  },
  methods: {
    async fetchSubscriptionInfo() {
      if (this.getUserIsCivicLikerPaid) {
        try {
          const {
            // status,
            // willCancel,
            currentPeriodEnd: nextBillingDate,
            // currentPeriodStart,
            // start,
            card: { brand, last4 },
          } = await this.$axios.$get(getStripePaymentStatusAPI());
          // eslint-disable-next-line no-console
          this.subscriptionInfo = {
            nextBillingDateString: dateFormat(
              new Date(nextBillingDate * 1000),
              'YYYY/MM/DD'
            ),
            card: {
              brand,
              number: getMaskedCardNumber(brand, last4),
            },
          };
        } catch (err) {
          if (!(err.response && err.response.status === 404)) {
            console.error(err); // eslint-disable-line no-console
            this.$nuxt.error(err);
          }
        }
      }
      this.isFetchedSubscriptionInfo = true;
    },
  },
};
</script>

<style lang="scss">
.settings-civic-page {
  display: flex;
  flex-direction: column;
  align-items: center;

  @apply p-16;
  @apply pt-0;

  &--subscribed {
    .liker-comparison-card {
      &__header {
        @apply bg-like-gradient;
      }

      &__feature-list {
        &::before {
          @apply border-none;
        }
      }
    }
  }

  &__billing-summary {
    &-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      @apply text-14;
      @apply py-20;

      &:not(:first-child) {
        @apply border-gray-d8;
        @apply border-t;
      }

      &-label {
        @apply text-gray-9b;

        @apply mr-16;
      }

      &-card-icon {
        @apply text-gray-4a;
        @apply h-24;

        @apply fill-current;
      }

      &-value {
        @apply text-gray-4a;
      }
    }
  }
}
</style>
