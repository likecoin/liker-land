<template>
  <div class="flex flex-col items-center justify-center">
    <Label
      class="text-like-green text-[14px] font-600 laptop:text-[24px]"
      valign="bottom"
      :text="isLoading ? '-' : statsValue.toString()"
    >
      <slot v-if="!isLoading" name="custom-value" />
    </Label>
    <Label
      class="text-medium-gray mt-[4px] text-[10px] font-400 laptop:text-[14px] laptop:font-600"
      content-class="text-center whitespace-pre"
      :text="labelText"
      valign="middle"
    >
      <template #prepend>
        <slot name="label-icon" />
      </template>
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
    labelText: {
      type: String,
      default: undefined,
    },
  },
};
</script>
