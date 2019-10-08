<template>
  <div>
    <LcLoadingIndicator class="mx-auto" />
  </div>
</template>
<script>
import { IntercomMixinFactory } from '~/mixins/intercom';

const PAYMENT_LINK =
  'https://help.like.co/en/articles/3381375-%E5%A6%82%E4%BD%95%E4%BB%A5-payme-%E6%88%96-%E8%BD%89%E6%95%B8%E5%BF%AB%E7%B9%B3%E4%BB%98-%E8%AE%9A%E8%B3%9E%E5%85%AC%E6%B0%91-%E5%B9%B4%E8%B2%BB';

export default {
  middleware: 'authenticated',
  layout: 'dialog',
  mixins: [IntercomMixinFactory({ isBootAtMounted: false })],
  asyncData({ store, redirect, query }) {
    if (
      store.getters.getUserIsCivicLiker &&
      !store.getters.getUserInfo.isCivicLikerRenewalPeriod
    ) {
      redirect({ name: 'settings-civic' });
    }
  },
  async mounted() {
    await this.bootIntercom();
    window.location.href = PAYMENT_LINK;
  },
};
</script>
