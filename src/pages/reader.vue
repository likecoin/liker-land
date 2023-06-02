<template>
  <div class="h-screen">
    <ProgressIndicator v-if="!isMounted" class="self-center mt-[16px]" />
    <iframe
      v-else
      :src="iframeSrc"
      width="100%"
      height="100%"
      style="border:none"
    />
  </div>
</template>

<script>
import { isMobile } from '@walletconnect/browser-utils';

export default {
  layout: 'empty',
  data() {
    return {
      isMounted: false,
      isMobile: false,
    };
  },
  head: {
    bodyAttrs: { class: 'overflow-hidden' },
  },
  computed: {
    iframeSrc() {
      if (this.isMobile) {
        const encodedUrl = encodeURIComponent(this.$route.query.src);
        const encodedCorsUrl = encodeURIComponent(
          `https://pdf-cors-ufdrogmd2q-uw.a.run.app/pdf-cors?url=${encodedUrl}`
        );
        // TODO: customize pdf.js instead of using default build
        return `https://likecoin.github.io/pdf.js/web/viewer.html?file=${encodedCorsUrl}`;
      }
      return this.$route.query.src;
    },
  },
  mounted() {
    if (!this.$route.query.src) {
      this.$router.replace(this.localeLocation(this.getHomeRoute));
      return;
    }
    this.isMobile = isMobile();
    this.isMounted = true;
  },
};
</script>
