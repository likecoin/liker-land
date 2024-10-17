<template>
  <div :class="['font-[600]', labelStyle]">{{ label }}</div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    isCampaign: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    labelStyle() {
      if (this.isCampaign) return 'text-white';
      return 'text-dark-gray';
    },
  },
};
</script>
