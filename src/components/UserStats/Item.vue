<template>
  <div class="flex flex-col items-center justify-center">
    <Label
      v-if="preset === 'default'"
      preset="h3"
      class="text-like-green"
      :text="isLoading ? '-' : statsValue"
    />
    <slot v-else name="custom-stats" />
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
    // The preset of UserStatsItem, option: default and custom
    preset: {
      type: String,
      default: 'default',
    },
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
