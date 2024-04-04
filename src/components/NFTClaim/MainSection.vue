<template>
  <main
    class="w-full max-w-[656px] flex flex-col justify-start items-center gap-[32px] whitespace-pre-line"
  >
    <div class="flex justify-start items-center min-h-[60px] w-full">
      <Stepper v-if="step" :step="step" :total-step="totalStep" />
      <slot name="stepper-append" />
    </div>

    <section
      class="flex flex-col items-start justify-start gap-[8px] w-full text-like-green"
    >
      <slot name="header-prepend" />
      <Label class="text-[40px] font-600" :text="headerText" />
      <slot name="header-append" />
    </section>

    <section
      class="flex flex-col justify-start items-start gap-[32px] text-dark-gray text-left font-400 text-[18px] w-full"
    >
      <p>{{ contentText }}</p>
      <slot name="content-append" />
    </section>

    <section
      :class="[
        'fixed',
        'bottom-0',

        'flex',
        'flex-col',
        'items-center',
        'gap-[8px]',
        'w-full',
        'px-[16px]',
        'py-[16px]',
        'bg-gray-f7',
        'shadow-[0_-4px_30px_-15px_rgba(0,0,0,0.25)]',

        'sm:hidden',
      ]"
    >
      <slot name="footer" />
      <div
        v-for="{
          CanViewNFTBookBeforeClaim,
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
          v-if="CanViewNFTBookBeforeClaim"
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
    </section>
    <section
      :class="[
        'hidden',
        'sm:flex',

        'justify-start',
        'items-start',
        'gap-[24px]',
        'w-full',
        'mt-[24px]',
      ]"
    >
      <slot name="footer" />
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
  },
  methods: {
    handleClickViewContentDirectly(e, contentUrl, type) {
      logTrackerEvent(
        this,
        'NFT',
        'ClaimViewContentDirect',
        this.primaryKey,
        1
      );
    },
  },
};
</script>
