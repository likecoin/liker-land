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
          :iscn-id="iscnId"
          :iscn-url="iscnUrl"
          :content-fingerprints="contentFingerprints"
        />
      </div>
      <template v-if="items.length && view !== 'created'">
        <div class="overflow-x-scroll scrollbar-custom">
          <div :class="['min-w-[800px]', contentPaddingClass]">
            <NFTPageEventListTable :nft-history="trimmedItems" />
          </div>
        </div>
        <ShowMore v-if="shouldShowMore">
          <template #content>
            <NFTPageEventListTable
              class="min-w-[800px]"
              :nft-history="items"
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
