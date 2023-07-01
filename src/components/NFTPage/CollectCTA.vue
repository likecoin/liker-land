<template>
  <div class="flex flex-col w-full rounded-[32px] bg-like-green p-[32px] relative mt-[24px] sm:mt-0">
    <NFTImageGraphic class="absolute top-0 left-[50%] translate-x-[-50%] translate-y-[-50%]" :href="nftImageUrl" />
    <div class="mt-[30px] order-2 sm:order-1 sm:mt-[60px]">
      <Label preset="h3" align="center" class="text-transparent bg-gradient-to-r from-[#d2f0f0] to-[#f0e6b4] bg-clip-text" :text="$t('nft_details_page_title_CTA')" />
    </div>
    <!-- Creator's Message -->
    <div
      v-if="creatorMessage && creatorMessage.message"
      :class="[
        'flex',
        'flex-col',
        'gap-[24px]',
        'items-center',
        'justify-center',
        'border-2',
        'border-like-cyan',
        'rounded-[24px]',
        'px-[24px]',
        'py-[32px]',
        'mt-[60px]',
        'order-1',
        'sm:order-2',
        'sm:p-[32px]',
        'sm:mt-[32px]',
        { 'desktop:flex-row desktop:justify-between': !isColumn },
      ]"
    >
      <div class="flex flex-col gap-[24px] items-center sm:flex-row sm:mr-[24px]">
        <NFTMessageIdentity
          type="creator"
          class="flex-shrink-0"
          :wallet-address="iscnOwner"
          :avatar-size="40"
        />
        <div class="flex-col  justify-start mt-[8px]">
          <div class="text-[14px] text-like-cyan text-center sm:text-left">{{ $t('nft_message_type_collect') }}</div>
          <div class="text-[16px] text-white font-600 text-center mt-[4px] sm:text-left">{{ creatorMessage.message }}</div>
        </div>
      </div>
      <ButtonV2
        preset="secondary"
        class="flex-shrink-0"
        :text="$t('nft_details_page_activity_list_event_collect')"
        @click="handleCollectFromCTA"
      >
        <template #prepend>
          <LazyIconPrice />
        </template>
      </ButtonV2>
    </div>
    <div v-else class="flex flex-col gap-[16px] justify-center items-center mt-[60px] order-1 sm:order-2 sm:mt-[32px] sm:flex-row">
      <NFTMessageIdentity
        type="creator"
        class="flex-shrink-0"
        :wallet-address="iscnOwner"
        :avatar-size="40"
      />
      <ButtonV2
        preset="secondary"
        :text="$t('nft_details_page_activity_list_event_collect')"
        @click="handleCollectFromCTA"
      >
        <template #prepend>
          <LazyIconPrice />
        </template>
      </ButtonV2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nftImageUrl: {
      type: String,
      default: undefined,
    },
    creatorMessage: {
      type: Object,
      default: null,
    },
    iscnOwner: {
      type: String,
      default: undefined,
    },
    isColumn: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleCollectFromCTA() {
      this.$emit('click-collect-from-cta');
    },
  },
};
</script>
