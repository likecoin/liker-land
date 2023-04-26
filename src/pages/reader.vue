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
  computed: {
    iframeSrc() {
      return this.$route.query.src;
    },
  },
  mounted() {
    if (!this.iframeSrc) {
      this.$router.replace(this.localeLocation(this.getHomeRoute));
    }
  },
};
</script>
