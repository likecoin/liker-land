<template>
  <div class="relative">
    <ButtonV2
      :preset="isPlain ? 'plain' : 'tertiary'"
      :to="localeLocation({ name: 'shopping-cart-book' })"
      @click="handleClickCartButton"
    >
      <LocalMallIcon
        :class="['w-20 h-20', '!text-like-green', { '!text-white': isPlain }]"
      />
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
        { 'bg-like-cyan': isPlain },
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
      <span
        :class="[
          'text-like-cyan',
          { '!text-like-green': isPlain },
          'text-[10px] leading-[1em]',
        ]"
      >
        {{ shoppingCartBookProductList.length }}
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
  props: {
    isPlain: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['getAddress', 'shoppingCartBookProductList']),
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
