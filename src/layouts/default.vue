<template>
  <div class="page-layout page-layout--default">
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
