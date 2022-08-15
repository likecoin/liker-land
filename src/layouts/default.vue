<template>
  <div class="page-layout page-layout--default">
    <AppHeader class="w-full text-like-green" />
    <nuxt class="page-wrapper" />
    <PortalTarget
      name="dialog"
      multiple
    />
    <PortalTarget
      name="snackbar"
      multiple
    />
  </div>
</template>

<script>
import slidingMenuMixin from '~/mixins/sliding-menu';

export default {
  mixins: [slidingMenuMixin],
};
</script>

<style lang="scss">
.page-layout--default {
  @apply bg-gray-f7;
}
</style>
