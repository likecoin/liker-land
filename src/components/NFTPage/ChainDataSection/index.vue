<template>
  <CollapsibleCard
    :title="$t('nft_details_page_activity_list_title')"
    :has-content-padding="false"
  >
    <template #titleIcon>
      <IconActivity />
    </template>
    <template #content="{ contentPaddingClass }">
      <div class="px-[32px] mb-[28px]">
        <NFTPageChainDataSectionMetadata
          :content-url="contentUrl"
          :class-id="classId"
          :nft-id="nftId"
          :iscn-id="iscnId"
          :iscn-url="iscnUrl"
          :content-fingerprints="contentFingerprints"
        />
      </div>
      <template v-if="items.length && view !== 'created'">
        <div class="overflow-x-scroll scrollbar-custom">
          <div :class="['min-w-[800px]', contentPaddingClass]">
            <NFTPageEventListTable :nft-history="trimmedItems" :show-memo="showMemo" />
          </div>
        </div>
        <ShowMore v-if="shouldShowMore">
          <template #content>
            <NFTPageEventListTable
              class="min-w-[800px]"
              :nft-history="items"
              :show-memo="showMemo"
            />
          </template>
        </ShowMore>
      </template>
      <div
        v-else-if="!items.length && view !== 'created'"
        class="flex justify-center items-center min-h-[180px]"
      >
        <Label
          v-if="isLoading"
          preset="p6"
          class="my-[12px]"
          :text="$t('nft_details_page_label_loading')"
        />
        <Label
          v-else
          preset="p6"
          class="my-[12px]"
          :text="$t('nft_details_page_label_no_record')"
        />
      </div>
      <div
        v-if="nftId && !shouldShowMore"
        class="flex justify-center items-center mb-[24px]"
      >
        <NuxtLink
          :to="{
            name: 'nft-class-classId',
            params: { classId },
            hash: '#chain-data',
          }"
          class="text-medium-gray underline text-[14px]"
        >
          {{ $t('nft_details_page_label_class_page') }}
        </NuxtLink>
      </div>
    </template>
  </CollapsibleCard>
</template>
<script>
export default {
  name: 'NFTPageChainDataSection',
  props: {
    items: {
      type: Array,
      default: undefined,
    },
    trimmedCount: {
      type: Number,
      default: 10,
    },
    showMemo: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    view: {
      type: String,
      default: 'collected',
    },
    contentUrl: {
      type: String,
      default: '',
    },
    iscnId: {
      type: String,
      default: '',
    },
    iscnUrl: {
      type: String,
      default: '',
    },
    classId: {
      type: String,
      default: '',
    },
    nftId: {
      type: String,
      default: '',
    },
    contentFingerprints: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    trimmedItems() {
      return this.items.slice(0, this.trimmedCount);
    },
    shouldShowMore() {
      return this.items.length > this.trimmedItems.length;
    },
  },
};
</script>
