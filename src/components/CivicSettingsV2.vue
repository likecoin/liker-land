<template>
  <div
    v-if="state === 'loading'"
    key="loading"
  >
    <Spinner class="mx-auto my-64" />
  </div>

  <div
    v-else-if="state.startsWith('error')"
    class="bg-white rounded-8 px-32 py-24 text-center flex flex-col items-center"
  >
    <div
      v-if="state === 'error-civic-v2'"
      class="my-32 text-16 font-500 text-gray-4a"
    >{{ $t('SettingsSupportPage.ErrorTitle.NotCivicV2') }}</div>
    <div
      v-else
      class="my-32 text-16 font-500 text-gray-4a"
    >{{ $t('SettingsSupportPage.ErrorTitle.Unknown') }}</div>
  </div>

  <div v-else>
    <template v-if="getUserSubscriptionInfo">
      <div class="flex items-center">
        <h2
          class="flex-grow text-like-green font-24 font-500"
        >{{ $t('SettingsSupportPage.Title.ManageSubscription') }}</h2>
        <Button
          :title="$t('SettingsSupportPage.AboutCivicLiker')"
          :to="{ name: 'civic' }"
        />
      </div>
      <div class="bg-white rounded-8 mt-24 px-32 py-24 text-12 text-gray-4a leading-1_5 phone:px-16">
        <template v-if="getUserSubscriptionInfo.willCancel">
          <div class="text-24 font-500">
            {{ $t('SettingsSupportPage.Cancelled') }}
          </div>
          <div class="flex mt-20">
            <div class="flex-grow">
              <div>{{ $t('SettingsSupportPage.CancelledDate', { date: getUserSubscriptionInfo.currentPeriodEndString }) }}</div>
            </div>
            <div>
              <a
                class="text-like-green font-500"
                :href="getStripeBillingPortalAPI"
              >{{ $t('SettingsSupportPage.BillingHistory') }}</a>
            </div>
          </div>
          <Button
            class="mt-24"
            size="large"
            :title="$t('SettingsCivicCancelPage.continue')"
            :to="{
              name: 'id-civic',
              params: { id: 'foundation' },
            }"
          />
        </template>
        <template v-else>
          <div>
            <div
              class="text-24 font-500"
            >{{ `${getUserSubscriptionInfo.quantity * 5} ${$t('Currency.USD')}/${$t('SubscriptionPeriod.Month')}` }}</div>
            <div>{{ $t('SettingsSupportPage.TotalAmount') }}</div>
          </div>
          <div class="flex mt-20">
            <div class="flex-grow">
              <div class="flex items-center font-500">
                <span>{{ maskedCardNumber }}</span>
                <CardBrand class="ml-4 text-16" :brand="cardBrand" />
              </div>
              <div>{{ $t('SettingsSupportPage.PaymentMethod') }}</div>
            </div>
            <div class="ml-12">
              <div>
                <a
                  class="text-like-green font-500"
                  :href="getStripeBillingPortalAPI"
                >{{ $t('SettingsSupportPage.ManagePaymentMethod') }}</a>
              </div>
              <div class="mt-12 phone:mt-4">
                <a
                  class="text-like-green font-500"
                  :href="getStripeBillingPortalAPI"
                >{{ $t('SettingsSupportPage.BillingHistory') }}</a>
              </div>
            </div>
          </div>
          <div class="mt-20">
            <div class="font-500">{{ getUserSubscriptionInfo.currentPeriodEndString }}</div>
            <div>{{ $t('SettingsCivicPage.billingSummary.nextBillingDate') }}</div>
          </div>
        </template>
      </div>
    </template>

    <template v-if="supportingLikerIds.length">
      <h2
        class="mt-40 text-like-green font-24 font-500"
      >{{ $t('SettingsSupportPage.Title.ManageSupportingUser') }}</h2>
      <ul
        key="content"
        class="supporting-liker-list flex flex-wrap list-reset m-0 mt-12 pb-32"
      >
        <li
          v-for="id in supportingLikerIds"
          :key="id"
        >
          <SupportingLikerView
            class="h-full"
            :liker-id="id"
            :price="getAuthorQuantity(id) * 5"
          />
        </li>
      </ul>
    </template>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

import Button from '~/components/Button/Button';
import CardBrand from '~/components/CardBrand/CardBrand';
import Spinner from '~/components/Spinner/Spinner';
import SupportingLikerView from '~/components/SupportingLikerView/SupportingLikerView';

import { getStripeBillingPortalAPI } from '~/util/api';
import { getMaskedCardNumber } from '~/util/billing';

export default {
  components: {
    Button,
    CardBrand,
    SupportingLikerView,
    Spinner,
  },
  data() {
    return {
      state: 'loading',
    };
  },
  computed: {
    ...mapGetters([
      'getUserSubscriptionInfo',
      'getUserIsCivicLiker',
      'getCivicSupportingUsers',
    ]),
    getStripeBillingPortalAPI,
    supportingLikerIds() {
      return Object.keys(this.getCivicSupportingUsers);
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
    cardBrand() {
      if (this.getUserSubscriptionInfo) {
        const {
          card: { brand },
        } = this.getUserSubscriptionInfo;
        return brand;
      }
      return '';
    },
  },
  async mounted() {
    if (!this.getUserIsCivicLiker) {
      this.state = 'error-not-civic';
      return;
    }
    try {
      const promises = [];
      if (this.supportingLikerIds.length === 0) {
        promises.push(this.fetchCivicSupportingUsers());
      }
      if (!this.getUserSubscriptionInfo) {
        promises.push(this.fetchUserSubscriptionInfo());
      }
      await Promise.all(promises);
      this.state = 'done';
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      this.state = 'error-civic-v2';
    }
  },
  methods: {
    ...mapActions(['fetchUserSubscriptionInfo', 'fetchCivicSupportingUsers']),
    getAuthorQuantity(id) {
      const { quantity = 0 } = this.getCivicSupportingUsers[id] || {};
      return quantity;
    },
  },
};
</script>

<style lang="scss">
$list-item-width: 220px;

.supporting-liker-list {
  padding-left: calc((100% - #{$list-item-width} * 2) / 2) !important;

  li {
    width: 100%;
    max-width: $list-item-width;
    padding: 10px;
  }

  @media screen and (max-width: 480px) {
    flex-direction: column;
    align-items: center;

    li {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
