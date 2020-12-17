<template lang="pug">
  .civic-page
    PageHeader
      template
        SiteNavBar.text-like-green

    main.page-content
      CreatorSetupPage(
        :liker-id="getUserId"
        :display-name="getUserInfo ? getUserInfo.displayName : ''"
        :avatar-url="getUserInfo ? getUserInfo.avatarUrl : ''"
      )
        template(#footer)
          section.py-32.flex.justify-center(class="phone:mt-32 tablet:mt-32")
            a.button(
              v-if="!getUserId"
              :href="registerURL"
            )
              | {{ $t('CreatorsPage.CTAButton.Register') }}
            NuxtLink.button(
              v-else-if="!getUserIsCivicLiker"
              :to="{ name: 'civic-from', params: { from: $route.query.referrer } }"
            )
              | {{ $t('CreatorsPage.CTAButton.Civic') }}
</template>

<script>
import { mapGetters } from 'vuex';

import CreatorSetupPage from '~/components/CreatorSetupPage/CreatorSetupPage';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

import { CrispMixinFactory } from '~/mixins/crisp';
import { getOAuthRegisterAPI } from '~/util/api';

export default {
  components: {
    CreatorSetupPage,
    PageHeader,
    SiteNavBar,
  },
  mixins: [CrispMixinFactory({ isBootAtMounted: false })],
  head() {
    return {
      title: this.$t('CreatorsPage.Og.Title'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('CreatorsPage.Og.Title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('CreatorsPage.Og.Description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('CreatorsPage.Og.Description'),
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/civic.png',
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
    };
  },
  computed: {
    ...mapGetters(['getUserId', 'getUserIsCivicLiker', 'getUserInfo']),

    registerURL() {
      const { from, referrer } = this.$route.query;
      return getOAuthRegisterAPI(from, referrer);
    },
  },
};
</script>

<style lang="scss">
.civic-page .button {
  min-width: 156px !important;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.3);

  transition-property: background-color, box-shadow, transform;
  transition-duration: 0.2s;
  transition-timing-function: ease-in;

  @apply bg-like-cyan-light;
  @apply rounded-8;
  @apply text-like-green;
  @apply text-14;
  @apply text-center;
  @apply font-400;
  @apply m-8;
  @apply p-12;

  &:hover {
    background-color: config('colors.like-cyan');
  }

  &:active {
    box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.3);
    transform: translateX(1px) translateY(2px);

    background-color: config('colors.like-cyan-dark');
  }
}
</style>
