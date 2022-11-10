<template>
  <CollapsibleCard
    :class="[
      'w-full',
    ]"
    :title="$t('nft_details_page_title_collector')"
    :has-content-padding="false"
    :is-narrow="isNarrow"
  >
    <template #titleIcon>
      <IconPerson />
    </template>
    <template #content="{ contentPaddingClass }">
      <template v-if="ownerCount">
        <ul :class="contentPaddingClass">
          <NFTPageCollectorListItem
            v-for="owner in trimmedItems"
            :key="owner.id"
            :class-id="classId"
            :owner="owner"
          />
        </ul>
        <ShowMore v-if="shouldShowMore">
          <template #header>
            <div class="flex justify-between mb-[12px] min-w-[310px]">
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
            <hr class="w-full border-shade-gray">
          </template>
          <template #content>
            <ul class="min-w-[310px]">
              <NFTPageCollectorListItem
                v-for="owner in items"
                :key="owner.id"
                :class-id="classId"
                :owner="owner"
              />
            </ul>
          </template>
        </ShowMore>
      </template>
      <div
        v-else
        class="flex justify-center items-center min-h-[180px]"
      >
        <Label preset="p6" :text="$t('nft_details_page_label_no_record')" />
      </div>
    </template>
  </CollapsibleCard>
</template>
<script>
export default {
  name: 'CollectorList',
  props: {
    classId: {
      type: String,
      required: true,
    },
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
    isNarrow: {
      type: Boolean,
      default: false,
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
