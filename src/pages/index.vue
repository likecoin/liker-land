<template lang="pug">
  // - CTA mixin
  mixin cta(position)
    .text-center.bg-like-green.px-16&attributes(attributes)
      .text-like-cyan.text-30.font-200.mb-16 {{ ctaSlogan }}

      NuxtLink(
        v-if="getUserId"
        :class=`{
          'btn btn--outlined btn--dark mx-0': true,
          'mb-0': !getUserId,
        }`
        :to="{ name: 'civic' }"
      )
        template(v-if="getUserIsCivicLikerTrial")
          | {{ $t('CivicLikerCTA.button.upgrade') }}
        template(v-else)
          | {{ $t('CivicLikerCTA.button.register') }}

      template(v-else)
        a(
          class="btn btn--outlined btn--dark"
          :href="getOAuthRegisterAPI"
          @click=`onClickLogEvent('Register', 'RegisterSignUp', 'RegisterSignUp(index ${position})', 1)`
        ) {{ $t('signUp') }}
        br
        a(
          class="btn btn--plain btn--dark text-12 m-0 p-0"
          :href="getOAuthLoginAPI"
          @click=`onClickLogEvent('Register', 'RegisterSignIn', 'RegisterSignIn(index ${position})', 1)`
        ) {{ $t('signIn') }}

  // - Page
  .home-page
    PageHeader.home-page__header(:is-floatable="true")
      template(v-slot="{ isFloating }")
        SiteNavBar

        +cta('header')(
          v-if="!isFloating && (!getUserId || !getUserIsCivicLiker)"
          class="pb-20"
        )

        TabBar
          TabBarItem(
            v-if="!getUserId"
            :is-active="$route.name === 'index'"
            :to="{ name: 'index' }"
          )
            SuperLikeIcon

          TabBarItem(
            v-if="getUserId"
            :is-active="$route.name === 'index-following'"
            :to="{ name: 'index-following' }"
          )
            SuperLikeIcon

          TabBarItem(
            v-if="getUserId"
            :is-active="$route.name === 'index-bookmarks'"
            :to="{ name: 'index-bookmarks' }"
          )
            BookmarkIcon

    main.page-content
      NuxtChild

    .relative(v-if="!getUserId")
      +cta('footer')(
        v-if="!getUserId || !getUserIsCivicLiker"
        class="absolute w-full pt-32 pb-40"
      )

</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getOAuthLoginAPI, getOAuthRegisterAPI } from '@/util/api';
import { logTrackerEvent } from '~/util/EventLogger';

import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';
import TabBar from '~/components/TabBar';
import TabBarItem from '~/components/TabBarItem';

import BookmarkIcon from '~/assets/icons/bookmarks.svg';
import SuperLikeIcon from '~/assets/icons/super-like.svg';

export default {
  name: 'Index',
  components: {
    PageHeader,
    SiteNavBar,
    TabBar,
    TabBarItem,

    BookmarkIcon,
    SuperLikeIcon,
  },
  computed: {
    ...mapGetters([
      'getUserId',
      'getUserIsCivicLiker',
      'getUserIsCivicLikerTrial',
      'getUserBookmarks',
    ]),
    getOAuthLoginAPI,

    getOAuthRegisterAPI() {
      const { from, referrer } = this.$route.query;
      return getOAuthRegisterAPI(from, referrer);
    },
    ctaSlogan() {
      if (this.getUserId) {
        if (this.getUserIsCivicLiker) {
          return '';
        }
        if (this.getUserIsCivicLikerTrial) {
          return this.$t('CivicLikerCTA.slogan.upgrade');
        }
        return this.$t('CivicLikerCTA.slogan.register');
      }
      return this.$t('SignUpSignInCTA.slogan');
    },
  },
  mounted() {
    this.fetchSharedContent();
  },
  methods: {
    logTrackerEvent,
    ...mapActions(['refreshBookmarkList']),
    async fetchSharedContent() {
      try {
        const promises = [];
        if (this.getUsreId && !this.getUserBookmarks.length)
          promises.push(this.refreshBookmarkList());
        await Promise.all(promises);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    },
    onClickLogEvent(...args) {
      logTrackerEvent(this, ...args);
    },
  },
};
</script>

<style lang="scss">
.home-page {
  @apply bg-white;

  &__header {
    .site-nav-bar {
      @apply text-white;

      @apply bg-like-green;
    }

    @media screen and (min-width: config('screens.desktop.min')) {
      &.page-header--floating {
        .site-nav-bar {
          @apply relative;
          @apply z-1;

          @apply bg-transparent;

          @apply pointer-events-none;

          > * {
            @apply pointer-events-auto;
          }
        }

        .tab-bar {
          @apply absolute;
          @apply pin;
        }
      }
    }
  }

  .page-content {
    @apply relative;

    @apply bg-gray-f7;

    @apply flex-grow;

    @apply w-full;
    @apply max-w-phone;

    @apply mx-auto;
  }
}
</style>
