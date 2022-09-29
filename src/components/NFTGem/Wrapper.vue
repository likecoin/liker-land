<template>
  <div class="relative w-full">
    <slot />
    <NFTGem class="translate-y-[-50%] w-[90%]" :level="gemLevel" />
  </div>
</template>

<script>
import { getBatch } from '~/util/writing-nft';

export default {
  props: {
    collectedCount: {
      type: Number,
      default: undefined,
    },
  },
  computed: {
    gemLevel() {
      const batch = getBatch(this.collectedCount);
      switch (true) {
        case batch >= 14 && batch <= 16:
          return 14;

        case batch >= 17:
          return 15;

        default:
          return batch;
      }
    },
  },
};
</script>
</script>
