<template>
  <ButtonV2
    v-bind="$attrs"
    :class="['group', { 'w-full !rounded-[8px]': isFullWidth }]"
    border-class="border border-gray-e6"
    :preset="isFullWidth ? 'outline' : 'tertiary'"
    :text="label"
    align="left"
    @click="toggle"
  >
    <template v-if="!isFullWidth" #prepend>
      <ListingPageToggleButtonCheckboxIcon :checked="value" />
    </template>
    <template v-else #append>
      <ListingPageToggleButtonCheckboxIcon :checked="value" />
    </template>
  </ButtonV2>
</template>

<script>
export default {
  name: 'ListingPageToggleButton',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    isFullWidth: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value);
    },
  },
};
</script>
