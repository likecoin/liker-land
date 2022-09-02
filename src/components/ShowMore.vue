<template>
  <div class="relative">
    <div
      :class="[
        'absolute',
        'inset-x-0',
        'bottom-0',

        'flex',
        'justify-center',
        'items-end',

        'min-h-[120px]',
        'p-[16px]',

        'bg-gradient-to-t',
        'from-shade-gray',
        'to-transparent',

        'pointer-events-none',

        'rounded-b-[24px]',
      ]"
      @click="isOpenDialog = true"
    >
      <ButtonV2
        class="pointer-events-auto"
        preset="plain"
        size="small"
        @click="isOpenDialog = true"
      >{{ this.$t('nft_details_page_button_show_more') }}
      </ButtonV2>
    </div>
    <Dialog
      v-model="isOpenDialog"
      preset="custom"
      panel-class="overflow-x-auto shadow-lg"
      panel-component="CardV2"
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
