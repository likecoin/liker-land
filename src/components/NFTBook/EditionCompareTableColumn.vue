<template>
  <NFTPortfolioCard
    :class="{ 'border-like-collection border-[2px]': collectionId }"
  >
    <div
      :class="[
        'relative',

        'flex',
        'items-center',
        'justify-center',

        'w-full',
        'h-full',

        'rounded-t-[inherit]',

        'overflow-hidden',
      ]"
    >
      <template v-if="hasDynamicCovers">
        <div class="absolute inset-0 w-full h-full">
          <img :src="resizedSrc" :alt="alt" class="h-auto max-w-full blur-sm" />
        </div>
        <div
          class="absolute inset-0 w-full h-full"
          :style="{
            backgroundColor: themeColor || 'none',
            opacity: 0.3,
          }"
        />
      </template>
      <NFTBookCoverWithFrame
        :class="[
          'w-full',
          'rounded-t-[inherit] rounded-b-[0]',
          { 'opacity-0 pointer-events-none': hasDynamicCovers },
        ]"
        :src="src"
        :alt="alt"
        :cover-resize="450"
        class-aspect-ratio="aspect-[1]"
        :background-color="themeColor"
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
              style="width: 200px"
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
        'rounded-b-[inherit]',
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
    collectionId: {
      type: String,
      default: '',
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
