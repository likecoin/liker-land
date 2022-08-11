<template>
  <DropDownList
    :class="[
      'w-full',
    ]"
    :title="$t('nft_details_page_title_collector')"
  >
    <template #titleIcon>
      <IconPerson />
    </template>
    <template #content class="flex flex-col my-[12px]">
      <div v-if="ownerCount">
        <NFTPageCollectorListItems :owner-list="trimmedItems" />
        <ShowMore
          v-if="shouldShowMore"
        >
          <template #header>
            <div class="flex justify-between mb-[12px]">
              <Label
                class="w-min font-600"
                :text="`${$t('nft_details_page_title_collector')} (${items.length})`"
                preset="h5"
                valign="middle"
                content-class="whitespace-nowrap text-like-green "
                prepend-class="text-like-green"
              >
                <template #prepend>
                  <IconPerson />
                </template>
              </Label>
              <Label
                class="w-min font-600"
                :text="$t('nft_details_page_label_owning')"
                preset="h5"
                valign="middle"
                content-class="whitespace-nowrap text-like-green "
                prepend-class="text-like-green"
              />
            </div>
            <div class="w-full h-[2px] bg-shade-gray mb-[8px]" />
          </template>
          <template #content>
            <NFTPageCollectorListItems :owner-list="items" />
          </template>
        </ShowMore>
      </div>
      <div v-else>
        <div class="flex justify-center">
          <Label preset="p6" :text="$t('nft_details_page_label_no_record')" />
        </div>
      </div>
    </template>
  </DropDownList>
</template>
<script>
export default {
  name: 'CollectorList',
  props: {
    // content
    ownerCount: {
      type: Number,
      default: undefined,
    },
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
