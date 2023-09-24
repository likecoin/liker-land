<template>
  <div :class="rootClasses">

    <div
      v-if="isMidAutumnStyle"
      :class="[
        'flex',
        'flex-row',
        'flex-wrap',
        'justify-center',
        'items-center laptop:items-start',
        'gap-[20px] laptop:gap-[40px]',
      ]"
    >
      <div class="laptop:order-3 mx-[100%] laptop:mx-0 mb-[60px] ">
        <NFTMidAutumnMoonGraphic class="mt-[-61%]" />
      </div>
      <MidAutumnSloganText class="hidden" />
      <svg
        v-for="index in 4"
        :key="`text-${index}`"
        class="mt-[-48px]"
        width="26"
        height="38"
        :style="`order: ${index >= 3 ? index + 1 : index};`"
      >
        <use :xlink:href="`#mid-autumn-slogan-text-${index}`" fill="#184158" />
      </svg>
    </div>
    <div
      v-else
      :class="[
        'flex',
        'flex-col laptop:flex-row',
        'items-center laptop:items-start',
        'justify-center',
        'gap-[1rem]',
        shouldShowFreeStyle ? 'mt-[-72px]' : 'mt-[-58px]',
        'text-like-green',
        'text-[2rem]',
        'font-proxima',
        'laptop:tracking-[0.75rem]',
      ]"
    >
      <div
        v-if="shouldShowFreeStyle"
        class="hidden laptop:block flex-1 mt-[1rem] text-right font-[600]"
      >{{ $t('collect_cta_slogan_left') }}</div>
      <NFTFreeFallGraphic
        :class="shouldShowFreeStyle ? 'w-[178px]' : 'w-[148px]'"
        :href="nftImageUrl"
        :preset="shouldShowFreeStyle ? 'gradient' : 'plain'"
      />
      <div
        v-if="shouldShowFreeStyle"
        class="hidden laptop:block flex-1 mt-[1rem] text-left font-[600]"
      >{{ $t('collect_cta_slogan_right') }}</div>
      <div
        v-if="shouldShowFreeStyle"
        class="laptop:hidden text-[1.5rem] text-center"
      >{{ $t('collect_cta_slogan_mobile') }}</div>
    </div>

    <slot />

    <div
      v-if="ctaForFreeDescriptionHeading && ctaForFreeDescriptionContent"
      class="mt-[2rem] laptop:px-[40px]"
    >
      <Label
        class="text-like-green"
        :text="ctaForFreeDescriptionHeading"
        :align="isMidAutumnStyle ? 'center' : 'left'"
      />
      <Label
        class="mt-[0.75rem] leading-[1.5] font-[300]"
        :text="ctaForFreeDescriptionContent"
        :align="isMidAutumnStyle ? 'center' : 'left'"
      />
      <CollectButton
        class="mt-[2.5rem]"
        :button-text="ctaButtonText"
        :is-collectable="isCollectable"
        :collect-expiry-time="collectExpiryTime"
        :theme="normalizedButtonTheme"
        :should-show-expiry-time-before-expired="true"
        @click-collect-button="handleClickCTAButton"
      />
    </div>

    <template v-else>
      <div class="mt-[30px] order-2 sm:order-1 sm:mt-[60px]">
        <Label
          :class="ctaTitleClasses"
          preset="h3"
          align="center"
          :text="ctaTitle"
        />
      </div>
      <!-- Creator's Message -->
      <div
        v-if="creatorMessage"
        :class="creatorMessageClasses"
      >
        <div class="flex flex-col gap-[24px] items-center sm:flex-row sm:mr-[24px]">
          <NFTMessageIdentity
            type="creator"
            class="flex-shrink-0"
            :wallet-address="iscnOwner"
            :avatar-size="40"
          />
          <div class="flex-col  justify-start mt-[8px]">
            <div
              :class="[
                'text-[14px]',
                'text-center sm:text-left',
                shouldShowFreeStyle || isMidAutumnStyle ? 'text-like-green' : 'text-like-cyan',
              ]"
            >{{ $t('nft_message_type_collect') }}</div>
            <div
              :class="[
                'mt-[4px]',
                { 'text-white': !shouldShowFreeStyle && !isMidAutumnStyle },
                'text-[16px]',
                'text-center sm:text-left',
                'font-600',
              ]"
            >{{ creatorMessage }}</div>
          </div>
        </div>
        <CollectButton
          :button-text="ctaButtonText"
          :is-collectable="isCollectable"
          :collect-expiry-time="collectExpiryTime"
          :theme="normalizedButtonTheme"
          :should-show-expiry-time-before-expired="true"
          @click-collect-button="handleClickCTAButton"
        />
      </div>
      <div v-else class="flex flex-col gap-[16px] justify-center items-center mt-[60px] order-1 sm:order-2 sm:mt-[32px] sm:flex-row">
        <NFTMessageIdentity
          v-if="!shouldShowFreeStyle"
          type="creator"
          class="flex-shrink-0"
          :wallet-address="iscnOwner"
          :avatar-size="40"
        />
        <CollectButton
          :button-text="ctaButtonText"
          :is-collectable="isCollectable"
          :collect-expiry-time="collectExpiryTime"
          :theme="normalizedButtonTheme"
          :should-show-expiry-time-before-expired="true"
          @click-collect-button="handleClickCTAButton"
        />
      </div>
    </template>
  </div>
