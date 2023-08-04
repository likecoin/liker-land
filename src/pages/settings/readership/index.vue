<template>
  <AuthRequiredView class="flex flex-col" :login-label="$t('settings_subscription_login_label')"
    :login-button-label="$t('settings_subscription_login_in_button')">
    <Label class="text-like-green" preset="h5" align="center">{{
      $t('settings_subscription_title')
    }}</Label>

    <CardV2 class="my-[12px] text-center">
      <div>
        <div v-if="walletHasLikeCoinApiAuthorization">
          <ul v-for="[creator, data] in Object.entries(activeSubscriptions)" :key="getPlanDataKey(creator, data.productId)">
            <li>Creator:
              <NuxtLink :to="localeLocation({ name: 'id', params: { id: creator } })">{{ creator }}</NuxtLink>
            </li>
            <li>Active until: {{ new Date(data.currentPeriodEnd * 1000) }}</li>
            <ul v-if="planData[getPlanDataKey(creator, data.productId)]">
              <li>Plan Name: {{ planData[getPlanDataKey(creator, data.productId)].name.en }}</li>
              <li>Price: {{ planData[getPlanDataKey(creator, data.productId)].price }}</li>
              <li>{{ planData[getPlanDataKey(creator, data.productId)].description.en }}</li>
            </ul>
          </ul>
          <hr>
          <button @click="onClickPortal">Click to manage your payment method and subscription</button>
        </div>
        <div v-else>
          <button @click="onClickAuth">Please sign to access subscription</button>
        </div>
      </div>
    </CardV2>
  </AuthRequiredView>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import walletMixin from '~/mixins/wallet';

import {
  nftGetUserActiveSubscription,
  nftGetCreatorSubscriptionPlanById,
  nftStripeSubscriptionPortal,
} from '~/util/api';

export default {
  mixins: [walletMixin],
  data() {
    return {
      activeSubscriptions: {},
      planData: {},
    };
  },
  computed: {
    ...mapGetters([
      'walletHasLikeCoinApiAuthorization',
      'walletLikeCoinApiToken',
    ]),
  },
  watch: {
    walletHasLoggedIn: {
      immediate: true,
      handler(hasLoggedIn) {
        if (hasLoggedIn) {
          if (!this.walletHasLikeCoinApiAuthorization) {
            this.initWalletAndSignLikeCoinApiToken();
          } else {
            this.refreshSubscriptions();
          }
        }
      },
    },
    walletHasLikeCoinApiAuthorization: {
      handler(hasAuthorization) {
        if (hasAuthorization) this.refreshSubscriptions();
      },
    },
  },
  methods: {
    ...mapActions(['signLikeCoinApiAuthorize']),
    async fetchPlanData(creator, productId) {
      const key = this.getPlanDataKey(creator, productId);
      const { data } = await this.$axios.get(
        nftGetCreatorSubscriptionPlanById(creator, productId)
      );
      Vue.set(this.planData, key, data);
    },
    getPlanDataKey(creator, productId) {
      return `${creator}_${productId}`;
    },
    async onClickAuth() {
      if (!this.getAddress) {
        const isConnected = await this.connectWallet({
          shouldSkipLogin: true,
        });
        if (!isConnected) return;
      } else {
        await this.initIfNecessary();
      }
      await this.signLikeCoinApiAuthorize();
    },
    async onClickPortal() {
      const { data } = await this.$axios.post(
        nftStripeSubscriptionPortal(),
        {},
        {
          headers: {
            Authorization: `Bearer ${this.walletLikeCoinApiToken}`,
          },
        }
      );
      window.open(data.url);
    },
    async refreshSubscriptions() {
      const { data } = await this.$axios.get(nftGetUserActiveSubscription(), {
        headers: {
          Authorization: `Bearer ${this.walletLikeCoinApiToken}`,
        },
      });
      this.activeSubscriptions = data.plans || [];
      Object.entries(this.activeSubscriptions).forEach(([wallet, data]) => {
        this.fetchPlanData(wallet, data.productId);
      });
    },
  },
};
</script>
