<template lang="pug">
  .about-page
    PageHeader
      template
        SiteNavBar.text-white.bg-like-green

    main.page-content
      AboutPage
</template>

<script>
import AboutPage from '~/components/AboutPage/AboutPage';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

import { CrispMixinFactory } from '~/mixins/crisp';

export default {
  components: {
    AboutPage,
    PageHeader,
    SiteNavBar,
  },
  mixins: [CrispMixinFactory()],
};
</script>
