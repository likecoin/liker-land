<template lang="pug">
  .civic-page
    PageHeader
      template
        SiteNavBar.text-like-green

    CivicLikerPageWithCreator.page-content(
      v-if="creator"
      :creators="creators"
      @subscribe="subscribe"
    )
    CivicLikerPageWithoutCreator(
      v-else
      :creators="creators"
      :contents="contents"
    )
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import {
  getUserMinAPI,
  getFetchPersonalSuggestArticlesApi,
  getLikerOgImage,
} from '~/util/api';
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
  data() {
    return {
      contents: [],
    };
  },
  computed: {
    ...mapGetters([
      'getUserId',
      'getSuggestedArticles',
      'getArticleInfoByReferrer',
      'getUserInfoById',
    ]),
    filteredContents() {
      return this.contents.filter(({ user }) => !!user);
    },
    creators() {
      const creators = this.filteredContents.map(
        ({ user }) => this.getUserInfoById(user) || { user }
      );
      // Add given creator to the beginning of the creators list
      if (this.creator) {
        creators.unshift(this.creator);
      }
      return creators.slice(0, 6);
    },
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
  mounted() {
    this.fetchContents();
  },
  methods: {
    ...mapActions([
      'fetchSuggestedArticles',
      'fetchArticleInfo',
      'fetchUserInfo',
    ]),

    async fetchPersonalContents() {
      const { list } = await this.$api.$get(
        getFetchPersonalSuggestArticlesApi()
      );
      return list.map(referrer => ({ referrer }));
    },

    async fetchContents() {
      // Fetch suggested contents
      const promises = [this.fetchSuggestedArticles()];
      if (this.getUserId) {
        promises.push(this.fetchPersonalContents());
      }
      const [, personalContents = []] = await Promise.all(promises);
      const contents = personalContents.concat(this.getSuggestedArticles);

      // Fetch contents info by URL to retrieve creator ID
      const contentsWithInfo = await Promise.all(
        contents.map(({ referrer }) => {
          const info = this.getArticleInfoByReferrer(referrer);
          if (!info) {
            return this.fetchArticleInfo(referrer).catch(() => ({}));
          }
          return Promise.resolve(info);
        })
      );

      // Grab maximum 6 suggested contents from different creators
      const creatorIDsSet = new Set();
      const suggestedContents = [];
      for (let i = 0; i < contentsWithInfo.length; i += 1) {
        const content = contentsWithInfo[i];
        const creatorID = content.user;
        if (!creatorIDsSet.has(creatorID)) {
          creatorIDsSet.add(creatorID);
          suggestedContents.push(content);
        }
        if (suggestedContents.length >= 6) {
          break;
        }
      }

      // Rename key `url` to `referrer` for component input
      this.contents = suggestedContents.map(
        ({ url: referrer, ...content }) => ({ ...content, referrer })
      );

      // Trigger fetching creators info
      this.contents.forEach(({ user: creatorID }) => {
        if (!this.getUserInfoById(creatorID)) {
          this.fetchUserInfo(creatorID).catch(() => ({}));
        }
      });
    },

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
    let title, description, image;
    if (this.creator) {
      const name = this.creator.displayName.trim();
      title = this.$t('CivicEntryPage.Og.Title', { name });
      description =
        this.creator.creatorPitch || this.$t('CreatorPitch.Default');
      image = getLikerOgImage(this.creator.user);
    } else {
      title = this.$t('CivicPage.Og.Title');
      description = this.$t('CivicPage.Og.Description');
      image = 'https://liker.land/images/og/civic-v2.png';
    }
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
    };
  },
};
</script>
