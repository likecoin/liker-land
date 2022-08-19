<template>
  <CardV2 :class="['flex', 'flex-col', 'items-center', 'w-full']">
    <Identity :avatar-url="avatarUrl" :avatar-size="88" :is-avatar-outlined="isCivicLiker" />
    <Label preset="h3" :class="['text-like-green', 'mt-[18px]']">
      {{ likerId | ellipsis }}
    </Label>
    <div v-if="likerDescription" :class="['w-full', 'h-[1px]', 'bg-shade-gray', 'my-[16px]']" />
    <Label preset="p6" class="break-all font-200">
      {{ likerDescription }}
    </Label>
    <div :class="['w-full', 'h-[1px]', 'bg-shade-gray', 'my-[16px]']" />
    <Label preset="p6" class="font-200">Collections: {{ collectedNFTs.length }}</Label>
    <Label preset="p6" class="font-200">TotalValue: {{ collectedNFTTotalValue }}</Label>
    <Label preset="p6" class="font-200">Creations: {{ createdNFTClassIds.length }}</Label>
    <Label preset="p6" class="font-200">Minted: {{ createdNFTMintedCount }}</Label>
  </CardV2>
</template>
<script>
import { mapGetters } from 'vuex';

import { ellipsis } from '~/util/ui';

export default {
  filters: {
    ellipsis,
  },
  props: {
    userInfo: {
      type: Object,
      default: null,
    },
    wallet: {
      type: String,
      default: null,
    },
    collectedNFTs: {
      type: Array,
      default: () => [],
    },
    createdNFTClassIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters(['getNFTClassPurchaseInfoById', 'getNFTClassMintedCount']),
    avatarUrl() {
      return (
        this.userInfo?.avatar ||
        `https://avatars.dicebear.com/api/identicon/${this.wallet}.svg`
      );
    },
    isCivicLiker() {
      return !!(
        this.userInfo?.isCivicLikerTrial ||
        this.userInfo?.isSubscribedCivicLiker
      );
    },
    likerId() {
      return this.userInfo?.displayName || this.wallet;
    },
    likerDescription() {
      return this.userInfo?.description;
    },
    collectedNFTTotalValue() {
      return this.collectedNFTs.reduce(
        (total, nft) =>
          total + (this.getNFTClassPurchaseInfoById(nft.classId)?.price || 0),
        0
      );
    },
    createdNFTMintedCount() {
      return this.createdNFTClassIds.reduce(
        (total, classId) => total + (this.getNFTClassMintedCount(classId) || 0),
        0
      );
    },
  },
};
</script>