</template>

<script>
import MidAutumnSloganText from '~/assets/images/mid-autumn/slogan-text.svg?inline';

export default {
  components: {
    MidAutumnSloganText,
  },
  props: {
    classId: {
      type: String,
      default: undefined,
    },
    nftImageUrl: {
      type: String,
      default: undefined,
    },
    creatorMessage: {
      type: String,
      default: undefined,
    },
    iscnOwner: {
      type: String,
      default: undefined,
    },
    isCollectable: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    isColumn: {
      type: Boolean,
      default: false,
    },
    collectExpiryTime: {
      type: Number,
      default: 0,
    },
    buttonTheme: {
      type: String,
      default: 'classic',
    },
    isMidAutumnStyle: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    rootClasses() {
      return [
        'relative',
        'flex',
        'flex-col',
        'w-full',
        'p-[32px]',
        'pt-0',
        this.shouldShowFreeStyle ? 'mt-[72px]' : 'mt-[58px]',
        this.isFree || this.isMidAutumnStyle
          ? 'border border-black'
          : 'bg-like-green',
        'rounded-[32px]',
      ];
    },
    creatorMessageClasses() {
      const classes = [
        'flex',
        'flex-col',
        'gap-[24px]',
        'items-center',
        'justify-center',
        'rounded-[24px]',
        'px-[24px]',
        'py-[32px]',
        'mt-[24px]',
        'order-1',
        'sm:order-2',
        'sm:p-[32px]',
        'sm:mt-[32px]',
        { 'desktop:flex-row desktop:justify-between': !this.isColumn },
      ];

      if (this.isFree || this.isMidAutumnStyle) {
        classes.push('border', 'border-black');
      } else {
        classes.push('border-2', 'border-like-cyan');
      }

      return classes;
    },
    ctaTitle() {
      if (this.isCollectable) {
        return this.$t('nft_page_collect_cta_title');
      }
      return this.$t('nft_page_collect_cta_title_sold_out');
    },
    ctaTitleClasses() {
      if (this.isFree || this.isMidAutumnStyle) {
        return ['text-black'];
      }
      return [
        'text-transparent',
        'bg-gradient-to-r',
        'from-[#d2f0f0]',
        'to-[#f0e6b4]',
        'bg-clip-text',
      ];
    },

    ctaForFreeDescriptionHeading() {
      if (!(this.isFree || this.isMidAutumnStyle)) return '';

      const key = `nft_page_collect_cta_free_description_heading_${
        this.classId
      }`;
      return this.$te(key) ? this.$t(key) : '';
    },
    ctaForFreeDescriptionContent() {
      if (!(this.isFree || this.isMidAutumnStyle)) return '';

      const key = `nft_page_collect_cta_free_description_content_${
        this.classId
      }`;
      return this.$te(key) ? this.$t(key) : '';
    },
    shouldShowFreeStyle() {
      return (
        this.isFree &&
        this.ctaForFreeDescriptionHeading &&
        this.ctaForFreeDescriptionContent
      );
    },
    ctaButtonText() {
      if (!this.isCollectable) {
        return this.$t('nft_page_collect_cta_button_text_ended');
      }
      if (this.isFree || this.isMidAutumnStyle) {
        return this.$t('nft_page_collect_cta_button_text_free');
      }
      return this.$t('nft_page_collect_cta_button_text');
    },
    normalizedButtonTheme() {
      return this.isMidAutumnStyle ? 'glow' : this.buttonTheme;
    },
  },
  methods: {
    handleClickCTAButton() {
      this.$emit('click-cta-button');
    },
  },
};
</script>
