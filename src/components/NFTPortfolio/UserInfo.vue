<template>
  <CardV2 :class="['flex', 'flex-col', 'items-center', 'w-full']">
    <Identity :avatar-url="avatarUrl" :avatar-size="88" :is-avatar-outlined="isCivicLiker" />
    <Label preset="h3" :class="['text-like-green', 'mt-[18px]']">
      {{ likerId | ellipsis }}
    </Label>
    <div v-if="likerDescription" :class="['w-full', 'h-[1px]', 'bg-shade-gray', 'my-[16px]']" />
    <Label preset="p6" class="break-all font-200 my-[28px]">
      {{ likerDescription }}
    </Label>
    <div class="flex justify-between w-[44px] mx-auto mb-[16px] text-shade-gray">
      <IconEllipse />
      <IconEllipse />
      <IconEllipse />
    </div>
    <NFTPortfolioState
      :collected-items="collectedItems"
      :created-class-ids="createdClassIds"
      class="grid grid-cols-2 cursor-default gap-x-8 gap-y-4 text-medium-gray"
    >
      <template v-slot="stats">
        <ToolTips :tool-tip-text="$t('nft_portfolio_page_state_collections')">
          <Label preset="p6" class="font-200" :text="stats.collectedCount">
            <template #prepend>
              <IconMint />
            </template>
          </Label>
        </ToolTips>
        <ToolTips :tool-tip-text="$t('nft_portfolio_page_state_value')">
          <Label preset="p6" class="font-200" :text="stats.collectedAmount">
            <template #prepend>
              <IconPriceMini />
            </template>
          </Label>
        </ToolTips>
        <ToolTips :tool-tip-text="$t('nft_portfolio_page_state_creations')">
          <Label preset="p6" class="font-200" :text="stats.createdCount">
            <template #prepend>
              <IconFlare />
            </template>
          </Label>
        </ToolTips>
        <ToolTips :tool-tip-text="$t('nft_portfolio_page_state_collectors')">
          <Label preset="p6" class="font-200" :text="stats.createdCollectedCount">
            <template #prepend>
              <IconPersonMini />
            </template>
          </Label>
        </ToolTips>
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
