<template>
  <div>
    <v-navigation-drawer
      fixed
      app
    >
      <v-list dense>
        <v-list-tile
          v-for="user in $store.state.users"
          :key="user"
          @click="setUser(user)"
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ user }}</v-list-tile-title>
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
            <a v-else :href="getLoginUrl()" target="blank">Please login first, then refresh</a>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { OAUTH_LOGIN_URL } from '@/constant';

export default {
  name: 'Home',
  computed: {
    list() {
      if (!this.$store.state.users) return [];
      if (!this.user) return this.$store.getters.getAllArticles.slice(0, 40);
      return this.$store.state.articles[this.user];
    },
  },
  data() {
    return {
      user: '',
    };
  },
  async mounted() {
    await this.$store.dispatch('loadAuthInfo');
    await this.$store.dispatch('fetchUser');
    this.$store.state.users.forEach(u => this.$store.dispatch('fetchArticle', u));
  },
  methods: {
    setUser(user) {
      this.user = user;
    },
    getLoginUrl() {
      return OAUTH_LOGIN_URL;
    },
  },
};
</script>
