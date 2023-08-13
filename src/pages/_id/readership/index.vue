<template>
  <Page class="px-[8px]">
    <div
      :class="[
        'flex',

        'flex-col',
        'desktop:flex-row',
        'gap-x-[24px]',
        'gap-y-[48px]',

        'items-center',
        'desktop:items-start',
        'desktop:justify-center',

        'w-full',
        'pt-[32px]',
        'pb-[120px]',
      ]"
    >
      <div v-if="plans.length === 0" class="mt-[10vh] bg-shade-gray rounded-[12px] text-dark-gray py-[8px] px-[12px]" >
        This creator have no readership subscription plans yet!
        <NuxtLink class="ml-[8px] text-like-green" :to="localeLocation({ name: 'id', params: { id: wallet } })"
          >Go Back</NuxtLink
        >
      </div>
      <div v-else>
        <Label align="center" preset="h2" class="mb-[32px]">Choose the plan</Label>
        <ul class="flex justify-center items-stretch gap-[12px] flex-wrap laptop:gap-[24px]">
          <div
            v-for="p in formattedPlans"
            :key="p.id"
          >
            <SubscriptionPlan
              :name="p.name"
              :description="p.description"
              :price="p.price"
              :can-free-collect="p.canFreeCollectWNFT"
              @click-subscription="onClickSubscribe"
            />
          </div>
        </ul>
      </div>
    </div>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';

import {
  nftGetCreatorSubscriptionPlans,
  nftSubscribeToCreator,
} from '~/util/api';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'NFTCreatorReadershipPage',
  mixins: [walletMixin],
  layout: 'default',
  data() {
    return {
      plans: [],
    };
  },
  computed: {
    ...mapGetters(['walletHasLoggedIn']),
    wallet() {
      return this.$route.params.id;
    },
    formattedPlans() {
      let { locale } = this.$i18n;
      if (locale === 'zh-Hant') {
        locale = 'zh';
      }
      const defaultLocale = 'en';

      const sortedPlans = this.plans
        .map(plan => ({
          ...plan,
          name: plan.name[locale] || plan.name[defaultLocale],
          description:
            plan.description[locale] || plan.description[defaultLocale],
          price: plan.priceInDecimal / 100,
        }))
        .sort((a, b) => a.price - b.price);

      return sortedPlans;
    },
  },
  async mounted() {
    const data = await this.$axios.$get(
      nftGetCreatorSubscriptionPlans(this.wallet)
    );
    this.plans = data?.plans || [];
  },
  methods: {
    async onClickSubscribe(planId) {
      const data = await this.$axios.$post(
        nftSubscribeToCreator({
          wallet: this.getAddress,
          creatorWallet: this.wallet,
          plan: planId,
        })
      );
      window.open(data?.url);
    },
  },
};
</script>
