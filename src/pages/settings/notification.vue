<template>
  <div>
    <h1 class="text-like-green text-[600] text-[24px]">{{ $t('settings_notification_title') }}</h1>
    <section class="mt-[24px]">
      <h2 class="text-medium-gray">{{ $t('settings_notification_tx_section_title') }}</h2>
      <ul class="rounded-[8px] overflow-hidden mt-[12px]">
        <li class="border-b-[1px] border-gray-e6">
          <SettingsListItem :is-clickable="false">
            {{ $t('settings_notification_tx_transfer') }}
            <template #accessory>
              <CheckBox v-model="isTransferNotificationEnabled" @input="postNotificationSettings" />
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'NotificationSettingsPage',
  data() {
    return {
      isTransferNotificationEnabled: true,
      isPurchaseNotificationEnabled: false,
    };
  },
  computed: {
    ...mapGetters(['walletHasLoggedIn', 'walletNotificationSettings']),
  },
  async mounted() {
    if (!this.walletHasLoggedIn) {
      try {
        await this.signLogin();
      } catch {
        // No-op
      }
      if (!this.walletHasLoggedIn) {
        return;
      }
    }
    if (!this.walletNotificationSettings) {
      await this.walletFetchNotificationSettings();
    }
    this.isTransferNotificationEnabled = this.walletNotificationSettings.transfer;
  },
  methods: {
    ...mapActions([
      'signLogin',
      'walletFetchNotificationSettings',
      'walletUpdateNotificationSettings',
    ]),
    postNotificationSettings() {
      this.walletUpdateNotificationSettings({
        transfer: this.isTransferNotificationEnabled,
      });
    },
  },
};
</script>
