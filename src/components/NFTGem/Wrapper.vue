<template>
  <div class="relative w-full">
    <slot />
    <NFTGem
      class="translate-y-[-50%] w-[90%]"
      :level="gemLevel"
      @mouseenter.native.once="onMouseEnterGem"
      @click.native="onMouseClickGem"
    />
  </div>
</template>

<script>
import { getBatch } from '~/util/writing-nft';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  props: {
    collectedCount: {
      type: Number,
      default: undefined,
    },
    isWritingNft: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    gemLevel() {
      if (!this.isWritingNft) {
        return 0;
      }

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
  methods: {
    onMouseClickGem() {
      logTrackerEvent(
        this,
        'NFTGem',
        'NFTGemClick',
        `NFTGemLevel${this.gemLevel}`,
        1
      );
    },
    onMouseEnterGem() {
      logTrackerEvent(
        this,
        'NFTGem',
        'NFTGemHover',
        `NFTGemLevel${this.gemLevel}`,
        1
      );
    },
  },
};
</script>
