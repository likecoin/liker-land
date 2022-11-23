<template>
  <div class="flex items-center">
    <div v-if="isCollector && view !== 'created'" class="flex gap-[12px]">
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
        :is-disabled="true"
        content-class="!text-[12px]"
        :text="$t('nft_details_page_button_sell')"
        @mouseenter.once="handleMouseEnterSell"
        @click.native="handleClickSell"
      />
    </div>
    <div v-else-if="isWritingNft && !isCollector" class="flex gap-[12px]">
      <Label class="!text-[12px] text-medium-gray" :text="$t('nft_details_page_button_collect_now')" />
      <ButtonV2 preset="secondary" @click="handleClickCollect">
        {{ price | formatNumberWithLIKE }}
        <template #prepend>
          <IconPrice />
        </template>
      </ButtonV2>
    </div>

    <template v-if="collectedCount">
      <MenuButtonDivider class="bg-medium-gray" />
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
import { formatNumberWithLIKE } from '~/util/ui';

export default {
  filters: {
    formatNumberWithLIKE,
  },
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
      type: Number,
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
    detailsPageRoute() {
      return {
        name: 'nft-class-classId-nftId',
        params: {
          classId: this.classId,
          nftId: this.collectedNftIds && this.collectedNftIds[0],
        },
      };
    },
  },
  methods: {
    handleClickUserCollectedCount() {
      this.$emit('click-user-collected-count');
    },
    handleClickCollect() {
      this.$emit('collect');
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
