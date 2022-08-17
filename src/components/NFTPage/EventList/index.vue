<template>
  <DropDownList
    class="w-full mb-[250px]"
    :title="$t('nft_details_page_activity_list_title')"
  >
    <template #titleIcon>
      <IconActivity />
    </template>
    <template #content>
      <div
        v-if="items.length" 
        class="overflow-scroll scrollbar-custom"
      >
        <div class="min-w-[680px]">
          <NFTPageEventListTable :nft-history="trimmedItems" />
          <ShowMore
            v-if="shouldShowMore"
            class="phone:hidden my-[8px]"
          >
            <template #content>
              <NFTPageEventListTable
                class="w-[620px]"
                :nft-history="items"
              />
            </template>
          </ShowMore>
        </div>
      </div>
      <div v-else class="flex justify-center">
        <Label
          preset="p6" 
          class="my-[12px]"
          :text="$t('nft_details_page_label_no_record')"
        />
      </div>
      <ShowMore
        v-if="shouldShowMore"
        class="hidden phone:block my-[8px]"
      >
        <template #content>
          <NFTPageEventListTable
            class="w-[620px]"
            :nft-history="items"
          />
        </template>
      </ShowMore>
    </template>
  </DropDownList>
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
