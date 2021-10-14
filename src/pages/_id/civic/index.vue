<template lang="pug">
  .settings-page
      PageHeader
        template
          SiteNavBar.text-like-green(:is-disabled-nav="shouldDisabledNav")

      main.page-content(class="phone:px-0 px-16")
        CivicSubscriptionView(
          :liker-id="id"
          :is-show-backdrop="false"
          :initial-state="$route.query.initial_state"
          @select-quantity="onClickSelectQuantity"
          @go-to-confirm="onGoToConfirm"
          @state-change="onStateChange"
          @confirm-subscription="onClickSubscription"
        )
</template>

<script>
import { mapGetters } from 'vuex';

import { STRIPE_SDK_URL, CIVIC_LIKER_CLASSIC_LIKER_ID } from '~/constant';

import { getUserMinAPI, getLikerOgImage } from '~/util/api';
import { checkUserNameValid } from '~/util/user';
import { logTrackerEvent } from '~/util/EventLogger';

import CivicSubscriptionView from '~/components/CivicSubscriptionView/CivicSubscriptionView';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

function getIdFromRoute(route) {
  const isCivicLikerClassicRoute = route.name === 'civic-classic';
  return isCivicLikerClassicRoute
    ? CIVIC_LIKER_CLASSIC_LIKER_ID
    : route.params.id;
}

export default {
  components: {
    CivicSubscriptionView,
    PageHeader,
    SiteNavBar,
  },
  middleware: 'civic-payment',
  computed: {
    ...mapGetters(['getUserId']),
    id() {
      return getIdFromRoute(this.$route);
    },
    shouldDisabledNav() {
      return !this.getUserId;
    },
  },
  async asyncData({ route, $api, error }) {
    const id = getIdFromRoute(route);
    if (id && checkUserNameValid(id)) {
      try {
        const creator = await $api.$get(
          getUserMinAPI(id, { types: ['creator'] })
        );
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
    const description =
      this.creator.creatorPitch || this.$t('CreatorPitch.Default');
    const image = getLikerOgImage(this.creator.user);
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
          content: image,
        },
      ],
      link: [
        { rel: 'canonical', href: `${this.$route.path}` },
        {
          hid: 'preload:stripe',
          rel: 'preload',
          href: STRIPE_SDK_URL,
          as: 'script',
        },
      ],
      script: [{ hid: 'stripe', src: STRIPE_SDK_URL }],
    };
  },
};
</script>
