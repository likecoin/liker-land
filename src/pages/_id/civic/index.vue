<template lang="pug">
  .settings-page
      PageHeader
        template
          SiteNavBar.text-like-green

      main.page-content
        CivicSubscriptionView(
          :is-show-backdrop="false"
          :initial-state="$route.query.initial_state"
        )
</template>

<script>
import { getUserMinAPI } from '~/util/api';
import { checkUserNameValid } from '~/util/user';

import CivicSubscriptionView from '~/components/CivicSubscriptionView/CivicSubscriptionView';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  components: {
    CivicSubscriptionView,
    PageHeader,
    SiteNavBar,
  },
  async asyncData({ store, route, redirect, query, $api, error }) {
    const currentUserLikerID = store.getters.getUserId;
    const { id } = route.params;

    if (id === currentUserLikerID) {
      redirect({ name: 'id', params: { id }, query });
      return undefined;
    }

    if (id && checkUserNameValid(id)) {
      try {
        const creator = await $api.$get(getUserMinAPI(id));
        return { creator };
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    }
    error({ statusCode: 404, message: 'LIKER_NOT_FOUND' });
    return undefined;
  },
  head() {
    const name = this.creator.displayName.trim();
    const title = this.$t('CivicEntryPage.Og.Title', { name });
    const description = this.$t('CivicEntryPage.Og.Description', { name });
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
