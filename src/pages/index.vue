<template>
  <div>
    <v-navigation-drawer
      fixed
      app
    >
      <v-list dense>
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
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex>
            <v-list v-if="list.length">
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
            <span v-else-if="isLoggedIn">You haven't like anything yet!</span>
            <a v-else :href="getLoginUrl()">Please login first, then refresh</a>
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
      isLoggedIn: false,
      user: '',
    };
  },
  computed: {
    ...mapGetters(['getSubscribedAuthors', 'getAllArticles']),
    list() {
      if (!this.getSubscribedAuthors) return [];
      if (!this.user) return this.getAllArticles.slice(0, 40);
      return this.$store.state.articles[this.user];
    },
  },
  async mounted() {
    this.isLoggedIn = await this.fetchLoginStatus();
    if (this.isLoggedIn) {
      try {
        await this.fetchUser();
        this.getSubscribedAuthors.forEach(u => this.fetchArticle(u));
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    }
  },
  methods: {
    ...mapActions(['fetchLoginStatus', 'fetchUser', 'fetchArticle']),
    setUser(user) {
      this.user = user;
    },
    getLoginUrl() {
      return getOAuthLoginAPI();
    },
  },
};
</script>
