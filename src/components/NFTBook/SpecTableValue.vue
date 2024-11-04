<template>
  <div :class="['font-[600]', textStyle]" v-text="text" />
</template>

<script>
import { PRESET_TYPE } from '~/components/NFTBook/ItemCard';

export default {
  props: {
    text: {
      type: String,
      default: '',
    },
    preset: {
      type: String,
      default: PRESET_TYPE.DEFAULT,
    },
  },
  computed: {
    textStyle() {
      if (this.preset === PRESET_TYPE.CAMPAIGN) return 'text-white';
      return 'text-dark-gray';
    },
  },
};
</script>
