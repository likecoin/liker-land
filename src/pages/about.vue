<template lang="pug">
  .about-page
    PageHeader
      template
        SiteNavBar.text-white.bg-like-green

    main.page-content
      AboutPage
</template>

<script>
export default {
  mounted() {
    window.location.href = 'https://about.like.co/';
  },
};
</script>
