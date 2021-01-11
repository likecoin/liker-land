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
            .max-w-phone-min.w-full
              Button(
                v-if="!getUserId"
                :href="registerURL"
                :title="$t('CreatorsPage.CTAButton.Register')"
                size="large"
                :full="true"
              )
              Button(
                v-else-if="!getUserIsCivicLiker"
                :to="{ name: 'civic-from', params: { from: $route.query.referrer } }"
                :title="$t('CreatorsPage.CTAButton.Civic')"
                size="large"
                :full="true"
              )
</template>

<script>
import { mapGetters } from 'vuex';

import Button from '~/components/Button/Button';
import CreatorSetupPage from '~/components/CreatorSetupPage/CreatorSetupPage';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

import { CrispMixinFactory } from '~/mixins/crisp';
import { getOAuthRegisterAPI } from '~/util/api';

export default {
  components: {
    Button,
    CreatorSetupPage,
    PageHeader,
    SiteNavBar,
  },
  middleware: 'authenticated',
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
      return getOAuthRegisterAPI({
        language: this.$i18n.locale,
        from,
        referrer,
      });
    },
  },
};
</script>
