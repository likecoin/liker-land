<template>
  <div class="flex flex-col justify-center flex-grow">
    <template v-if="isLoading">
      <Label :text="$t('settings_email_verify_verifying')" align="center" />
      <ProgressIndicator class="self-center mt-[16px]" />
    </template>
    <Label v-else-if="isVerifiedEmail" :text="$t('settings_email_verify_verified')" align="center" />
    <Label v-else-if="error" align="center">
      {{ $t('settings_email_verify_error_message', { error }) }}
    </Label>
    <Label v-else align="center">
      {{ $t('settings_email_verify_error_message_unknown') }}
    </Label>
    <div class="flex justify-center gap-[16px] mt-[16px]">
      <ButtonV2
        v-if="!isLoading && !isVerifiedEmail"
        :text="$t('settings_email_verify_retry_button')"
        preset="outline"
        @click="handleClickRetry"
      />
      <ButtonV2
        :text="$t('settings_email_verify_verified_back_button')"
        preset="secondary"
        @click="handleClickBack"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import alertMixin from '~/mixins/alert';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'SettingsEmailVerifyPage',
  mixins: [alertMixin, walletMixin],
  data() {
    return {
      isLoading: true,
      error: '',
    };
  },
  computed: {
    ...mapGetters(['walletEmailUnverified']),
    token() {
      return this.$route.params.token;
    },
    isVerifiedEmail() {
      return this.walletHasVerifiedEmail && !this.walletEmailUnverified;
    },
  },
  watch: {
    walletHasLoggedIn() {
      this.verify();
    },
  },
  mounted() {
    this.verify();
  },
  methods: {
    ...mapActions(['walletVerifyEmail']),
    async verify() {
      try {
        this.isLoading = true;
        if (!this.walletHasLoggedIn) {
          await this.connectWallet();
        }
        if (this.walletEmailUnverified) {
          await this.walletVerifyEmail(this.token);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error.response?.data || error.message;
        this.alertPromptError(
          this.$t('settings_email_verify_error_message', {
            error: this.error,
          })
        );
      } finally {
        this.isLoading = false;
      }
    },
    handleClickBack() {
      this.$router.push({ name: 'settings' });
    },
    handleClickRetry() {
      this.verify();
    },
  },
};
</script>
