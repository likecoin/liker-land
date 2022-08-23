<template>
  <div class="page-layout page-layout--default">
    <SiteHeader class="w-full text-like-green" />
    <nuxt class="page-wrapper" />
    <Footer />
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
  head() {
    return {
      bodyAttrs: {
        class: ['bg-gray-f7'],
      },
    };
  },
};
</script>
