<template>
  <NuxtChild v-if="state === 'error-not-civic'" />

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

  <div
    v-else-if="state === 'loading'"
    key="loading"
  >
    <Spinner class="mx-auto my-64" />
  </div>

  <div v-else>
    <template v-if="getUserSubscriptionInfo">
      <h2
        class="text-like-green font-24 font-500"
      >{{ $t('SettingsSupportPage.Title.ManageSubscription') }}</h2>
      <div class="bg-white rounded-8 mt-24 px-32 py-24 text-12 text-gray-4a leading-1_5">
        <div>
          <div
            class="text-24 font-500"
          >{{ `${getUserSubscriptionInfo.quantity * 5} ${$t('Currency.USD')}/${$t('SubscriptionPeriod.Month')}` }}</div>
          <div>{{ $t('SettingsSupportPage.TotalAmount') }}</div>
        </div>
        <div class="flex mt-20">
          <div class="flex-grow">
            <div class="font-500">{{ maskedCardNumber }}</div>
            <div>{{ $t('SettingsSupportPage.PaymentMethod') }}</div>
          </div>
          <div class="ml-12">
            <div>
              <a
                class="text-like-green font-500"
                :href="getStripeBillingPortalAPI"
              >{{ $t('SettingsSupportPage.ManagePaymentMethod') }}</a>
            </div>
            <div class="mt-12">
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
      </div>
    </template>

    <h2
      class="mt-40 text-like-green font-24 font-500"
    >{{ $t('SettingsSupportPage.Title.ManageSupportingUser') }}</h2>
    <ul
      v-if="supportingLikerIds.length"
      key="content"
      class="supporting-liker-list mt-12"
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
    <div
      v-else
      class="bg-white rounded-8 mt-20 px-32 py-24 text-center text-16 font-500 text-gray-4a"
    >{{ $t('SettingsSupportPage.NoSupport') }}</div>

    <NuxtChild />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

import Spinner from '~/components/Spinner/Spinner';
import SupportingLikerView from '~/components/SupportingLikerView/SupportingLikerView';

import { getStripeBillingPortalAPI } from '~/util/api';

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
  middleware: 'authenticated',
  components: {
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
  },
  async mounted() {
    if (!this.getUserIsCivicLiker) {
      this.$router.push({
        name: 'settings-support-users-id',
        params: { id: 'foundation' },
      });
      this.state = 'error-not-civic';
      return;
    }
    try {
      await Promise.all([
        this.fetchCivicSupportingUsers(),
        this.fetchUserSubscriptionInfo(),
      ]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      this.state = 'error-civic-v2';
    }
    this.state = 'done';
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
.supporting-liker-list {
  display: flex;
  flex-wrap: wrap;

  list-style: none;
  margin: 0;
  padding: 32px;
  padding-top: 0;

  li {
    width: 100%;
    max-width: 220px;
    padding: 10px;
  }
}
</style>
