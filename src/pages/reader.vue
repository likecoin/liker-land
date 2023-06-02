<template>
  <div class="h-screen">
    <iframe
      :src="iframeSrc"
      width="100%"
      height="100%"
      style="border:none"
    />
  </div>
</template>

<script>
export default {
  layout: 'empty',
  head: {
    bodyAttrs: { class: 'overflow-hidden' },
  },
  computed: {
    iframeSrc() {
      const encodedUrl = encodeURIComponent(this.$route.query.src);
      const encodedCorsUrl = encodeURIComponent(
        `https://pdf-cors-ufdrogmd2q-uw.a.run.app/pdf-cors?url=${encodedUrl}`
      );
      // TODO: customize pdf.js instead of using default build
      return `https://likecoin.github.io/pdf.js/web/viewer.html?file=${encodedCorsUrl}`;
    },
  },
  mounted() {
    if (!this.$route.query.src) {
      this.$router.replace(this.localeLocation(this.getHomeRoute));
    }
  },
};
</script>
