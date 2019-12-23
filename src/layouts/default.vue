<template>
  <div class="page-layout page-layout--default">
    <DialogContainer />

    <nuxt class="page-wrapper sliding-menu-pushee" />

    <SlidingMenu ref="slidingMenu" />

    <SmartAppBanner />
  </div>
</template>

<script>
import DialogContainer from '~/components/DialogContainer';
import SmartAppBanner from '~/components/SmartAppBanner';
import slidingMenuMixin from '~/mixins/sliding-menu';

export default {
  components: {
    DialogContainer,
    SmartAppBanner,
  },
  mixins: [slidingMenuMixin],
};
</script>

<style lang="scss">
.page-layout--default {
  @apply bg-gray-f7;
}
</style>
