<template>
  <div class="page-layout page-layout--desktop">
    <nuxt class="page-wrapper sliding-menu-pushee" />
    <SlidingMenu ref="slidingMenu" />
  </div>
</template>

<script>
import slidingMenuMixin from '~/mixins/sliding-menu';

export default {
  mixins: [slidingMenuMixin],
};
</script>

<style lang="scss">
.page-layout--desktop {
  @apply bg-gray-f7;
}
</style>
