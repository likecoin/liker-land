<template>
  <div class="getapp-page">
    <main class="page-content">
      <GetAppPage
        :from="$route.query.from"
        v-bind="getUtmProps()"
      />
    </main>
  </div>
</template>

<script>
import GetAppPage from '~/components/GetAppPage/GetAppPage';

import { CrispMixinFactory } from '~/mixins/crisp';
import utmMixin from '~/mixins/utm';

export default {
  layout: 'default',
  components: {
    GetAppPage,
  },
  mixins: [CrispMixinFactory(), utmMixin],
  head() {
    return {
      title: this.$t('GetAppPage.Title'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('GetAppPage.Og.Title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('GetAppPage.Og.Description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('GetAppPage.Og.Description'),
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/writing-nft.jpg',
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
    };
  },
};
</script>
