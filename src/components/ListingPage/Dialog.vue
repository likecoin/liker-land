<template>
  <Dialog
    :open="isOpen"
    preset="custom"
    panel-class="px-0 overflow-x-auto shadow-lg rounded-b-none rounded-t-[24px] sm:rounded-[24px]"
    panel-container-class="max-w-[500px] p-[0] sm:px-[12px] sm:py-[24px]"
    panel-component="CardV2"
    :scrollable-wrapper-classes="[
      '!items-end',
      'phone:pb-[12px]',
      'phone:px-[12px]',
      'phoneLg:pb-[0px]',
      'phoneLg:px-[0px]',
      'py-[80px]',
    ]"
    @close="$emit('close')"
  >
    <slot />
  </Dialog>
</template>
<script>
export default {
  name: 'ListingPageDialog',
  layout: 'default',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
