<template>
  <div>
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
            <v-list-tile-title>{{ u }}</v-list-tile-title>
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
            <v-list>
              <v-list-tile
                v-for="item in list"
                :key="item.url"
                :href="item.url"
                target="blank"
              >
                <v-list-tile-avatar>
                  <img v-if="item.image" :src="item.image">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }} - {{ item.user }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.description }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getOAuthLoginAPI } from '@/util/api';

export default {
  name: 'Index',
  data() {
    return {
      isLoggedIn: !!this.$store.getters.getUserId,
      user: '',
      suggestedList: [],
    };
  },
  computed: {
    ...mapGetters(['getUserId', 'getSubscribedAuthors', 'getAllArticles']),
    list() {
      if (!this.getSubscribedAuthors) return this.suggestedList.slice(0, 40);
      if (!this.user) {
        let list = this.getAllArticles.slice(0, 40);
        if (list.length < 40)
          list = list.concat(this.suggestedList).slice(0, 40);
        return list;
      }
      return this.$store.state.articles[this.user];
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
    ]),
    setUser(user) {
      this.user = user;
    },
    getLoginUrl() {
      return getOAuthLoginAPI();
    },
  },
};
</script>
