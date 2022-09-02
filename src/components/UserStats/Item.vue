<template>
  <div class="flex flex-col items-center justify-center">
    <Label
      preset="h3"
      class="text-like-green"
      content-class="!items-end"
      :text="isLoading ? '-' : statsValue"
    >
      <slot v-if="!isLoading" name="custom-value" />
    </Label>
    <Label
      preset="h6"
      class="text-medium-gray mt-[4px]"
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
      type: String,
      default: undefined,
    },
    labelText: {
      type: String,
      default: 'undefined',
    },
  },
};
</script>
