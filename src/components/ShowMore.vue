<template>
  <div>
    <div
      class="transition duration-200 cursor-pointer text-dark-gray hover:text-medium-gray"
      @click="isOpenDialog = true"
    >
      {{ this.$t('nft_details_page_button_show_more') }}
    </div>
    <Dialog
      v-model="isOpenDialog"
      preset="custom"
      panel-class="shadow-lg bg-white phone:min-w-[380px] min-w-[520px] w-full max-w-[720px] p-[48px] rounded-[24px]"
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
