<template>
  <div>
    <div
      class="text-center transition duration-200 cursor-pointer text-dark-gray hover:text-medium-gray"
      @click="isOpenDialog = true"
    >
      {{ this.$t('nft_details_page_button_show_more') }}
    </div>
    <Dialog
      v-model="isOpenDialog"
      preset="custom"
      panel-class="
        p-[48px]
        rounded-[24px]
        shadow-lg
        bg-white

        w-full
        max-w-[calc(100vw_-_3rem)]
        laptop:max-w-[720px]

        overflow-x-scroll
        scrollbar-custom"
    >
      <slot name="header" />
      <slot name="content" />
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'ShowMore',
  data() {
    return { isOpenDialog: false };
  },
};
</script>
