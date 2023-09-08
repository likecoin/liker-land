<template>
  <div class="relative">
    <client-only>
      <lazy-component
        class="absolute inset-0 pointer-events-none -top-full"
        @show.once="fetchInfo"
      />
    </client-only>
    <NFTPageCollectCTA
      :class-id="classId"
      :nft-image-url="NFTImageUrl"
      :iscn-owner="iscnOwner"
      :is-collectable="nftIsCollectable"
      button-theme="glow"
      :is-free="true"
      :collect-expiry-time="collectExpiryTime"
      @click-cta-button="handleClickCollect"
    >
      <slot />
    </NFTPageCollectCTA>
  </div>
</template>

<script>
import nftMixin from '~/mixins/nft';
import { catchAxiosError } from '~/util/misc';

export default {
  mixins: [nftMixin],
  props: {
    classId: {
      type: String,
      required: true,
    },
  },
  methods: {
    fetchInfo() {
      catchAxiosError(this.lazyGetNFTClassMetadata(this.classId));
      catchAxiosError(this.lazyGetNFTPurchaseAndListingInfo(this.classId));
    },
    handleClickCollect() {
      this.$emit('collect');
      this.$emit('click-collect-button');
    },
  },
};
</script>
