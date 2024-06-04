<template>
  <Dialog
    :open="isOpen"
    preset="custom"
    z-index-class="z-[1000001]"
    panel-class="px-0 overflow-x-auto shadow-lg rounded-b-none rounded-t-[24px] sm:rounded-[24px] !py-[16px]"
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
    <Label
      :text="title"
      align="center"
      class="mb-[12px] text-[18px] font-600"
    />
    <div class="w-full border-b-[1px] border-shade-gray mt-[4px]" />
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
    title: {
      type: String,
      default: '',
    },
  },
};
</script>
