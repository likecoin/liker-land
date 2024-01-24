<template>
  <NFTGemWrapper :is-nft-book="true" :class-id="classId">
    <template #default="gem">
      <NFTPortfolioCard :gem-level="gem.level" :hover-class="gem.hoverClass">
        <div class="relative flex items-center justify-center py-[16px]">
          <div class="absolute inset-0 w-full h-full">
            <img
              :src="resizedSrc"
              :alt="alt"
              class="h-auto max-w-full blur-sm"
            />
          </div>
          <div
            class="absolute inset-0 w-full h-full"
            :style="{
              backgroundColor: themeColor || 'none',
              opacity: 0.3,
            }"
          />
          <div class="relative flex items-center justify-center w-full h-full">
            <NFTCover
              :class="{ 'opacity-0 pointer-events-none': hasDynamicCovers }"
              :src="src"
              :size="450"
              :is-nft-book="true"
              :alt="alt"
              :spine-color1="spineColor1"
              :spine-color2="spineColor2"
            />
            <ClientOnly v-if="hasDynamicCovers">
              <div class="absolute inset-0">
                <Swiper
                  class="w-full h-full"
                  :options="{
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    autoplay: {
                      delay: 1500,
                      disableOnInteraction: false,
                    },
                    effect: 'coverflow',
                    coverflowEffect: {
                      rotate: 30,
                      stretch: 30,
                      depth: 20,
                      modifier: 2,
                      slideShadows: true,
                    },
                  }"
                >
                  <SwiperSlide
                    v-for="coverSrc in dynamicCovers"
                    :key="coverSrc"
                    class="bg-[red]"
                    style="width: 220px"
                  >
                    <NFTCover
                      :src="coverSrc"
                      :size="450"
                      :is-nft-book="true"
                      :alt="alt"
                      :spine-color1="spineColor1"
                      :spine-color2="spineColor2"
                      :should-resize-src="false"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            </ClientOnly>
          </div>
        </div>
        <div
          :class="[
            'flex',
            'flex-col',
            'gap-[12px]',

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
          <Markdown :md-string="nftDescription" />
          <div class="flex items-center justify-center">
            <ButtonV2
              preset="secondary"
              :text="priceLabel"
              :is-disabled="!stock"
              @click="$emit('click-collect', nftValue)"
            >
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
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

import { getImageResizeAPI } from '~/util/api';

export default {
  name: 'NFTBookEditionCompareTableColumn',
  components: {
    Swiper,
    SwiperSlide,
  },
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
    dynamicCovers() {
      return this.editionConfig?.dynamicCovers || [];
    },
    stock() {
      return this.editionConfig?.stock || 0;
    },
    hasDynamicCovers() {
      return this.dynamicCovers.length > 0;
    },
  },
};
</script>
