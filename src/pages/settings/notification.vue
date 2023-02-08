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
              <CheckBox v-model="isTransferNotificationEnabled" />
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
import { getUserNotification } from '~/util/api';

export default {
  name: 'NotificationSettingsPage',
  data() {
    return {
      isReady: false,
      isTransferNotificationEnabled: false,
      isPurchaseNotificationEnabled: false,
    };
  },
  computed: {
    ...mapGetters(['loginAddress', 'walletHasLoggedIn']),
  },
  watch: {
    isTransferNotificationEnabled() {
      if (this.isReady) {
        this.handleToggle();
      }
    },
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
    await this.fetchNotification();
    this.isReady = true;
  },
  methods: {
    ...mapActions(['signLogin']),
    async fetchNotification() {
      const { data } = await this.$api.get(
        getUserNotification(this.loginAddress)
      );
      const { notification } = data;
      const { transfer } = notification;
      this.isTransferNotificationEnabled = transfer;
    },
    handleToggle() {
      this.$api.post(getUserNotification(this.loginAddress), {
        notification: {
          transfer: this.isTransferNotificationEnabled,
        },
      });
    },
  },
};
</script>
