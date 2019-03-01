<template>
  <div class="redirect">
    <h1>Redirecting</h1>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Redirect',
  computed: {
    ...mapGetters(['getSubscribedAuthors']),
  },
  async mounted() {
    const authCode = this.$route.query.auth_code;
    if (authCode) await this.getOAuthToken(authCode);
    this.$router.push({ name: 'index' });
  },
  methods: {
    ...mapActions(['getOAuthToken']),
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
