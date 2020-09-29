<template lang="pug">
  .getapp-page
    PageHeader
      template
        SiteNavBar.text-like-green

    main.page-content
      GetAppPage(:from="$route.query.from")
</template>

<script>
import GetAppPage from '~/components/GetAppPage/GetAppPage';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

import { CrispMixinFactory } from '~/mixins/crisp';

export default {
  components: {
    GetAppPage,
    PageHeader,
    SiteNavBar,
  },
  mixins: [CrispMixinFactory()],
};
</script>

<style lang="scss">
.getapp-page {
  background: linear-gradient(20deg, #d2f0f0, #f0e6b4);
}
</style>
