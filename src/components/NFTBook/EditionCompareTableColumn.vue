<template>
  <NFTGemWrapper :is-nft-book="true" :class-id="classId">
    <template #default="gem">
      <NFTPortfolioCard
        :gem-level="gem.level"
        :hover-class="gem.hoverClass"
      >
        <div class="relative flex items-center justify-center py-[16px]">
          <div class="absolute inset-0 w-full h-full">
            <img :src="resizedSrc" :alt="alt" class="h-auto max-w-full blur-sm">
          </div>
          <div
            class="absolute inset-0 w-full h-full"
            :style="{
              backgroundColor: themeColor || 'none',
              opacity: 0.3
            }"
          />
          <div class="relative">
            <NFTCover
              :src="src"
              :size="450"
              :is-nft-book="true"
              :alt="alt"
              :spine-color1="spineColor1"
              :spine-color2="spineColor2"
            />
          </div>
        </div>
        <div
          :class="[
            'flex',
            'flex-col',
            'text-center',
            'whitespace-pre-line',
            'px-[24px]',
            'pt-[16px]',
            'pb-[24px]',
            'bg-white',
            'relative',
          ]"
        >
          <Label align="center" :text="nftName" class="text-like-green" />
          <div class="my-[24px] text-center text-[14px] text-dark-gray">{{ nftDescription }}</div>
          <div class="flex items-center justify-center">
            <ButtonV2 preset="secondary" :text="priceLabel" @click="$emit('click-collect', nftValue)">
              <template #prepend>
                <NFTWidgetIconInsertCoin class="w-[16px]" />
              </template>
            </ButtonV2>
          </div>
        </div>
      </NFTPortfolioCard>
    </template>
  </NFTGemWrapper>
</template>
<script>
import { getImageResizeAPI } from '~/util/api';

export default {
  name: 'NFTBookEditionCompareTableColumn',
  props: {
    src: {
      type: String,
      default: '',
    },
    classId: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 720,
    },
    alt: {
      type: String,
      default: '',
    },
    editionConfig: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    resizedSrc() {
      return getImageResizeAPI(this.src, { width: 450 });
    },
    themeColor() {
      return this.editionConfig?.style?.themeColor;
    },
    spineColor1() {
      return this.editionConfig?.style?.spineColor1;
    },
    spineColor2() {
      return this.editionConfig?.style?.spineColor2;
    },
    nftName() {
      return this.editionConfig?.name;
    },
    nftDescription() {
      return this.editionConfig?.description;
    },
    nftValue() {
      return this.editionConfig?.value;
    },
    priceLabel() {
      return this.editionConfig?.priceLabel;
    },
  },
};
</script>
