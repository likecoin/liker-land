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
                  :is="`${getUserSubscriptionInfo.card.brand}-icon`"
                )
                .settings-civic-page__billing-summary-row-value
                  | {{ maskedCardNumber }}
              .settings-civic-page__billing-summary-row.liker-comparison-card__b--mx
                label.settings-civic-page__billing-summary-row-label
                  | {{ $t(`SettingsCivicPage.billingSummary.${getUserSubscriptionInfo.willCancel ? 'cancel' : 'nextBilling'}Date`) }}
                .settings-civic-page__billing-summary-row-value
                  | {{ nextBillingDateString }}

        NuxtLink.btn.btn--plain.btn--auto-size.text-12(
          v-if="getUserSubscriptionInfo.willCancel"
          :to="{ name: 'civic-register' }"
        )
          | {{ $t('SettingsCivicPage.resumeSubscription') }}
        NuxtLink.btn.btn--plain.btn--auto-size.text-12(
          v-else
          :to="{ name: 'settings-civic-cancel' }"
        )
          | {{ $t('SettingsCivicPage.cancelSubscription') }}

      NuxtChild(v-else-if="state === 'cancel'")

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
import { mapActions, mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import LikerComparisonCard from '~/components/LikerComparisonCard';

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
    };
  },
  computed: {
    ...mapGetters([
      'getUserSubscriptionInfo',
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
      if (
        this.getUserSubscriptionInfo &&
        this.$route.name === 'settings-civic-cancel'
      ) {
        return 'cancel';
      }
      if (this.getUserSubscriptionInfo) return 'stripe';
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
    nextBillingDateString() {
      if (this.getUserSubscriptionInfo) {
        return dateFormat(
          new Date(this.getUserSubscriptionInfo.currentPeriodEnd * 1000),
          'YYYY/MM/DD'
        );
      }
      return '';
    },
    maskedCardNumber() {
      if (this.getUserSubscriptionInfo) {
        const {
          card: { brand, last4 },
        } = this.getUserSubscriptionInfo;
        return getMaskedCardNumber(brand, last4);
      }
      return '';
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
    ...mapActions(['fetchUserSubscriptionInfo']),

    async fetchSubscriptionInfo() {
      if (this.getUserIsCivicLikerPaid) {
        try {
          const { willCancel } = await this.fetchUserSubscriptionInfo();
          if (willCancel && this.$route.name === 'settings-civic-cancel') {
            this.$router.replace({ name: 'settings-civic' });
          }
        } catch (err) {
          if (err.response && err.response.status === 404) {
            if (this.$route.name === 'settings-civic-cancel') {
              this.$router.replace({ name: 'settings-civic' });
            }
          } else {
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
