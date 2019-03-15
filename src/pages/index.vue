<template>
  <div>
    <header class="page-header">
      <SiteNavBar class="bg-like-green" />
    </header>
    <main class="page-content">
      <v-app>
        <v-navigation-drawer
          fixed
          app
        >
          <v-list dense>
            <div v-if="!isLoggedIn">
              <a :href="getLoginUrl()">Login</a>
            </div>
            <v-list-tile
              v-for="u in getSubscribedAuthors"
              :key="u"
              @click="setUser(u)"
            >
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ u }}
                  <v-icon @click.stop="unsubscribeUser(u)">
                    remove
                  </v-icon>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="u in getUnsubscribedAuthors"
              :key="u"
              style="color: grey"
              @click="subscribeUser(u)"
            >
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ u }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
        <v-content>
          <div v-if="!isLoggedIn">
            <a :href="getLoginUrl()">Please login your Liker ID for a customized reading experience</a>
          </div>
          <v-container fluid fill-height>
            <v-layout justify-center align-center>
              <v-flex>
                <v-list
                  v-if="list.length"
                  class="max-w-full"
                >
                  <ContentCard
                    v-for="item in list"
                    :key="item.url"
                    :src="item.url"
                    :author="item.user"
                    :cover-src="item.image"
                    :title="item.title"
                    :description="item.description"
                    class="my-16"
                  />
                </v-list>
              </v-flex>
            </v-layout>
          </v-container>
        </v-content>
      </v-app>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getOAuthLoginAPI } from '@/util/api';

import ContentCard from '~/components/ContentCard';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  name: 'Index',
  components: {
    ContentCard,
    SiteNavBar,
  },
  data() {
    return {
      isLoggedIn: !!this.$store.getters.getUserId,
      user: '',
      suggestedList: [],
    };
  },
  computed: {
    ...mapGetters([
      'getUserId',
      'getSubscribedAuthors',
      'getUnsubscribedAuthors',
      'getAllArticles',
      'getUserArticles',
    ]),
    list() {
      if (!this.getSubscribedAuthors) return this.suggestedList.slice(0, 40);
      if (!this.user) {
        let list = this.getAllArticles.slice(0, 40);
        if (list.length < 40)
          list = list.concat(this.suggestedList).slice(0, 40);
        return list;
      }
      return this.getUserArticles(this.user);
    },
  },
  async mounted() {
    try {
      if (this.isLoggedIn) {
        await this.fetchReaderIndex();
        this.getSubscribedAuthors.forEach(u => this.fetchArticle(u));
      }
      this.suggestedList = await this.fetchSuggestedArticles();
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
  },
  methods: {
    ...mapActions([
      'fetchLoginStatus',
      'fetchReaderIndex',
      'fetchArticle',
      'fetchSuggestedArticles',
      'subscribeAuthor',
      'unsubscribeAuthor',
    ]),
    setUser(user) {
      this.user = user;
    },
    subscribeUser(user) {
      this.subscribeAuthor(user);
    },
    unsubscribeUser(user) {
      this.user = undefined;
      this.unsubscribeAuthor(user);
    },
    getLoginUrl() {
      return getOAuthLoginAPI();
    },
  },
};
</script>
