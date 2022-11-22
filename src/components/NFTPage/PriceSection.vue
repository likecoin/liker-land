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
      >
        <template v-if="isCollectable">{{ nftPrice | formatNumberWithLIKE({ isFull: true }) }}</template>
        <template v-else>{{ $t('nft_class_uncollectible') }}</template>
      </Label>
      <Label
        v-if="isCollectable && nftPriceUSD"
        class="ml-[4px]"
        preset="p5"
      >{{ `(${nftPriceUSD})` }}</Label>
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

    <div class="flex items-center justify-start mt-[24px] gap-[16px]">
      <ProgressIndicator v-if="isLoading" />
      <div
        v-else-if="isCollectable"
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
      <ButtonV2
        preset="primary"
        :text="$t('campaign_nft_item_view_details_label')"
        class="hidden laptop:block !border-[2px] !border-like-cyan-light"
        :href="url"
        target="_blank"
        @click="handleClickViewContent"
      >
        <template #prepend>
          <IconArticle />
        </template>
        <template #append>
          <IconLinkExternal />
        </template>
      </ButtonV2>
    </div>
  </CardV2>
</template>
<script>
import { formatNumberWithLIKE } from '~/util/ui';

export default {
  name: 'PriceSection',
  filters: {
    formatNumberWithLIKE,
  },
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
    url: {
      type: String,
      default: undefined,
    },
    isCollectable: {
      type: Boolean,
      default: false,
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
    handleClickViewContent() {
      this.$emit('view-content');
    },
  },
};
</script>
