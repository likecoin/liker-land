<template>
  <AuthRequiredView class="flex flex-col" :login-label="$t('settings_subscription_login_label')"
    :login-button-label="$t('settings_subscription_login_in_button')">
    <Label class="text-like-green" preset="h5" align="center">{{
      $t('settings_subscription_title')
    }}</Label>

    <CardV2 class="my-[12px] text-center">
      <div v-if="walletHasLikeCoinApiAuthorization">
        <ul
          v-for="s in formattedSubscriptions"
          :key="getPlanDataKey(s.creator, s.productId)"
        >
          <li>
            Creator:
            <NuxtLink
              :to="localeLocation({ name: 'id', params: { id: s.creator } })"
              >{{ s.creator }}</NuxtLink
            >
          </li>
          <li>Active until: {{ s.currentPeriodEnd }}</li>
          <ul v-if="planData[getPlanDataKey(s.creator, s.productId)]">
            <li>
              Plan Name:
              {{ s.planName }}
            </li>
            <li>
              Price:
              {{ s.price }}
            </li>
            <li>
              <Markdown
                :md-string="s.description"
              />
            </li>
          </ul>
        </ul>
        <hr />
        <button @click="onClickPortal">
          Click to manage your payment method and subscription
        </button>
      </div>
      <div v-else>
        <button @click="onClickAuth">Please sign to access subscription</button>
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
    formattedSubscriptions() {
      let { locale } = this.$i18n;
      if (locale === 'zh-Hant') {
        locale = 'zh';
      }
      const defaultLocale = 'en';

      return Object.entries(this.activeSubscriptions).map(
        ([creator, data]) => ({
          creator,
          currentPeriodEnd: data.currentPeriodEnd * 1000,
          productId: data.productId,
          planName:
            this.planData[this.getPlanDataKey(creator, data.productId)]?.name[
              locale
            ] ||
            this.planData[this.getPlanDataKey(creator, data.productId)]?.name[
              defaultLocale
            ],
          price: this.planData[this.getPlanDataKey(creator, data.productId)]
            ?.price,
          description:
            this.planData[this.getPlanDataKey(creator, data.productId)]
              ?.description[locale] ||
            this.planData[this.getPlanDataKey(creator, data.productId)]
              ?.description[defaultLocale],
        })
      );
    },
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
      window.open(data?.url);
    },
    async refreshSubscriptions() {
      const { data } = await this.$axios.get(nftGetUserActiveSubscription(), {
        headers: {
          Authorization: `Bearer ${this.walletLikeCoinApiToken}`,
        },
      });
      this.activeSubscriptions = data?.plans || [];
      Object.entries(this.activeSubscriptions).forEach(([wallet, data]) => {
        this.fetchPlanData(wallet, data.productId);
      });
    },
  },
};
</script>
