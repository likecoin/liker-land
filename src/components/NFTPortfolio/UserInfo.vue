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
    <NFTPortfolioState 
      :collected-items="collectedItems"
      :created-class-ids="createdClassIds"
    >
      <template v-slot="stats">
        <Label preset="p6" class="font-200">Collections: {{ stats.collectedCount }}</Label>
        <Label preset="p6" class="font-200">Total Value: {{ stats.collectedAmount }}</Label>
        <Label preset="p6" class="font-200">Creations: {{ stats.createdCount }}</Label>
        <Label preset="p6" class="font-200">Minted: {{ stats.createdCollectedCount }}</Label>
      </template>
    </NFTPortfolioState>
  </CardV2>
</template>
<script>
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
    collectedItems: {
      type: Array,
      default: () => [],
    },
    createdClassIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
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
  },
};
</script>
