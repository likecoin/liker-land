<template>
  <div class="flex flex-col justify-center flex-grow">
    <template v-if="isLoading">
      <Label :text="$t('settings_email_verify_verifying')" align="center" />
      <ProgressIndicator class="self-center mt-[16px]" />
    </template>
    <Label v-else-if="walletIsEmailVerified" :text="$t('settings_email_verify_verified')" />
    <ButtonV2
      class="self-center mt-[16px]"
      :text="$t('settings_email_verify_verified_back_button')"
      preset="secondary"
      @click="handleClickBack"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import walletMixin from '~/mixins/wallet';

export default {
  name: 'SettingsEmailVerifyPage',
  mixins: [walletMixin],
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    ...mapGetters(['walletIsEmailVerified']),
    token() {
      return this.$route.params.token;
    },
  },
  async mounted() {
    try {
      this.isLoading = true;
      if (!this.walletHasLoggedIn) {
        await this.walletSignIn();
      }
      if (!this.walletIsEmailVerified) {
        await this.walletVerifyEmail(this.token);
      }
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    ...mapActions(['walletVerifyEmail']),
    handleClickBack() {
      this.$router.push({ name: 'settings' });
    },
  },
};
</script>
