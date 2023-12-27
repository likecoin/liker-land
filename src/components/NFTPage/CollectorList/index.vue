<template>
  <CollapsibleCard
    :class="['w-full']"
    :title="$t('nft_details_page_title_collector')"
    :has-content-padding="false"
    :is-narrow="isNarrow"
  >
    <template #titleIcon>
      <IconPerson />
    </template>
    <template #content="{ contentPaddingClass }">
      <div
        v-if="trimmedItems.length"
        class="overflow-x-scroll scrollbar-custom"
      >
        <div :class="[contentPaddingClass, 'phone:min-w-[600px]']">
          <table class="w-full">
            <tbody class="w-full">
              <tr class="w-full border-b-shade-gray border-b-[1px]">
                <td
                  v-for="(text, index) in tableHeaderItems"
                  :key="index"
                  class="py-[8px]"
                >
                  <Label
                    class="justify-start text-left text-dark-gray text-[12px] font-500"
                    :text="text"
                    tag="div"
                    valign="middle"
                    align="left"
                    content-class="whitespace-nowrap"
                  />
                </td>
              </tr>
              <NFTPageCollectorListItem
                v-for="owner in trimmedItems"
                :key="owner.id"
                :class-id="classId"
                :owner="owner"
                :has-memo="hasMemo"
              />
            </tbody>
          </table>
        </div>
        <ShowMore
          v-if="shouldShowMore"
          @click-show-more="$emit('click-show-more-collector')"
        >
          <template #header>
            <div class="flex justify-between mb-[12px] min-w-[310px]">
              <Label
                class="w-min font-600"
                :text="
                  `${$t('nft_details_page_title_collector')} (${items.length})`
                "
                preset="h5"
                valign="middle"
                content-class="whitespace-nowrap text-like-green "
                prepend-class="text-like-green"
              >
                <template #prepend>
                  <IconPerson />
                </template>
              </Label>
            </div>
            <hr class="w-full border-shade-gray" />
          </template>
          <template #content>
            <div class="min-w-[310px]">
              <table class="w-full">
                <tbody class="w-full">
                  <tr class="w-full border-b-shade-gray border-b-[1px]">
                    <td
                      v-for="(text, index) in tableHeaderItems"
                      :key="index"
                      class="py-[8px]"
                    >
                      <Label
                        class="justify-start text-left text-dark-gray text-[12px] font-500"
                        :text="text"
                        tag="div"
                        valign="middle"
                        align="left"
                        content-class="whitespace-nowrap"
                      />
                    </td>
                  </tr>
                  <NFTPageCollectorListItem
                    v-for="owner in items"
                    :key="owner.id"
                    :class-id="classId"
                    :owner="owner"
                    :has-memo="hasMemo"
                  />
                </tbody>
              </table>
            </div>
          </template>
        </ShowMore>
      </div>
      <div v-else class="flex justify-center items-center min-h-[180px]">
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
    hasMemo() {
      return this.items.some(item => item.memo);
    },
    tableHeaderItems() {
      if (this.hasMemo) {
        return [
          this.$t('nft_details_page_title_collector'),
          this.$t('nft_message_type_generic'),
          this.$t('nft_details_page_label_owning'),
        ];
      }
      return [
        this.$t('nft_details_page_title_collector'),
        this.$t('nft_details_page_label_owning'),
      ];
    },
  },
};
</script>
