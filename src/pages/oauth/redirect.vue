<template>
  <div class="redirect-page bg-like-green">
    <main class="page-content flex justify-center items-center p-16">
      <div class="text-like-green text-center bg-white rounded w-full max-w-phone mb-32 p-48">
        <div class="text-24">{{ $t('RedirectPage.title') }}</div>
        <LcLoadingIndicator class="text-like-cyan" />
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Redirect',
  computed: {
    ...mapGetters(['getSubscribedAuthors']),
  },
  head() {
    return {
      title: this.$t('RedirectPage.title'),
    };
  },
  async mounted() {
    const { state, auth_code: authCode } = this.$route.query;
    if (authCode && state) {
      await this.getOAuthToken({ authCode, state });
      this.$router.push({ name: 'index' });
    }
  },
  methods: {
    ...mapActions(['getOAuthToken']),
  },
};
</script>
