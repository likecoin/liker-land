<template>
  <div
    v-show="shoppingCartNFTClassList.length > 0"
    class="relative"
  >
    <ButtonV2
      preset="tertiary"
      :to="localeLocation({ name: 'shopping-cart' })"
      @click="handleClickCartButton"
    >
      <LocalMallIcon class="w-20 h-20 text-like-green" />
    </ButtonV2>
    <div
      :class="[
        'absolute',
        'bottom-full',
        'left-full',
        'flex',
        'justify-center',
        'items-center',
        'bg-like-green',
        'rounded-full',
        'min-w-[20px]',
        'min-h-[20px]',
        'ml-[-10px]',
        'mb-[-10px]',
        'px-[4px]',
        'py-[5px]',
        'pointer-events-none',
      ]"
    >
      <span class="text-like-cyan text-[10px] leading-[1em]">
        {{ shoppingCartNFTClassList.length }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { logTrackerEvent } from '~/util/EventLogger';

import LocalMallIcon from '~/assets/icons/local-mall.svg?inline';

export default {
  name: 'ShoppingCartSiteButton',
  components: {
    LocalMallIcon,
  },
  computed: {
    ...mapGetters(['getAddress', 'shoppingCartNFTClassList']),
  },
  methods: {
    handleClickCartButton() {
      logTrackerEvent(
        this,
        'NFT',
        'shopping_cart_click_site_button',
        this.getAddress,
        1
      );
    },
  },
};
</script>
