<template>
  <div class="page-layout page-layout--desktop">
    <DialogContainer />

    <nuxt class="page-wrapper sliding-menu-pushee" />

    <SlidingMenu ref="slidingMenu" />
  </div>
</template>

<script>
import DialogContainer from '~/components/DialogContainer';
import slidingMenuMixin from '~/mixins/sliding-menu';

export default {
  components: {
    DialogContainer,
  },
  mixins: [slidingMenuMixin],
};
</script>

<style lang="scss">
.page-layout--desktop {
  @apply bg-gray-f7;
}
</style>
