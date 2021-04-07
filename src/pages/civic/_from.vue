<template lang="pug">
  .civic-page
    PageHeader
      template
        SiteNavBar.text-like-green

    CivicLikerPageWithCreator.page-content(
      v-if="creator"
      :creator-id="creator.user"
      :creator-display-name="creator.displayName"
      :creator-avatar-url="creator.avatar"
      :is-creator-civic-liker="creator.isSubscribedCivicLiker"
      @subscribe="subscribe"
    )
    CivicLikerPageWithoutCreator(v-else)
</template>

<script>
import { getUserMinAPI } from '~/util/api';
import { checkUserNameValid } from '~/util/user';

import CivicLikerPageWithCreator from '~/components/CivicLikerPage/WithCreator';
import CivicLikerPageWithoutCreator from '~/components/CivicLikerPage/WithoutCreator';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  components: {
    PageHeader,
    SiteNavBar,
    CivicLikerPageWithCreator,
    CivicLikerPageWithoutCreator,
  },
  async asyncData({ params, query, $api }) {
    const { from: pID } = params;
    const { from: qID } = query;
    const id = pID || qID;
    if (id && checkUserNameValid(id)) {
      try {
        const creator = await $api.$get(
          getUserMinAPI(id, { types: ['creator'] })
        );
        return {
          creator,
        };
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    }
    return {
      creator: undefined,
    };
  },
  methods: {
    subscribe({ quantity }) {
      this.$router.push({
        name: 'id-civic-register',
        params: {
          id: this.creator.user,
        },
        query: {
          quantity,
          utm_source: this.$route.query.utm_source,
          utm_medium: this.$route.query.utm_medium,
        },
      });
    },
  },
  head() {
    const name = this.creator.displayName.trim();
    const title = this.$t('CivicEntryPage.Og.Title', { name });
    const description =
      this.creator.creatorPitch || this.$t('CreatorPitch.Default');
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/civic-v2.png',
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
    };
  },
};
</script>
