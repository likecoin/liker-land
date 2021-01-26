<template lang="pug">
  .settings-page
      PageHeader
        template
          SiteNavBar.text-like-green

      main.page-content
        CivicSubscriptionView(
          :is-show-backdrop="false"
          :initial-state="$route.query.initial_state"
          :is-experimenting="isExperimenting"
          @select-quantity="onClickSelectQuantity"
          @go-to-confirm="onGoToConfirm"
          @state-change="onStateChange"
          @confirm-subscription="onClickSubscription"
        )
</template>

<script>
import { getUserMinAPI } from '~/util/api';
import { checkUserNameValid } from '~/util/user';
import { logTrackerEvent } from '~/util/EventLogger';

import experimentMixin from '~/mixins/experiment';

import CivicSubscriptionView from '~/components/CivicSubscriptionView/CivicSubscriptionView';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  components: {
    CivicSubscriptionView,
    PageHeader,
    SiteNavBar,
  },
  mixins: [experimentMixin('isExperimenting', 'id-civic-page', 'variant')],
  computed: {
    id() {
      const { id } = this.$route.params;
      return id;
    },
  },
  async asyncData({ route, redirect, query, $api, error }) {
    const { id } = route.params;

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
  mounted() {
    logTrackerEvent(
      this,
      'Civic',
      'CivicPageLoad',
      `CivicPageLoad(${this.id})`,
      1
    );
    const { initial_state: initState } = this.$route.query;
    if (initState) {
      this.onStateChange({ state: initState });
    }
  },
  methods: {
    onClickSelectQuantity() {
      logTrackerEvent(
        this,
        'Civic',
        'CivicClickSelectQuantity',
        `CivicClickSelectQuantity(${this.id})`,
        1
      );
    },
    onGoToConfirm() {
      logTrackerEvent(
        this,
        'Civic',
        'CivicClickConfirm',
        `CivicClickConfirm(${this.id})`,
        1
      );
    },
    onStateChange({ state } = {}) {
      logTrackerEvent(
        this,
        'Civic',
        `CivicViewState${state}`,
        `CivicViewState${state}(${this.id})`,
        1
      );
    },
    onClickSubscription() {
      if (this.getUserIsCivicLiker) {
        logTrackerEvent(
          this,
          'Civic',
          'CivicClickUpdate',
          `CivicClickUpdate(${this.id})`,
          1
        );
      } else {
        logTrackerEvent(
          this,
          'Civic',
          'CivicClickRegister',
          `CivicClickRegister(${this.id})`,
          1
        );
      }
    },
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
