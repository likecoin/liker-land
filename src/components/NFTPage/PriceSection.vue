<template>
  <CardV2 :is-dark="true">
    <Label
      class="w-min font-600"
      :text="$t('nft_details_page_label_price')"
      tag="div"
      preset="h5"
      valign="middle"
      content-class="whitespace-nowrap text-like-cyan"
      prepend-class="text-like-cyan"
    >
      <template #prepend>
        <IconPrice />
      </template>
    </Label>
    <div class="flex items-baseline justify-start mt-[40px]">
      <Label
        class="font-[900] text-like-cyan"
        preset="h2"
      >{{ formattedNFTPrice }}</Label>
      <Label
        v-if="nftPriceUSD"
        class="ml-[4px]"
        preset="p5"
      >{{ nftPriceUSD }}</Label>
    </div>
    <div class="flex items-baseline justify-start">
      <Label
        class="text-[10px] font-[400]"
        :text="$t('nft_details_page_collected_count_label')"
      >
        <template #prepend>
          <IconMint />
        </template>
        <template #append>
          {{ collectedCount }}
        </template>
      </Label>
      <Label
        class="text-[10px] font-[400] ml-[24px] mt-[8px]"
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

    <div class="flex items-center justify-start mt-[24px]">
      <ProgressIndicator v-if="isLoading" />
      <div
        v-else
        class="rounded-[18px] p-[2px] bg-cover bg-[url('/images/gradient/like-gradient-lighter-blur.svg')]"
      >
        <div class="relative p-[6px] bg-like-green rounded-[16px]">
          <ButtonV2
            :text="$t('nft_details_page_button_collect_now')"
            preset="secondary"
            @click="handleClickCollect"
          >
            <template #prepend>
              <IconPrice />
            </template>
          </ButtonV2>
        </div>
      </div>
      <ToolTips :tool-tip-text="$t('tooltip_coming_soon')">
        <ButtonV2
          class="ml-[12px]"
          :text="$t('nft_details_page_button_sell')"
          preset="tertiary"
          :is-disabled="true"
          @mouseenter="handleMouseEnterSell"
          @click.native="handleClickSell"
        />
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
    collectedCount: {
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
      return `${this.nftPrice || '-'} LIKE`;
    },
  },
  methods: {
    handleClickCollect() {
      this.$emit('collect');
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
