<template>
  <div class="relative">
    <ButtonV2
      :preset="isPlain ? 'plain' : 'tertiary'"
      :to="localeLocation({ name: 'shopping-cart-book' })"
      @click="handleClickCartButton"
    >
      <LocalMallIcon
        :class="['w-20 h-20', isPlain ? 'text-white' : 'text-dark-gray']"
      />
    </ButtonV2>
    <div
      v-if="shoppingCartBookProductList.length"
      :class="[
        'absolute',
        'bottom-full',
        'left-full',
        'flex',
        'justify-center',
        'items-center',
        isPlain ? 'bg-like-cyan' : 'bg-like-green',
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
          isPlain ? 'text-like-green' : 'text-like-cyan',
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
