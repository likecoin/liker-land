<template>
  <div :class="['font-[600]', textStyle]">{{ text }}</div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
    isCampaign: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    textStyle() {
      if (this.isCampaign) return 'text-white';
      return 'text-dark-gray';
    },
  },
};
</script>
