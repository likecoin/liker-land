<template>
  <div class="redirect">
    <h1>Redirecting</h1>
  </div>
</template>

<script>
export default {
  name: 'Redirect',
  data() {
    return {
      user: '',
    };
  },
  async mounted() {
    const authCode = this.$route.query.auth_code;
    await this.$store.dispatch('getOAuthToken', authCode);
    this.$router.push({ name: 'home' });
  },
};
</script>
