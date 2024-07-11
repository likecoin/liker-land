<template>
  <main
    :class="[
      'w-full',
      'laptop:max-w-[656px]',

      'px-[24px]',
      'laptop:px-[12px]',
      'mt-[72px]',
      'laptop:mt-0',

      'flex',
      'flex-col',
      'justify-start',
      'items-center',

      'gap-[24px]',
      'laptop:gap-[32px]',
      'whitespace-pre-line',
      'z-0',
    ]"
  >
    <div class="flex items-center justify-start w-full">
      <Stepper v-if="step" :step="step" :total-step="totalStep" />
      <slot name="stepper-append" />
    </div>

    <section
      class="flex flex-col items-start justify-start gap-[8px] w-full text-like-green"
    >
      <slot name="header-prepend" />
      <Label
        class="text-[28px] font-600 desktop:text-[40px]"
        :text="headerText"
      />
      <slot name="header-append" />
    </section>

    <section
      class="flex flex-col justify-start items-start gap-[24px] laptop:gap-[32px] text-dark-gray text-left font-400 text-[16px] laptop:text-[18px] w-full"
    >
      <p>{{ contentText }}</p>
      <slot name="content-append" />
    </section>

    <section
      :class="[
        'fixed',
        'bottom-0',
        'left-0',

        'flex',
        'flex-col',
        'items-center',
        'gap-[8px]',
        'w-full',
        'px-[16px]',
        'py-[16px]',

        'laptop:hidden',
      ]"
    >
      <slot name="footer" />
      <div v-if="shouldDisplayDownloadOptions" class="w-full">
        <div
          v-for="{
            canViewNFTBookBeforeClaim,
            url,
            id,
            contentUrls,
            iscnUrl,
            isNftBook,
            isContentViewable,
            isDownloadable,
          } in formatDownloadLinks"
          :key="id"
          class="w-full"
        >
          <NFTClaimOptionList
            v-if="canViewNFTBookBeforeClaim"
            class="w-full"
            :url="url"
            :class-id="id"
            :content-urls="contentUrls"
            :iscn-url="iscnUrl"
            :is-nft-book="isNftBook"
            :is-content-viewable="isContentViewable"
            :is-content-downloadable="isDownloadable"
            @view-content-url="handleClickViewContentDirectly"
          />
        </div>
      </div>
    </section>
    <section
      :class="[
        'hidden',
        'laptop:flex',

        'justify-start',
        'items-start',
        'gap-[24px]',
        'w-full',
        'mt-[24px]',
      ]"
    >
      <slot name="footer" />
      <div v-if="shouldDisplayDownloadOptions">
        <div
          v-for="{
            canViewNFTBookBeforeClaim,
            url,
            id,
            contentUrls,
            iscnUrl,
            isNftBook,
            isContentViewable,
            isDownloadable,
          } in formatDownloadLinks"
          :key="id"
        >
          <NFTClaimOptionList
            v-if="canViewNFTBookBeforeClaim"
            class="w-full"
            :url="url"
            :class-id="id"
            :content-urls="contentUrls"
            :iscn-url="iscnUrl"
            :is-nft-book="isNftBook"
            :is-content-viewable="isContentViewable"
            :is-content-downloadable="isDownloadable"
            @view-content-url="handleClickViewContentDirectly"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'NFTClaimMainSection',
  props: {
    step: {
      type: Number,
      default: undefined,
    },
    totalStep: {
      type: Number,
      default: undefined,
    },
    headerText: {
      type: String,
      default: undefined,
    },
    contentText: {
      type: String,
      default: undefined,
    },
    formatDownloadLinks: {
      type: Array,
      default: () => [],
    },
    shouldDisplayDownloadOptions: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClickViewContentDirectly(e, contentUrl, type) {
      logTrackerEvent(this, 'NFT', 'ClaimViewContentDirect', this.productId, 1);
    },
  },
};
</script>
