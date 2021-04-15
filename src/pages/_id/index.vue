<template lang="pug">
  mixin CTAButton
    Button(v-bind="ctaButtonProps" @click="onClickCTAButton")&attributes(attributes)

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
                :avatar-url="creator.avatar"
                :avatar-size="88"
                :is-avatar-outlined="isCivicLikerCreator"
              )

              .mt-16.text-like-cyan-gray ID: {{ creatorLikerID }}
              .mt-4.text-30.font-600.text-like-cyan.text-center {{ creator.displayName }}

              .whitespace-pre-wrap.mt-12.text-white.text-14.max-w-phone-min.leading-1_5(
                v-if="creator.creatorPitch"
              )
                | {{ creator.creatorPitch }}

              .user-info-panel__actions(v-if="!isSelf")
                +CTAButton
                ButtonGroup
                  Button(
                    preset="translucent-dark"
                    :title="$t(getIsFollowedAuthor(creatorLikerID) ? 'unfollow' : 'follow')"
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

            footer.user-info-panel__footer.user-info-panel__footer--desktop(v-if="isCivicLikerCreator")
              .px-24.py-16
                +CivicLikerSinceLabel.px-4

            footer.user-info-panel__footer.user-info-panel__footer--mobile.mt-16.mx-auto(v-if="isCivicLikerCreator")
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
          +CTAButton.user-portfolio-page__top-cta(v-if="!isSelf")

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
          SuperLikeContentGrid(
            v-if="isLoading || activeItems.length > 0"
            :key="tab"
            :preset="tab === 'works' ? 'work' : 'default'"
            :contents="activeItems"
            :is-loading="isLoading"
          )
            template(v-if="isSelf" #append)
              PortfolioEmptyTipsForCreator.rounded-8.border.border-gray-e6.p-32(
                :preset="tab"
                :is-civic-liker="getUserIsCivicLiker"
              )
          PortfolioEmptyView.mb-48(
            v-else
            :preset="tab"
            :is-civic-liker="getUserIsCivicLiker"
            :is-show-tips-for-creator="isSelf"
          )

    BaseDialog(
      v-if="!isSelf"
      :is-show="isShowCivicWelcome"
      content-container-class="mt-64 rounded-8 overflow-hidden phone:rounded-none"
      @click-outside="isShowCivicWelcome = false"
    )
      CivicLikerWelcomeView(
        :price="supportingAmount"
        :price-emoji="supportingEmoji"
        :referrer-avatar-url="creator.avatar"
        :referrer-display-name="creator.displayName"
        :is-referrer-civic-liker="isCivicLikerCreator"
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
          AppDownloadBadges.pb-24(:from="creatorLikerID")
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import {
  getUserMinAPI,
  getFetchUserSuperLikeAPI,
  getCivicSupportingUserAPI,
  getOgImage,
} from '~/util/api';
import { getPriceEmoji } from '~/util/civic';
import { getLikeCoURL } from '~/util/links';
import { checkUserNameValid } from '~/util/user';

import { CrispMixinFactory } from '~/mixins/crisp';

import AppDownloadBadges from '~/components/AppDownloadBadges/AppDownloadBadges';
import BaseDialog from '~/components/BaseDialog';
import Button from '~/components/Button/Button';
import ButtonGroup from '~/components/Button/ButtonGroup';
import CivicLikerWelcomeView from '~/components/CivicLikerWelcome/CivicLikerWelcomeView';
import Collapse from '~/components/Collapse/Collapse';
import PortfolioEmptyView from '~/components/PortfolioEmptyView/PortfolioEmptyView';
import PortfolioEmptyTipsForCreator from '~/components/PortfolioEmptyView/PortfolioEmptyTipsForCreator';
import Identity from '~/components/Identity/Identity';
import PageHeader from '~/components/PageHeader';
import SuperLikeContentGrid from '~/components/SuperLikeContentGrid';
import SiteNavBar from '~/components/SiteNavBar';

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
    CivicLikerWelcomeView,
    Collapse,
    Identity,
    PageHeader,
    PortfolioEmptyView,
    PortfolioEmptyTipsForCreator,
    SuperLikeContentGrid,
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
    ...mapGetters([
      'getUserId',
      'getIsFollowedAuthor',
      'getUserIsCivicLiker',
      'getUserIsCivicLikerV2',
    ]),

    creatorLikerID() {
      return this.creator.user;
    },
    likePayURL() {
      return getLikeCoURL(`/${this.creatorLikerID}`);
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
      return dateFormat(new Date(this.creator.civicLikerSince), 'YYYY/MM/DD');
    },
    isLoading() {
      return (
        LOADING_STATES.includes(this.itemsState) ||
        LOADING_STATES.includes(this.worksState)
      );
    },
    isSelf() {
      return this.creatorLikerID === this.getUserId;
    },
    isCivicLikerCreator() {
      return !!(
        this.creator.isCivicLikerTrial || this.creator.isSubscribedCivicLiker
      );
    },
    supportingAmount() {
      return this.civicSupport.quantity * 5;
    },
    supportingEmoji() {
      return getPriceEmoji(this.supportingAmount);
    },
    isSupportingCreator() {
      return this.supportingAmount > 0;
    },
    ctaToRoute() {
      if (this.isSupportingCreator) {
        return undefined;
      }
      return {
        name: 'id-civic',
        params: { id: this.creatorLikerID },
        query: { utm_source: 'portfolio' },
      };
    },
    ctaButtonProps() {
      const isSupporting = this.isSupportingCreator;
      return {
        preset: isSupporting ? 'special' : 'primary',
        title: this.$t(
          `PortfolioPage.CTAButton.${isSupporting ? 'Active' : 'Inactive'}`
        ),
        to: this.ctaToRoute,
      };
    },
  },
  async asyncData({ store, route, query, $api, error }) {
    const { id } = route.params;
    if (id && checkUserNameValid(id)) {
      try {
        const [creator, civicSupport] = await Promise.all([
          $api.$get(getUserMinAPI(id, { types: ['creator'] })),
          $api
            .$get(getCivicSupportingUserAPI(id))
            .catch(() => ({ quantity: 0 })),
        ]);
        return {
          creator,
          civicSupport,
          isShowCivicWelcome:
            store.getters.getUserId &&
            civicSupport &&
            civicSupport.quantity > 0 &&
            query.civic_welcome === '1',
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
      name: this.creator.displayName.trim(),
    });
    const image = getOgImage(this.creator.user);
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
          hid: 'og:image',
          property: 'og:image',
          content: image,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
    };
  },
  mounted() {
    this.refreshBookmarkList();
    this.fetchReaderIndex();
    Promise.all([this.fetchCreatorWorks(), this.fetchCreatorSuperLikes()]).then(
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

    async fetchCreatorWorks({ before } = {}) {
      try {
        this.worksState = before ? 'pending-more' : 'pending';
        const { list } = await this.$api.$get(
          getFetchUserSuperLikeAPI(this.creatorLikerID),
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
    async fetchCreatorSuperLikes({ before } = {}) {
      try {
        this.itemsState = before ? 'pending-more' : 'pending';
        const { list } = await this.$api.$get(
          getFetchUserSuperLikeAPI(this.creatorLikerID),
          { params: { before, limit: ITEM_PER_FETCH } }
        );
        this.items.push(
          ...list.filter(item => item.user !== this.creatorLikerID)
        );
        this.itemsState = list.length < ITEM_PER_FETCH ? 'done-more' : 'done';
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.itemsState = 'error';
      }
    },
    onScroll() {
      const { innerHeight: windowHeight, pageYOffset: scrollY } = window;
      const { scrollHeight } = document.documentElement;
      if (scrollY >= scrollHeight - windowHeight * 2) {
        if (this.tab === 'works') {
          if (this.worksState === 'done') {
            this.fetchCreatorWorks({
              before: this.works[this.works.length - 1].ts,
            });
          }
        } else if (this.itemsState === 'done') {
          this.fetchCreatorSuperLikes({
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
      const id = this.creatorLikerID;
      if (this.getIsFollowedAuthor(id)) {
        await this.unfollowAuthor(id);
      } else {
        await this.followAuthor(id);
      }
    },
    onClickCTAButton() {
      if (this.isSupportingCreator) {
        this.isShowCivicWelcome = true;
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
