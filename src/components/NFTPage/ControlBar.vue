<template>
  <div class="flex items-center">
    <template v-if="isOwner && view !== 'created'">
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
        content-class="!text-[12px]"
        class="ml-[16px]"
        :text="$t('nft_details_page_button_sell')"
        @mouseenter.once="handleMouseEnterSell"
        @click.native="handleClickSell"
      />
    </template>
    <template v-else-if="!isOwner || view === 'created'">
      <Label class="!text-[12px] text-medium-gray" :text="$t('nft_details_page_button_collect_now')" />
      <ButtonV2 preset="secondary" class="ml-[16px]" @click="handleClickCollect">
        {{ price | formatNumberWithLIKE }}
        <template #prepend>
          <IconPrice />
        </template>
      </ButtonV2>
    </template>

    <template v-if="ownCount">
      <MenuButtonDivider class="bg-medium-gray" />
      <NuxtLink
        :to="{ name: 'nft-id', params: { id } }"
        @click.native="handleClickOwnNFTPage"
      >
        <Label align="middle" class="text-like-green !text-[12px]" :text="$t('nft_details_page_label_owning')">
          {{ `${$t('nft_details_page_label_owning')}&nbsp;${ownCount}` }}
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
    ownCount: {
      type: Number,
      default: undefined,
    },

    // User-owned NFT IDs
    ownNftIds: {
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
      type: String,
      default: undefined,
    },
  },
  computed: {
    isOwner() {
      return this.ownCount && this.ownNftIds.includes(this.currentNftId);
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
      this.$emit('openTransfer');
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
