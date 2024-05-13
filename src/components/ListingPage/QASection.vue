<template>
  <div
    v-bind="$attrs"
    class="px-[20px] py-[24px] rounded-[12px] bg-white shadow-md"
  >
    <Label
      preset="h3"
      class="text-like-green mb-[16px]"
      :text="$t('listing_page_QA_title')"
    />
    <ul>
      <li
        v-for="item in itemList"
        :key="item.label"
        class="flex flex-col gap-[12px] items-center justify-start w-full cursor-pointer pb-[12px]"
        @click="
          () => {
            handleOpenContent(item);
          }
        "
      >
        <div class="w-full border-b-2 border-shade-gray" />
        <Label class="w-full" :text="item.label">
          <template #append>
            <IconArrowRight />
          </template>
        </Label>
      </li>
    </ul>
    <Dialog
      v-model="isOpenDialog"
      preset="custom"
      panel-class="overflow-x-auto shadow-lg"
      panel-container-class="max-w-[500px]"
      panel-component="CardV2"
    >
      <Label
        preset="h3"
        :text="selectedItem.label"
        class="text-like-green mb-[28px]"
      >
        <template #prepend>
          <IconQuestion />
        </template>
      </Label>
      <div>{{ selectedItem.content }}</div>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'ListingPageQASection',
  props: {
    itemList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isOpenDialog: false,
      selectedItem: {},
    };
  },
  methods: {
    handleOpenContent(item) {
      this.isOpenDialog = true;
      this.selectedItem = item;
    },
  },
};
</script>
