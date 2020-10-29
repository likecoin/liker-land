<template lang="pug">
  .user-portfolio-page
    PageHeader
      template
        SiteNavBar.text-white.bg-like-green

    main.page-content
      aside.page-content__left
        .user-portfolio-page__user-info-panel-wrapper
          .user-info-panel
            header
              Identity(
                :avatar-url="user.avatar"
                :avatar-size="88"
                :is-avatar-outlined="user.isCivicLikerTrial || user.isSubscribedCivicLiker"
              )

              .mt-16.text-like-cyan-gray ID: {{ user.user }}
              .mt-4.text-30.font-600.text-like-cyan {{ user.displayName }}

              .user-info-panel__actions
                Button(
                  preset="primary"
                  :title="$t('PortfolioPage.BecomeCivicLiker')"
                  :to="{ name: 'civic', query: { from: user.user } }"
                )
                ButtonGroup
                  Button(
                    preset="translucent-dark"
                    :title="$t(getIsFollowedAuthor(user.user) ? 'unfollow' : 'follow')"
                    @click="onToggleFollow"
                  )
                  Button(
                    preset="translucent-dark"
                    :title="$t('PortfolioPage.LikePay')"
                    :href="likePayURL"
                    target="_blank"
                  )

      .page-content__right
        header.user-portfolio-page__top-nav
          Button.user-portfolio-page__top-cta(
            preset="primary"
            :title="$t('PortfolioPage.BecomeCivicLiker')"
            :to="{ name: 'civic', query: { from: user.user } }"
          )

          nav.user-portfolio-page__tab-bar
            Button.user-portfolio-page__tab-bar-item(
              :class="{ 'user-portfolio-page__tab-bar-item--active': tab === 'works' }"
              :title="$t('PortfolioPage.Tab.Works')"
              preset="translucent-light"
              @click="tab = 'works'"
            )
            Button.user-portfolio-page__tab-bar-item(
              :class="{ 'user-portfolio-page__tab-bar-item--active': tab === 'all' }"
              :title="$t('PortfolioPage.Tab.SuperLikes')"
              preset="translucent-light"
              @click="tab = 'all'"
            )

        .user-portfolio-page__grid
          no-ssr
            Stack(
              :key="tab"
              ref="stack"
              :column-min-width="288"
              :column-max-width="300"
              :gutter-width="16"
              :gutter-height="24"
            )
              StackItem(v-for="(item, i) in filteredItems" :key="item.superLikeID")
                SuperLikeContentCard(
                  :preset="tab === 'works' ? 'work' : 'default'"
                  :referrer="item.referrer"
                  :author-id="item.user"
                  :super-like-id="item.superLikeID"
                  :super-like-short-id="item.superLikeShortID"
                  :timestamp="item.ts"
                  @fetched="onFetched"
                )
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getUserMinAPI, getFetchUserSuperLikeAPI } from '~/util/api';
import { getLikeCoURL } from '~/util/links';
import { checkUserNameValid } from '~/util/user';

import Button from '~/components/Button/Button';
import ButtonGroup from '~/components/Button/ButtonGroup';
import Identity from '~/components/Identity/Identity';
import PageHeader from '~/components/PageHeader';
import SuperLikeContentCard from '~/components/SuperLikeContentCard';
import SiteNavBar from '~/components/SiteNavBar';

import { CrispMixinFactory } from '~/mixins/crisp';

export default {
  layout: 'desktop',
  components: {
    Button,
    ButtonGroup,
    Identity,
    PageHeader,
    SuperLikeContentCard,
    SiteNavBar,
  },
  mixins: [CrispMixinFactory({ isBootAtMounted: false })],
  data() {
    return {
      items: [],
      tab: 'works',
    };
  },
  computed: {
    ...mapGetters(['getUserId', 'getIsFollowedAuthor']),

    likePayURL() {
      return getLikeCoURL(`/${this.user.user}`);
    },

    works() {
      return this.items.filter(item => item.user === this.user.user);
    },
    filteredItems() {
      return this.tab === 'works' ? this.works : this.items;
    },
  },
  async asyncData({ route, $axios, error }) {
    const { id } = route.params;
    if (id && checkUserNameValid(id)) {
      try {
        const user = await $axios.$get(getUserMinAPI(id));
        return {
          user,
        };
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
    this.refreshBookmarkList();
    this.fetchUserSuperLikes();
  },
  methods: {
    ...mapActions(['refreshBookmarkList', 'followAuthor', 'unfollowAuthor']),

    async fetchUserSuperLikes() {
      const { list } = await this.$axios.$get(
        getFetchUserSuperLikeAPI(this.user.user)
      );
      this.items = list;
    },
    onFetched() {
      if (this.$refs.stack) {
        this.$refs.stack.reflow();
      }
    },
    async onToggleFollow() {
      if (!this.getUserId) {
        this.$nuxt.error({
          message: 'LOGIN_NEEDED_TO_FOLLOW_AUTHOR',
          statusCode: 401,
        });
        return;
      }
      const { user: id } = this.user;
      if (this.getIsFollowedAuthor(id)) {
        await this.unfollowAuthor(id);
      } else {
        await this.followAuthor(id);
      }
    },
  },
};
</script>

<style lang="scss">
$page-padding-top: 48px;
$action-width: 224px;

.user-portfolio-page {
  .page-content {
    width: 100%;
    max-width: 1340px;
    margin: 0 auto;

    @media screen and (min-width: 1000px) {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;

      padding: 32px;
      padding-top: 0;

      &__left {
        width: 100%;
        max-width: 304px;

        margin-right: 40px;

        position: sticky;
        top: 0;

        padding-top: $page-padding-top;
      }

      &__right {
        padding: 0;
        padding-top: $page-padding-top;

        flex-grow: 1;
      }

      .user-info-panel {
        overflow: hidden;

        @apply rounded-8;
      }
    }
  }

  .user-info-panel {
    > header {
      display: flex;
      flex-direction: column;
      align-items: center;

      padding: 32px 40px 28px;

      @apply bg-like-green;
    }

    &__actions {
      width: 100%;
      max-width: $action-width;
      margin-top: 24px;

      .button {
        width: 100%;

        > div {
          width: inherit;
        }
      }

      > .button-group {
        margin-top: 12px;
      }
    }
  }

  &__top-nav {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    > .button > div {
      min-width: $action-width;
    }
  }

  &__tab-bar {
    display: flex;
    width: 100%;

    border-bottom: 1px solid #e6e6e6;

    &-item {
      transition: border-color 0.5s ease;

      &#{&} {
        > div {
          min-width: 100px;

          border-bottom-right-radius: 8px;
          border-bottom-left-radius: 8px;
        }

        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      }

      &:not(#{&}--active) {
        border-bottom: 3px solid #50e3c200;
      }

      &#{&}--active {
        border-bottom: 3px solid #50e3c2;
      }
    }
  }

  &__grid {
    margin-top: 24px;
  }

  @media screen and (max-width: 999px) {
    & &__top-cta {
      display: none;
    }

    & &__tab-bar {
      margin-top: 16px;
      justify-content: center;
    }

    & &__grid {
      margin: 16px;
    }

  }
}
</style>
