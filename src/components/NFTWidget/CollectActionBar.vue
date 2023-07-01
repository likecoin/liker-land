<template>
  <div
    class="grid items-center justify-between grid-flow-col py-[8px] pl-[16px]"
  >
    <div class="flex text-[16px] leading-[1.25] text-like-green font-600">
      <LazyNFTWidgetIconInsertCoin class="mr-[6px]" />
      {{ price | formatNumberWithLIKE }}
    </div>
    <button
      class="
        py-[10px]
        px-[16px]
        rounded-[8px]
        flex
        bg-like-cyan-light
        hover:bg-like-cyan
        active:bg-like-cyan-dark
        transition-colors
        text-like-green
        font-600
        leading-[1.25]
      "
      @click="onClickCollectButton"
    >
      <LazyNFTWidgetIconInsertCoin class="mr-[12px]" />
      {{ collectButtonTitle }}
    </button>
  </div>
</template>

<script>
import { formatNumberWithLIKE } from '~/util/ui';

export default {
  filters: {
    formatNumberWithLIKE,
  },
  props: {
    collectButtonTitle: {
      type: String,
      default: 'Collect Now',
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    onClickCollectButton(e) {
      this.$emit('collect', e);
    },
  },
};
</script>
