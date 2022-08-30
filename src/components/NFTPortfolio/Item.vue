<template>
  <NuxtLink
    v-if="isWritingNFT"
    class="mx-auto mb-[5px] break-inside-avoid"
    :to="{ name: 'nft-class-classId', params: { classId } }"
    target="_blank"
    @click="handleClickViewDetails"
  >
    <NFTPortfolioBase preset="collectible" :class-id="classId" />
  </NuxtLink>
</template>

<script>
import nftMixin from '~/mixins/nft';

import { logTrackerEvent } from '~/util/EventLogger';

export default {
  mixins: [nftMixin],
  props: {
    classId: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.updateNFTClassMetadata();
  },
  methods: {
    handleClickViewDetails() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTViewDetails(Portfolio)',
        this.classId,
        1
      );
    },
  },
};
</script>
