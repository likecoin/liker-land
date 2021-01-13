<template lang="pug">
  mixin HintText()
    i18n.mt-16.text-12.text-gray-9b.text-center.leading-1_5(
      v-if="hintI18nPath"
      tag="p"
      :path="hintI18nPath"
      :places="{ date: getUserSubscriptionInfo.currentPeriodEndString }"
    )
      CL1VsCL2Link(place="compare")

  Transition(name="fade")
    main(
      :key="state"
      :class="rootClass"
    )
      LcLoadingIndicator.block.py-48.text-like-green.fill-current(
        v-if="state === 'loading'"
      )

      NuxtChild(v-else-if="state === 'cancel'")

      template(v-else-if="state === 'stripe'")
        LikerComparisonCard(
          type="civic"
          :is-show-features="false"
        )
          template(#feature-prepend)
            .settings-civic-page__billing-summary
              .settings-civic-page__billing-summary-row.liker-comparison-card__b--mx
                CardBrand.settings-civic-page__billing-summary-row-card-icon(
                  :brand="getUserSubscriptionInfo.card.brand"
                )
                .settings-civic-page__billing-summary-row-value
                  | {{ maskedCardNumber }}
                a.btn.btn--plain.btn--auto-size.text-12.px-0(
                  :href="getStripeBillingPortalAPI"
                )
                  | {{ $t('SettingsCivicPage.editPaymentMethod') }}
              .settings-civic-page__billing-summary-row.liker-comparison-card__b--mx
                label.settings-civic-page__billing-summary-row-label
                  | {{ $t(`SettingsCivicPage.billingSummary.${getUserSubscriptionInfo.willCancel ? 'cancel' : 'nextBilling'}Date`) }}
                .settings-civic-page__billing-summary-row-value
                  | {{ getUserSubscriptionInfo.currentPeriodEndString }}

        a.btn.btn--plain.btn--auto-size.text-12(
          v-if="getUserSubscriptionInfo.willCancel"
          href="#"
          @click="onResumeCanceledSubscription"
        )
          | {{ $t('SettingsCivicPage.resumeSubscription') }}
        NuxtLink.btn.btn--plain.btn--auto-size.text-12(
          v-else-if="getUserShouldRenewCivic"
          :to="{ name: 'civic-register-stripe', query: { civic_liker_version: '1', utm_source: 'settings-civic' } }"
        )
          | {{ $t('SettingsCivicPage.resumeSubscription') }}
        NuxtLink.btn.btn--plain.btn--auto-size.text-12(
          v-else
          :to="{ name: 'settings-civic-unsubscribe' }"
        )
          | {{ $t('SettingsCivicPage.cancelSubscription') }}

        +HintText

      template(v-else)
        LikerComparisonCard(
          :type="state"
        )
          template(#header)
            .mt-12.mx-12
              NuxtLink(
                :class="buttonClass"
                :to="buttonTo"
              )
                | {{ buttonText }}
        br
        NuxtLink.btn.btn--plain.btn--auto-size.text-12(
          v-if="getUserShouldRenewCivic"
          :to="{ name: 'civic-register-stripe', query: { civic_liker_version: '1', utm_source: 'settings-civic' } }"
        )
          | {{ $t('SettingsCivicPage.resumeSubscription') }}
        span.text-12(
          v-else-if="getUserIsCivicLiker"
        )
          | {{ $t('SettingsCivicPage.cancelSubscription') }}:
          a.btn.btn--plain.btn--auto-size.text-12.px-0.pl-8(
            :href="getPaypalUnsubscribeURL"
          )
            | Paypal
          | /
          a.btn.btn--plain.btn--auto-size.text-12.px-0(
            :href="getOiceSettingsURL"
          )
            | oice

        +HintText
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import {
  getStripeBillingPortalAPI,
  getPaypalUnsubscribeURL,
  getOiceSettingsURL,
} from '~/util/api';
import { getMaskedCardNumber } from '~/util/billing';

import CardBrand from '~/components/CardBrand/CardBrand';
import CL1VsCL2Link from '~/components/CL1VsCL2Link';

import LikerComparisonCard from './LikerComparisonCard';

export default {
  components: {
    LikerComparisonCard,
    CardBrand,
    CL1VsCL2Link,
  },
  middleware: 'authenticated',
  data() {
    return {
      isFetchedSubscriptionInfo: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserShouldRenewCivic',
      'getUserSubscriptionInfo',
      'getUserIsCivicLiker',
      'getUserIsCivicLikerTrial',
      'getUserIsCivicLikerPaid',
    ]),
    getPaypalUnsubscribeURL,
    getOiceSettingsURL,
    getStripeBillingPortalAPI,
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
        this.$route.name === 'settings-civic-unsubscribe'
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
    maskedCardNumber() {
      if (this.getUserSubscriptionInfo) {
        const {
          card: { brand, last4 },
        } = this.getUserSubscriptionInfo;
        return getMaskedCardNumber(brand, last4);
      }
      return '';
    },
    hintI18nPath() {
      if (this.getUserShouldRenewCivic) {
        return 'CivicSettingsV1.GracePeriod';
      }
      if (
        this.getUserSubscriptionInfo &&
        this.getUserSubscriptionInfo.willCancel
      ) {
        return 'CivicSettingsV1.WillCancel';
      }
      return '';
    },
  },
  head() {
    return {
      title: this.$t('SettingsCivicPage.title'),
      link: [
        {
          hid: 'preload:stripe',
          rel: 'preload',
          href: 'https://js.stripe.com/v3',
          as: 'script',
        },
      ],
      script: [{ hid: 'stripe', src: 'https://js.stripe.com/v3/' }],
    };
  },
  mounted() {
    this.fetchSubscriptionInfo();
  },
  methods: {
    ...mapActions(['fetchUserSubscriptionInfo', 'resumeCanceledSubscription']),

    async fetchSubscriptionInfo() {
      if (this.getUserIsCivicLikerPaid) {
        try {
          const { willCancel } = await this.fetchUserSubscriptionInfo();
          if (willCancel && this.$route.name === 'settings-civic-unsubscribe') {
            this.$router.replace({ name: 'settings-civic' });
          }
        } catch (err) {
          if (err.response && err.response.status === 404) {
            if (this.$route.name === 'settings-civic-unsubscribe') {
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
    async onResumeCanceledSubscription() {
      await this.resumeCanceledSubscription();
      this.isFetchedSubscriptionInfo = false;
      await this.fetchSubscriptionInfo();
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
