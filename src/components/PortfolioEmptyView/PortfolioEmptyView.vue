<template lang="pug">
  mixin Bullet
    span.w-24.h-24.mr-16.shrink-0.flex.items-center.justify-center.border.border-current.rounded-full.font-600
      block

  div
    .py-32.text-center.text-gray-c.text-16.font-600.bg-white.border.border-gray-e6.rounded-8
      | {{ label }}

    PortfolioEmptyTipsForCreator.mt-24.max-w-300.w-full.mx-auto(
      v-if="isShowTipsForCreator"
      :preset="preset"
      :is-civic-liker="isCivicLiker"
    )
</template>

<script>
import PortfolioEmptyTipsForCreator from './PortfolioEmptyTipsForCreator';

export default {
  components: {
    PortfolioEmptyTipsForCreator,
  },
  props: {
    preset: {
      type: String,
      default: 'works',
    },
    isCivicLiker: {
      type: Boolean,
      default: false,
    },
    isShowTipsForCreator: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    label() {
      return this.$t(
        this.preset === 'works'
          ? 'PortfolioEmptyView.Works.Label'
          : 'PortfolioEmptyView.SuperLiked.Label'
      );
    },
  },
};
</script>
