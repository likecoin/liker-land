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
      <CivicLikerFeatureList
        :since-date="formattedCivicLikerSinceDate"
        :is-active="getUserIsCivicLiker"
      />
      <div class="bg-white rounded-8 mt-16 px-32 py-24 text-12 text-gray-4a leading-1_5 phone:px-16">
        <template v-if="getUserSubscriptionInfo.willCancel">
          <div class="text-24 font-500">
            {{ $t('SettingsSupportPage.Cancelled') }}
          </div>
          <div class="flex items-center mt-20">
            <div class="flex-grow">
              <div>{{ $t('SettingsSupportPage.CancelledDate', { date: getUserSubscriptionInfo.currentPeriodEndString }) }}</div>
            </div>
            <div>
              <Button
                class="text-like-green"
                preset="plain"
                :href="getStripeBillingPortalAPI"
              >
                <div class="px-4">
                  <LinkIcon class="mr-4 align-middle" width="9px" />
                  <span class="underline">{{ $t('SettingsSupportPage.BillingHistory') }}</span>
                </div>
              </Button>
            </div>
          </div>
          <Button
            class="mt-24"
            size="large"
            :title="$t('SettingsCivicCancelPage.continue')"
            :to="{
              name: 'id-civic',
              params: { id: defaultSupporter },
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
            <div class="flex flex-col items-start ml-12 text-like-green">
              <Button
                class="-mt-8"
                preset="plain"
                :href="getStripeBillingPortalAPI"
                :title="$t('SettingsSupportPage.ManagePaymentMethod')"
                title-class="text-12"
              >
                <template #prepend>
                  <LinkIcon width="9px" />
                </template>
              </Button>
              <Button
                preset="plain"
                :href="getStripeBillingPortalAPI"
                :title="$t('SettingsSupportPage.BillingHistory')"
                title-class="text-12"
              >
                <template #prepend>
                  <LinkIcon width="9px" />
                </template>
              </Button>
            </div>
          </div>
          <div class="mt-20">
            <div class="font-500">{{ getUserSubscriptionInfo.currentPeriodEndString }}</div>
            <div>{{ $t('SettingsCivicPage.billingSummary.nextBillingDate') }}</div>
          </div>
        </template>
      </div>
    </template>

    <template v-else>
      <CivicLikerFeatureList />

      <div class="max-w-phone-min mt-24 mb-16 mx-auto">
        <Button
          preset="primary"
          :title="$t('SettingsSupportPage.AboutCivicLiker')"
          :to="{ name: 'civic' }"
          :full="true"
          size="large"
        />
      </div>
    </template>

    <h2
      class="mt-40 text-like-green font-24 font-500"
    >{{ $t('SettingsSupportPage.Title.ManageSupportingUser') }}</h2>
    <ul
      key="content"
      class="supporting-liker-list flex flex-wrap list-reset m-0 mt-12 pb-32"
    >
      <li v-if="supportingLikerIds.length === 0">
        <EmptyLikerView class="h-full" />
      </li>
      <li
        v-for="id in subscriptionIds"
        :key="id"
      >
        <SupportingLikerView
          class="h-full"
          :liker-id="id"
          :price="getAuthorQuantity(id) * 5"
        />
      </li>
    </ul>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import { CIVIC_LIKER_CLASSIC_LIKER_ID, DEFAULT_CL_SUPPORTER } from '~/constant';

import Button from '~/components/Button/Button';
import CardBrand from '~/components/CardBrand/CardBrand';
import CivicLikerFeatureList from '~/components/CivicLikerFeatureList/CivicLikerFeatureList';
import EmptyLikerView from '~/components/SupportingLikerView/EmptyLikerView';
import LinkIcon from '~/components/Icon/Link8';
import Spinner from '~/components/Spinner/Spinner';
import SupportingLikerView from '~/components/SupportingLikerView/SupportingLikerView';

import { getStripeBillingPortalAPI } from '~/util/api';
import { getMaskedCardNumber } from '~/util/billing';

export default {
  components: {
    Button,
    CardBrand,
    CivicLikerFeatureList,
    EmptyLikerView,
    LinkIcon,
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
      'getUserInfo',
      'getUserSubscriptionInfo',
      'getUserIsCivicLiker',
      'getCivicSupportingUsers',
    ]),
    getStripeBillingPortalAPI,
    supportingLikerIds() {
      return Object.keys(this.getCivicSupportingUsers).filter(
        id => id !== CIVIC_LIKER_CLASSIC_LIKER_ID
      );
    },
    subscriptionIds() {
      return this.supportingLikerIds.concat(CIVIC_LIKER_CLASSIC_LIKER_ID);
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
    formattedCivicLikerSinceDate() {
      const { civicLikerSince: ts = 0 } = this.getUserInfo || {};
      if (!ts) return '';
      return dateFormat(ts, 'YYYY/MM/DD');
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
    defaultSupporter() {
      return DEFAULT_CL_SUPPORTER;
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
