<template>
  <div class="flex items-center">
    <div v-if="isCollector && view !== 'created'" class="flex gap-[12px]">
      <ButtonV2
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
    <div v-else-if="!isCollector || view === 'created'" class="flex gap-[12px]">
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
        :to="{ name: 'nft-id', params: { id } }"
        @click.native="handleClickOwnNFTPage"
      >
        <Label align="middle" class="text-like-green !text-[12px]" :text="$t('nft_details_page_label_owning')">
          {{ `${$t('nft_details_page_label_owning')} ${collectedCount}` }}
        </Label>
      </NuxtLink>
    </template>
  </div>
</template>

<script>
import { formatNumberWithLIKE } from '~/util/ui';
import { logTrackerEvent } from '~/util/EventLogger';

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

    // Two views of NFT page. collected & created
    view: {
      type: String,
      default: 'collected',
    },

    price: {
      type: Number,
      default: undefined,
    },
  },
  computed: {
    isCollector() {
      return (
        this.collectedCount && this.collectedNftIds.includes(this.currentNftId)
      );
    },
  },
  methods: {
    handleClickOwnNFTPage() {
      logTrackerEvent(this, 'NFT', 'OwnNFTPage', this.currentNftId, 1);
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
