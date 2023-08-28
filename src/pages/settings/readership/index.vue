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
          <ul v-if="getSubscriptionPlanData(s.creator, s.productId)">
            <li>
              Plan Name:
              {{ getSubscriptionPlanData(s.creator, s.productId).name }}
            </li>
            <li>
              Price:
              {{ getSubscriptionPlanData(s.creator, s.productId).price }}
            </li>
            <li>
              <Markdown
                :md-string="getSubscriptionPlanData(s.creator, s.productId).description.en"
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
import { mapGetters, mapActions } from 'vuex';
import walletMixin from '~/mixins/wallet';

import { nftStripeSubscriptionPortal } from '~/util/api';

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
      'getActiveSubscriptionStatus',
      'getSubscriptionPlanData',
    ]),
    formattedSubscriptions() {
      let { locale } = this.$i18n;
      if (locale === 'zh-Hant') {
        locale = 'zh';
      }
      const defaultLocale = 'en';

      return Object.entries(this.getActiveSubscriptionStatus).map(
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
  mounted() {
    this.updateWalletSubscriptionStatus();
  },
  methods: {
    ...mapActions([
      'updateWalletSubscriptionStatus',
      'signLikeCoinApiAuthorize',
    ]),
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
  },
};
</script>
