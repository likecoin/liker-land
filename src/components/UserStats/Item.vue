<template>
  <div class="flex flex-col items-center justify-start p-[8px]">
    <div :class="['flex flex-col items-center text-like-green', statsClass]">
      <div class="my-[4px]"><slot name="icon" /></div>
      <Label
        class="text-[20px] laptop:text-[24px] font-600"
        valign="bottom"
        :text="isLoading ? '-' : statsValue.toString()"
      >
        <slot v-if="!isLoading" name="custom-value" />
      </Label>
    </div>
    <Label
      class="text-medium-gray mt-[4px] text-[11px] font-400 laptop:text-[12px] laptop:font-600"
      content-class="text-center whitespace-pre"
      :text="labelText"
    >
      <slot name="label" />
    </Label>
  </div>
</template>
<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    statsValue: {
      type: [String, Number],
      default: 0,
    },
    statsClass: {
      type: String,
      default: '',
    },
    labelText: {
      type: String,
      default: undefined,
    },
  },
};
</script>
