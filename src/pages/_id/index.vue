<template lang="pug">
  .user-portfolio-page
    PageHeader
      template
        SiteNavBar.text-white.bg-like-green.pb-32

    main.page-content
      aside.page-content__left
        .user-portfolio-page__user-info-panel-wrapper
          .user-info-panel
            header
              Identity(
                :avatar-url="user.avatar"
                :avatar-size="88"
                :is-avatar-outlined="isUserCivicLiker"
              )

              .mt-16.text-like-cyan-gray ID: {{ user.user }}
              .mt-4.text-30.font-600.text-like-cyan.text-center {{ user.displayName }}

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

            mixin CivicLikerSinceLabel
              .text-12.text-center.text-gray-9b.font-200
                | {{ $t('PortfolioPage.CivicLikerSince', { date: formattedCivicLikerSince }) }}

            footer.user-info-panel__footer.user-info-panel__footer--desktop(v-if="isUserCivicLiker")
              .px-24.py-16
                +CivicLikerSinceLabel.px-4

            footer.user-info-panel__footer.user-info-panel__footer--mobile.mt-16.mx-auto(v-if="isUserCivicLiker")
              .px-24.py-16.flex.justify-between.items-center(@click="isShowAbout = !isShowAbout")
                span.text-14.text-gray-4a.font-200 {{ $t('PortfolioPage.About') }}
                svg.text-gray-9b(
                  width="9.82"
                  height="5.41"
                  viewBox="0 0 9.82 5.41"
                  :style="{ transform: `rotateZ(${ isShowAbout ? '180' : '0'}deg)`, transition: 'transform 0.2s ease' }"
                )
                  path(
                    d="M0,0,3.5,3,7,0"
                    transform="translate(1.41 1.41)"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  )
              Collapse(:is-show="isShowAbout")
                .p-24
                  +CivicLikerSinceLabel

      .page-content__right
        header.user-portfolio-page__top-nav
          Button.user-portfolio-page__top-cta(
            preset="primary"
            :title="$t('PortfolioPage.BecomeCivicLiker')"
            :to="{ name: 'civic', query: { from: user.user } }"
          )

          nav.user-portfolio-page__tab-bar(v-if="items.length > 0 && works.length > 0")
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
          ClientOnly(v-if="isLoading || activeItems.length > 0")
            Stack(
              :key="tab"
              ref="stack"
              :column-min-width="288"
              :column-max-width="300"
              :gutter-width="16"
              :gutter-height="24"
            )
              template(v-if="isLoading")
                StackItem(v-for="i in 10" :key="`${i}`")
                  Card
                    Placeholder.h-16(:class="`w-${i % 3 + 2}/5`")
                    Placeholder.h-16.mt-12.w-full
                    Placeholder.h-16.mt-8.w-full(v-if="i % 2")
                    Placeholder.h-16.mt-8.w-full(v-if="i % 3")
                    Placeholder.h-16.mt-8(:class="`w-${i % 3 + 1}/5`")
              template(v-else)
                StackItem(v-for="(item, i) in activeItems" :key="item.superLikeID")
                  SuperLikeContentCard(
                    :preset="tab === 'works' ? 'work' : 'default'"
                    :referrer="item.referrer"
                    :author-id="item.user"
                    :super-like-id="item.superLikeID"
                    :super-like-short-id="item.superLikeShortID"
                    :timestamp="item.ts"
                    @fetched="updateLayout"
                    @image-loaded="updateLayout"
                  )
          .p-24.text-gray-e6.text-36.font-600.text-center(v-else)
            | {{ $t('PortfolioPage.EmptyLabel') }}

    BaseDialog(
      :is-show="isShowCivicWelcome"
      content-container-class="mt-64 rounded-8 overflow-hidden phone:rounded-none"
      @click-outside="isShowCivicWelcome = false"
    )
      CivicLikerWelcomeView(
        :price="civicSupport.quantity * 5"
        :referrer-avatar-url="user.avatar"
        :referrer-display-name="user.displayName"
        :is-referrer-civic-liker="isUserCivicLiker"
      )
        template(#header)
          Button.bg-like-green.text-like-cyan-light.rounded-full.shadow-8(
            @click="isShowCivicWelcome = false"
          )
            svg.m-12(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.73 14.73" width="16")
              g(fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2")
                line(x1="1" y1="1" x2="13.73" y2="13.73")
                line(x1="1" y1="13.73" x2="13.73" y2="1")

        template(#footer)
          AppDownloadBadges.pb-24(:from="user.user")
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import {
  getUserMinAPI,
  getFetchUserSuperLikeAPI,
  getCivicSupportingUserAPI,
} from '~/util/api';
import { getLikeCoURL } from '~/util/links';
import { checkUserNameValid } from '~/util/user';

import AppDownloadBadges from '~/components/AppDownloadBadges/AppDownloadBadges';
import BaseDialog from '~/components/BaseDialog';
import Button from '~/components/Button/Button';
import ButtonGroup from '~/components/Button/ButtonGroup';
import Card from '~/components/Card/Card';
import CivicLikerWelcomeView from '~/components/CivicLikerWelcome/CivicLikerWelcomeView';
import Collapse from '~/components/Collapse/Collapse';
import Identity from '~/components/Identity/Identity';
import PageHeader from '~/components/PageHeader';
import Placeholder from '~/components/Placeholder/Placeholder';
import SuperLikeContentCard from '~/components/SuperLikeContentCard';
import SiteNavBar from '~/components/SiteNavBar';

import { CrispMixinFactory } from '~/mixins/crisp';

const ITEM_PER_FETCH = 20;
const LOADING_STATES = ['idle', 'pending'];

function filterItems(inputItems) {
  const items = [];
  const urls = new Set();
  inputItems.forEach(item => {
    if (!urls.has(item.referrer)) {
      items.push(item);
      urls.add(item.referrer);
    }
  });
  return items;
}

export default {
  layout: 'desktop',
  components: {
    AppDownloadBadges,
    BaseDialog,
    Button,
    ButtonGroup,
    Card,
    CivicLikerWelcomeView,
    Collapse,
    Identity,
    PageHeader,
    Placeholder,
    SuperLikeContentCard,
    SiteNavBar,
  },
  mixins: [CrispMixinFactory({ isBootAtMounted: false })],
  data() {
    return {
      items: [],
      itemsState: 'idle',
      works: [],
      worksState: 'idle',
      tab: 'works',
      isShowAbout: false,
    };
  },
  computed: {
    ...mapGetters(['getUserId', 'getIsFollowedAuthor']),

    likePayURL() {
      return getLikeCoURL(`/${this.user.user}`);
    },
    filteredWorks() {
      return filterItems(this.works);
    },
    filteredItems() {
      return filterItems(this.items);
    },
    activeItems() {
      return this.tab === 'works' ? this.filteredWorks : this.filteredItems;
    },
    formattedCivicLikerSince() {
      return dateFormat(new Date(this.user.civicLikerSince), 'YYYY/MM/DD');
    },
    isLoading() {
      return (
        LOADING_STATES.includes(this.itemsState) ||
        LOADING_STATES.includes(this.worksState)
      );
    },
    isUserCivicLiker() {
      return !!(
        this.user.isCivicLikerTrial || this.user.isSubscribedCivicLiker
      );
    },
  },
  async asyncData({ route, query, $api, error }) {
    const { id } = route.params;
    if (id && checkUserNameValid(id)) {
      try {
        const [user, civicSupport] = await Promise.all([
          $api.$get(getUserMinAPI(id)),
          $api
            .$get(getCivicSupportingUserAPI(id))
            .catch(() => ({ quantity: 0 })),
        ]);
        return {
          user,
          civicSupport,
          isShowCivicWelcome: query.civic_welcome === '1',
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
  head() {
    const title = this.$t('PortfolioPage.Og.Title', {
      name: this.user.displayName.trim(),
    });
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.user.avatar,
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
    };
  },
  mounted() {
    this.refreshBookmarkList();
    this.fetchReaderIndex();
    Promise.all([this.fetchUserWorks(), this.fetchUserSuperLikes()]).then(
      () => {
        if (this.works.length === 0 && this.items.length > 0) {
          this.tab = 'superlikes';
        }
      }
    );
    window.addEventListener('scroll', this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    ...mapActions([
      'fetchReaderIndex',
      'refreshBookmarkList',
      'followAuthor',
      'unfollowAuthor',
    ]),

    async fetchUserWorks({ before } = {}) {
      try {
        this.worksState = before ? 'pending-more' : 'pending';
        const { list } = await this.$api.$get(
          getFetchUserSuperLikeAPI(this.user.user),
          { params: { before, limit: ITEM_PER_FETCH, filter: 'self' } }
        );
        this.works.push(...list);
        this.worksState = list.length < ITEM_PER_FETCH ? 'done-more' : 'done';
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.worksState = 'error';
      }
    },
    async fetchUserSuperLikes({ before } = {}) {
      try {
        this.itemsState = before ? 'pending-more' : 'pending';
        const { list } = await this.$api.$get(
          getFetchUserSuperLikeAPI(this.user.user),
          { params: { before, limit: ITEM_PER_FETCH } }
        );
        this.items.push(...list);
        this.itemsState = list.length < ITEM_PER_FETCH ? 'done-more' : 'done';
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.itemsState = 'error';
      }
    },
    updateLayout() {
      if (this.$refs.stack) {
        this.$refs.stack.reflow();
      }
    },
    onScroll() {
      const { innerHeight: windowHeight, pageYOffset: scrollY } = window;
      const { scrollHeight } = document.documentElement;
      if (scrollY >= scrollHeight - windowHeight * 2) {
        if (this.tab === 'works') {
          if (this.worksState === 'done') {
            this.fetchUserWorks({
              before: this.works[this.works.length - 1].ts,
            });
          }
        } else if (this.itemsState === 'done') {
          this.fetchUserSuperLikes({
            before: this.items[this.items.length - 1].ts,
          });
        }
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
$desktop-width: 1000px;

.user-portfolio-page {
  .page-content {
    width: 100%;
    max-width: 1340px;
    margin: 0 auto;

    @media screen and (min-width: $desktop-width) {
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
    }
  }

  .user-info-panel {
    @media screen and (min-width: $desktop-width) {
      overflow: hidden;

      @apply rounded-8;
    }

    > header {
      display: flex;
      flex-direction: column;
      align-items: center;

      padding: 32px 40px 28px;

      @apply bg-like-green;
    }

    &__footer {
      background-color: white;

      &--desktop {
        @media screen and (max-width: #{$desktop-width - 1px}) {
          display: none;
        }
      }

      &--mobile {
        max-width: 288px;

        @apply rounded-8;

        @media screen and (min-width: $desktop-width) {
          display: none;
        }
      }
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

  @media screen and (max-width: #{$desktop-width - 1px}) {
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
