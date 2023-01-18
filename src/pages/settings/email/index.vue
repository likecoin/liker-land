<template>

  <div v-if="walletHasLoggedIn">
    <div class="grid sm:grid-cols-2 gap-[16px]">
      <div>
        <Label class="text-medium-gray" :text="$t('settings_email_current_email')" />
        <Label :text="walletEmail" />
      </div>

      <div v-if="walletEmailUnverified">
        <Label class="text-medium-gray" :text="$t('settings_email_unverified_email')" />
        <Label :text="walletEmailUnverified" />
        <ButtonV2
          class="mt-[8px]"
          :text="$t('settings_email_resend_verification_email')"
          :is-disabled="isSubmitting"
          preset="outline"
          size="mini"
          @click="handleClickResend"
        />
      </div>
    </div>

    <Separator class="my-[24px]" />

    <Label class="text-medium-gray" :text="$t('settings_email_change_email')" />
    <TextField
      v-model="newEmail"
      class="mt-[4px]"
      :is-disabled="isSubmitting"
      placeholder="Enter new email"
    />
    <div class="flex justify-end mt-[8px]">
      <ProgressIndicator v-if="isSubmitting" />
      <ButtonV2
        v-else
        :text="$t('settings_email_confirm')"
        preset="secondary"
        :is-disabled="!newEmail || newEmail === walletEmailUnverified"
        @click="handleClickConfirm"
      />
    </div>
  </div>

  <div v-else class="flex flex-col justify-center flex-grow">
    <Label class="text-medium-gray" align="center" :text="$t('settings_email_login_in')" />
    <div class="flex justify-center mt-[24px]">
      <ProgressIndicator v-if="walletIsLoggingIn" />
      <ButtonV2
        v-else
        :text="$t('settings_email_login_in_button')"
        preset="secondary"
        @click="connectWallet"
      />
    </div>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { logTrackerEvent } from '~/util/EventLogger';

import alertMixin from '~/mixins/alert';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'SettingsEmailPage',
  mixins: [alertMixin, walletMixin],
  data() {
    return {
      newEmail: '',
      isSubmitting: false,
    };
  },
  computed: {
    ...mapGetters(['walletEmailUnverified']),
  },
  methods: {
    ...mapActions(['walletUpdateEmail']),
    async handleClickResend() {
      logTrackerEvent(
        this,
        'settings',
        'settings_email_resend_verification_email',
        this.loginAddress,
        1
      );
      try {
        this.isSubmitting = true;
        await this.walletUpdateEmail(this.walletEmailUnverified);
        this.alertPromptSuccess(
          this.$t('settings_email_changing_email_submitted')
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async handleClickConfirm() {
      logTrackerEvent(
        this,
        'settings',
        'settings_email_update_email',
        this.loginAddress,
        1
      );
      try {
        this.isSubmitting = true;
        await this.walletUpdateEmail(this.newEmail);
        this.alertPromptSuccess(
          this.$t('settings_email_changing_email_submitted')
        );
        this.newEmail = '';
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
