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
      <li>
        <SettingsListItem
          :is-clickable="false"
          accessory-class="flex flex-col items-end"
        >
          {{ $t('settings_notification_tx_purchase') }}
          <template #accessory>
            <CheckBox
              v-model="isPurchaseNotificationEnabled"
              :is-disabled="isSettingsDisabled"
              @input="updateNotificationSettings"
            />
            <template v-if="isPurchaseNotificationEnabled">
              <div class="flex items-center gap-[4px] mt-[8px]">
                <TextField
                  v-model="purchaseNotificationPriceThreshold"
                  input-class="!min-w-0 !w-[100px] text-right"
                  type="number"
                  @input="updateNotificationSettings"
                />
                <span class="text-like-green font-[600] ml-[8px]">LIKE</span>
              </div>
              <label
                v-t="'settings_notification_tx_purchase_price_threshold'"
                class="text-[12px] leading-[1.5] font-600 text-medium-gray mt-[8px]"
              />
            </template>
          </template>
        </SettingsListItem>
      </li>
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
      purchaseNotificationPriceThreshold: 0,
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
          const { transfer, purchasePrice } = this.walletNotificationSettings;
          this.isTransferNotificationEnabled = transfer;
          this.isPurchaseNotificationEnabled = purchasePrice >= 0;
          this.purchaseNotificationPriceThreshold = purchasePrice;
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
          purchasePrice: this.isPurchaseNotificationEnabled
            ? this.purchaseNotificationPriceThreshold
            : -1,
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
