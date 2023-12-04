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
      <template v-if="trimmedItems.length">
        <div :class="contentPaddingClass">
          <table class="w-full">
            <tbody class="w-full">
              <tr class="w-full border-b-shade-gray border-b-[1px]">
                <td class="my-[12px]">
                  <Label
                    class="w-min text-[12px] font-500"
                    :text="$t('nft_details_page_title_collector')"
                    valign="middle"
                    content-class="whitespace-nowrap text-dark-gray"
                  >
                  </Label>
                </td>
                <td>
                  <Label
                    class="justify-start text-left text-dark-gray text-[12px] font-500"
                    :text="$t('nft_message_type_generic')"
                    tag="div"
                    valign="middle"
                    align="left"
                    content-class="whitespace-nowrap"
                  />
                </td>
                <td>
                  <Label
                    class="w-min text-dark-gray text-[12px] font-500"
                    :text="$t('nft_details_page_label_owning')"
                    valign="middle"
                    content-class="whitespace-nowrap"
                  />
                </td>
              </tr>
              <NFTPageCollectorListItem
                v-for="owner in trimmedItems"
                :key="owner.id"
                :class-id="classId"
                :owner="owner"
              />
            </tbody>
          </table>
        </div>
        <ShowMore
          v-if="shouldShowMore"
          @click-show-more="$emit('click-show-more-collector')"
        >
          <template #content>
            <div class="min-w-[310px]">
              <table class="w-full">
                <tbody class="w-full">
                  <tr class="w-full border-b-shade-gray border-b-[1px]">
                    <td class="my-[12px]">
                      <Label
                        class="w-min text-[12px] font-500"
                        :text="$t('nft_details_page_title_collector')"
                        valign="middle"
                        content-class="whitespace-nowrap text-dark-gray"
                      >
                      </Label>
                    </td>
                    <td>
                      <Label
                        class="justify-start text-left text-dark-gray text-[12px] font-500"
                        :text="$t('nft_message_type_generic')"
                        tag="div"
                        valign="middle"
                        align="left"
                        content-class="whitespace-nowrap"
                      />
                    </td>
                    <td>
                      <Label
                        class="w-min text-dark-gray text-[12px] font-500"
                        :text="$t('nft_details_page_label_owning')"
                        valign="middle"
                        content-class="whitespace-nowrap"
                      />
                    </td>
                  </tr>
                  <NFTPageCollectorListItem
                    v-for="owner in items"
                    :key="owner.id"
                    :class-id="classId"
                    :owner="owner"
                  />
                </tbody>
              </table>
            </div>
          </template>
        </ShowMore>
      </template>
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
  },
};
</script>
