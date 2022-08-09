<template>
  <CardV2 class="w-full mb-[16px]">
    <div :class="['flex', 'justify-between', 'items-center', 'mb-[20px]']">
      <Label
        class="w-min font-600 mb-[32px]"
        :text="$t('nft_details_page_label_price')"
        tag="div"
        preset="h5"
        valign="middle"
        content-class="whitespace-nowrap text-like-green"
        prepend-class="text-like-green"
      >
        <template #prepend>
          <IconPrice />
        </template>
      </Label>
    </div>
    <div class="flex items-baseline justify-start mb-[8px]">
      <Label preset="h2" class="font-[900] text-like-green">{{
        formattedNFTPrice
      }}</Label>
      <Label preset="p5" class="text-medium-gray ml-[4px]">{{
        nftPriceUSD
      }}</Label>
    </div>
    <div class="flex items-baseline justify-start mb-[28px]">
      <Label
        class="text-[10px] text-medium-gray font-[400]"
        :text="$t('nft_details_page_collected_count_label')"
      >
        <template #prepend>
          <IconMint />
        </template>
        <template #append>
          {{ mintedCount }}
        </template>
      </Label>
      <Label
        class="text-[10px] text-medium-gray font-[400] ml-[24px]"
        :text="$t('nft_details_page_title_collector')"
      >
        <template #prepend>
          <IconPersonMini />
        </template>
        <template #append>
          {{ collectorCount }}
        </template>
      </Label>
    </div>
    <div class="h-[2px] w-[32px] bg-shade-gray mb-[12px]" />

    <div class="flex items-center justify-start">
      <ProgressIndicator v-if="isLoading" />
      <ButtonV2
        v-else
        :text="$t('nft_details_page_button_collect_now')"
        preset="secondary"
        @click="handleClickCollect"
      >
        <template #prepend>
          <IconPrice />
        </template>
      </ButtonV2>
      <ToolTips :tool-tip-text="$t('tooltip_comming_soon')">
        <ButtonV2
          class="ml-[12px]"
          :text="$t('nft_details_page_button_sell')"
          preset="tertiary"
          :is-disabled="true"
        >
          <template #prepend>
            <IconPlaceholder />
          </template>
        </ButtonV2>
      </ToolTips>
    </div>
  </CardV2>
</template>
<script>
export default {
  name: 'PriceSection',
  props: {
    nftPrice: {
      type: Number,
      default: undefined,
    },
    nftPriceUSD: {
      type: String,
      default: undefined,
    },
    mintedCount: {
      type: Number,
      default: undefined,
    },
    collectorCount: {
      type: Number,
      default: undefined,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formattedNFTPrice() {
      return `${this.nftPrice} $LIKE`;
    },
  },
  methods: {
    handleClickCollect() {
      this.$emit('collect');
    },
  },
};
</script>
