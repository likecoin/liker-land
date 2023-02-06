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
        <li>
          <SettingsListItem :is-clickable="false">
            {{ $t('settings_notification_tx_purchase') }}
            <template #accessory>
              <CheckBox v-model="isPurchaseNotificationEnabled"/>
            </template>
          </SettingsListItem>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: 'NotificationSettingsPage',
  data() {
    return {
      isTransferNotificationEnabled: false,
      isPurchaseNotificationEnabled: false,
    };
  },
};
</script>
