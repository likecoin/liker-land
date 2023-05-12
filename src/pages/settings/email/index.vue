<template>
  <AuthRequiredView
    class="flex flex-col"
    :login-label="$t('settings_email_login_in')"
    :login-button-label="$t('settings_email_login_in_button')"
  >
    <template v-if="hasEmail">
      <div class="grid sm:grid-cols-2 gap-[16px]">
        <div v-if="walletEmail">
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
    </template>

    <form @submit.prevent="handleClickConfirm">
      <Label v-if="isClaimingPendingNftMode" class="justify-center mb-[12px]" align="center">
        {{ $t('settings_email_claim_pending_nft') }}
      </Label>
      <Label
        class="text-medium-gray"
        :text="$t(hasEmail ? 'settings_email_change_email' : 'settings_email_new_email')"
      />
      <TextField
        v-model="newEmail"
        class="mt-[4px]"
        :is-disabled="isClaimingPendingNftMode || isSubmitting"
        :placeholder="$t('settings_email_input_email_placeholder')"
      />
      <div class="flex justify-end mt-[8px]">
        <ProgressIndicator v-if="isSubmitting" />
        <ButtonV2
          v-else
          :text="$t('settings_email_confirm')"
          preset="secondary"
          :is-disabled="isDisabledChangingEmail"
          type="submit"
        />
      </div>
    </form>

    <SettingsNotificationConfig />
  </AuthRequiredView>
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
      newEmail: this.$route.query.email,
      isSubmitting: false,
    };
  },
  computed: {
    ...mapGetters(['walletEmailUnverified']),
    hasEmail() {
      return !!this.walletEmail || !!this.walletEmailUnverified;
    },
    isClaimingPendingNftMode() {
      return !!this.$route.query.claim_pending_nft && !this.walletEmail;
    },
    isDisabledChangingEmail() {
      return !this.newEmail || this.newEmail === this.walletEmailUnverified;
    },
    classId() {
      return this.$route.query.class_id;
    },
    paymentId() {
      return this.$route.query.payment_id;
    },
    claimingToken() {
      return this.$route.query.claiming_token;
    },
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
        const payload = { email: this.walletEmailUnverified };
        if (this.classId && this.paymentId && this.claimingToken) {
          payload.classId = this.classId;
          payload.paymentId = this.paymentId;
          payload.claimingToken = this.claimingToken;
        }
        await this.walletUpdateEmail(payload);
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
      if (this.isDisabledChangingEmail) return;
      logTrackerEvent(
        this,
        'settings',
        'settings_email_update_email',
        this.loginAddress,
        1
      );
      try {
        this.isSubmitting = true;
        const payload = { email: this.newEmail };
        if (this.classId && this.paymentId && this.claimingToken) {
          payload.classId = this.classId;
          payload.paymentId = this.paymentId;
          payload.claimingToken = this.claimingToken;
        }
        await this.walletUpdateEmail(payload);
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
