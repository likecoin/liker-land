<template>
  <div v-if="shouldShowControlBar" class="flex items-center justify-end w-full gap-[12px]">
    <template v-if="isCollectorButNotCreator">
      <ButtonV2
        v-if="currentNftId"
        size="mini"
        preset="tertiary"
        content-class="!text-[12px]"
        :text="$t('nft_details_page_activity_list_event_transfer')"
        @click="handleClickTransfer"
      />
      <ButtonV2
        size="mini"
        preset="tertiary"
        content-class="!text-[12px]"
        :text="$t('nft_details_page_button_sell')"
        :href="marketPlaceSellUrl"
        target="_blank"
        rel="noopener"
        @mouseenter.once="handleMouseEnterSell"
        @click.native="handleClickSell"
      />
    </template>
    <template v-else-if="isPotentialCollector">
      <Label
        class="!text-[12px] text-medium-gray"
        :text="collectButtonText"
      />
      <ButtonV2
        :preset="isCollectible ? 'secondary': 'tertiary'"
        @click="handleClickCollect"
      >
        {{ price }}
        <template #prepend>
          <IconPrice />
        </template>
      </ButtonV2>
    </template>

    <template v-if="collectedCount">
      <MenuButtonDivider class="bg-medium-gray !mx-[4px]" />
      <NuxtLink
        :to="detailsPageRoute"
        @click.native="handleClickUserCollectedCount"
      >
        <Label
          class="text-like-green !text-[12px] font-[600]"
          align="middle"
          :text="$t('nft_details_page_label_owning')"
        >
          {{ `${$t('nft_details_page_label_owning')} ${collectedCount}` }}
        </Label>
      </NuxtLink>
    </template>
  </div>
</template>

<script>
import { LIKECOIN_NFT_MARKETPLACE_BASE } from '~/constant';

export default {
  props: {
    // User collected count
    collectedCount: {
      type: Number,
      default: undefined,
    },

    // User-owned NFT IDs
    collectedNftIds: {
      type: Array,
      default: undefined,
    },

    currentNftId: {
      type: String,
      default: undefined,
    },

    nextNftId: {
      type: String,
      default: undefined,
    },

    classId: {
      type: String,
      default: undefined,
    },

    // Two views of NFT page. collected & created
    view: {
      type: String,
      default: 'collected',
    },

    price: {
      type: String,
      default: undefined,
    },

    isWritingNft: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isCollector() {
      // For Class page
      if (!this.currentNftId) {
        return !!this.collectedCount;
      }
      // For NFT Details page
      return (
        this.collectedCount && this.collectedNftIds.includes(this.currentNftId)
      );
    },
    isCollectorButNotCreator() {
      return this.isCollector && this.view !== 'created';
    },
    isPotentialCollector() {
      return !!this.price && !this.isCollector;
    },
    shouldShowControlBar() {
      return (
        !!this.collectedCount ||
        this.isCollectorButNotCreator ||
        this.isPotentialCollector
      );
    },
    detailsPageRoute() {
      return this.localeLocation({
        name: 'nft-class-classId-nftId',
        params: {
          classId: this.classId,
          nftId: this.collectedNftIds && this.collectedNftIds[0],
        },
      });
    },
    marketPlaceSellUrl() {
      if (this.currentNftId) {
        return `${LIKECOIN_NFT_MARKETPLACE_BASE}/sell/${this.classId}/${
          this.currentNftId
        }`;
      }
      return `${LIKECOIN_NFT_MARKETPLACE_BASE}/owned`;
    },
    isCollectible() {
      return this.isWritingNft || this.currentNftId === this.nextNftId;
    },
    collectButtonText() {
      return this.isCollectible
        ? this.$t('nft_details_page_button_collect_now')
        : this.$t('nft_details_page_button_collect_class_now');
    },
  },
  methods: {
    handleClickUserCollectedCount() {
      this.$emit('click-user-collected-count');
    },
    handleClickCollect() {
      this.isCollectible ? this.$emit('collect') : this.$emit('go-to-collect');
    },
    handleClickTransfer() {
      this.$emit('transfer');
    },
    handleClickSell() {
      this.$emit('click-sell');
    },
    handleMouseEnterSell() {
      this.$emit('hover-sell');
    },
  },
};
</script>
