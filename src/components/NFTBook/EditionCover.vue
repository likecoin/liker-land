<template>
  <NFTGemWrapper :is-nft-book="true" :class-id="classId">
    <template v-slot="gem">
      <NFTPortfolioCard
        :gem-level="gem.level"
        :hover-class="gem.hoverClass"
      >
        <div class="relative flex items-center justify-center py-[16px]">
          <div class="absolute inset-0 w-full h-full">
            <img :src="src" :alt="alt" class="h-auto max-w-full blur-sm">
          </div>
          <div
            class="absolute inset-0 w-full h-full"
            :style="{
              backgroundColor: getThemeColor || 'none',
              opacity: 0.3
            }"
          />
          <div class="relative">
            <NFTCover
              :src="src"
              :size="450"
              :is-nft-book="true"
              :alt="alt"
              :spine-color1="getSpineColor1"
              :spine-color2="getSpineColor2"
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
          <Label align="center" :text="getNftName" class="text-like-green" />
          <div class="my-[24px] text-center text-[14px] text-dark-gray">{{ getNftDescription }}</div>
          <div class="flex items-center justify-center">
            <ButtonV2 preset="secondary" :text="getPriceLabel" @click="$emit('click-collect',getNftValue)">
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
export default {
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
    getThemeColor() {
      return this.editionConfig?.style?.themeColor;
    },
    getSpineColor1() {
      return this.editionConfig?.style?.spineColor1;
    },
    getSpineColor2() {
      return this.editionConfig?.style?.spineColor2;
    },
    getNftName() {
      return this.editionConfig?.name;
    },
    getNftDescription() {
      return this.editionConfig?.description;
    },
    getNftValue() {
      return this.editionConfig?.value;
    },
    getPriceLabel() {
      return this.editionConfig?.priceLabel;
    },
  },
};
</script>
