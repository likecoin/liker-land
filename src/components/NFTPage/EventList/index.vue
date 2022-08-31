<template>
  <CollapsibleCard
    :title="$t('nft_details_page_activity_list_title')"
    :has-content-padding="false"
  >
    <template #titleIcon>
      <IconActivity />
    </template>
    <template #content="{ contentPaddingClass }">
      <template v-if="items.length">
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
        v-else
        class="flex justify-center items-center min-h-[180px]"
      >
        <Label
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
  name: 'EventList',
  props: {
    items: {
      type: Array,
      default: undefined,
    },
    trimmedCount: {
      type: Number,
      default: 10,
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
