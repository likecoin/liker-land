<template>
  <DropDownList
    class="w-full mb-[250px]"
    :title="$t('nft_details_page_activity_list_title')"
  >
    <template #titleIcon>
      <IconActivity />
    </template>
    <template #content>
      <div v-if="nftHistory.length">
        <NFTPageEventListItems :nft-history="nftHistory" />
        <ShowMore
          v-if="shouldShowMore"
          class="my-[8px]"
        >
          <template #content>
            <NFTPageEventListItems
              :nft-history="populatedList"
            />
          </template>
        </ShowMore>
      </div>
      <div v-else class="flex justify-center">
        <Label preset="p6" class="my-[12px]" :text="$t('nft_details_page_label_no_record')" />
      </div>
    </template>
  </DropDownList>
</template>
<script>
export default {
  name: 'EventList',
  props: {
    nftHistory: {
      type: Array,
      default: undefined,
    },
    populatedList: {
      type: Array,
      default: undefined,
    },
    shouldShowMore: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
