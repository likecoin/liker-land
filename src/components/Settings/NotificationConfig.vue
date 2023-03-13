<template>
  <section class="mt-[24px]">
    <h1 class="text-like-green text-[600] text-[24px]">{{ $t('settings_notification_title') }}</h1>
    <h2 class="text-medium-gray">{{ $t('settings_notification_tx_section_title') }}</h2>

    <ProgressIndicator
      v-if="isFetchingSettings"
      class="mx-auto my-[32px]"
    />
    <ul
      v-else
      :class="[
        'rounded-[8px] overflow-hidden mt-[12px]',
        { 'pointer-events-none opacity-50': isSettingsDisabled },
      ]"
    >
      <li class="border-b-[1px] border-gray-e6">
        <SettingsListItem :is-clickable="false">
          {{ $t('settings_notification_tx_transfer') }}
          <template #accessory>
            <CheckBox
              v-model="isTransferNotificationEnabled"
              :is-disabled="isSettingsDisabled"
              @input="updateNotificationSettings"
            />
          </template>
        </SettingsListItem>
      </li>
      <!-- <li>
        <SettingsListItem :is-clickable="false">
          {{ $t('settings_notification_tx_purchase') }}
          <template #accessory>
            <CheckBox v-model="isPurchaseNotificationEnabled" />
          </template>
        </SettingsListItem>
      </li> -->
    </ul>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import alertMixin from '~/mixins/alert';

export default {
  name: 'NotificationSettingsPage',
  mixins: [alertMixin],
  data() {
    return {
      isFetchingSettings: false,
      isTransferNotificationEnabled: false,
      isPurchaseNotificationEnabled: false,
    };
  },
  computed: {
    ...mapGetters([
      'walletHasLoggedIn',
      'walletHasVerifiedEmail',
      'walletNotificationSettings',
    ]),
    isSettingsDisabled() {
      return !this.walletHasLoggedIn || !this.walletHasVerifiedEmail;
    },
  },
  watch: {
    walletHasLoggedIn: {
      immediate: true,
      handler(hasLoggedIn) {
        if (hasLoggedIn) this.fetchNotificationSettings();
      },
    },
    walletHasVerifiedEmail: {
      immediate: true,
      handler(hasVerifiedEmail) {
        if (hasVerifiedEmail) this.fetchNotificationSettings();
      },
    },
  },
  methods: {
    ...mapActions([
      'walletFetchNotificationSettings',
      'walletUpdateNotificationSettings',
    ]),
    async fetchNotificationSettings() {
      if (this.isFetchingSettings) return;
      try {
        this.isFetchingSettings = true;
        if (!this.walletNotificationSettings) {
          await this.walletFetchNotificationSettings();
        }
        if (this.walletNotificationSettings) {
          this.isTransferNotificationEnabled = this.walletNotificationSettings.transfer;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.alertPromptError(
          this.$t('settings_notification_fetch_error_message', {
            error: error.message || error.name || error,
          })
        );
      } finally {
        this.isFetchingSettings = false;
      }
    },
    async updateNotificationSettings() {
      if (this.isSettingsDisabled) return;

      try {
        await this.walletUpdateNotificationSettings({
          transfer: this.isTransferNotificationEnabled,
        });
        this.alertPromptSuccess(
          this.$t('settings_notification_update_success_message')
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.isTransferNotificationEnabled = this.walletNotificationSettings.transfer;
        this.alertPromptError(
          this.$t('settings_notification_update_error_message', {
            error: error.message || error.name || error,
          })
        );
      }
    },
  },
};
</script>
