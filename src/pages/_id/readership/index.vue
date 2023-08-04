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
        'pb-[120px]'
      ]"
    >
      <div v-if="plans.length === 0">
        This creator have no readership subscription plans yet!
        <NuxtLink :to="localeLocation({ name: 'id', params: { id: this.wallet }}) ">Go Back</NuxtLink>
      </div>
      <div v-for="p in plans" :key="p.id">
        <ul>
          <li>{{ p.name.zh }}</li>
          <li>{{ p.name.en }}</li>
          <li>{{ p.description.zh }}</li>
          <li>{{ p.description.en }}</li>
          <li v-if="p.canFreeCollectWNFT">Can collect free WNFT</li>
          <li>Price: {{ p.priceInDecimal / 100 }}</li>
          <li><button @click="onClickSubscribe(p.stripePriceId)">Join</button></li>
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
  },
  async mounted() {
    const data = await this.$axios.$get(
      nftGetCreatorSubscriptionPlans(this.wallet)
    );
    this.plans = data.plans || [];
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
      window.open(data.url);
    },
  },
};
</script>
