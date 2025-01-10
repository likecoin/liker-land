<template>
  <Dialog
    :open="isOpenDialog"
    preset="custom"
    panel-class="overflow-x-auto shadow-lg"
    panel-component="CardV2"
    @close="$emit('close')"
  >
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
    </div>
    <hr class="w-full border-shade-gray" />
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
  </Dialog>
</template>
<script>
export default {
  name: 'NFTPageCollectorListDialog',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    classId: {
      type: String,
      default: undefined,
    },
    isOpenDialog: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
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
