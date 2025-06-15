<template>
  <Dialog
    :open="shouldShowMigrateDialog || isOpen"
    preset="custom"
    panel-container-class="max-w-[390px] w-full"
    panel-class="overflow-x-auto shadow-lg p-[24px]"
    panel-component="CardV2"
    @close="handleDismiss"
  >
    <div class="flex flex-col items-center gap-[48px] p-6 text-center">
      <img
        src="~/assets/images/migration/login_migrate.png"
        alt="Migration Icon"
        class="h-[80px]"
      />

      <ul class="space-y-4 text-[15px] text-left text-gray-700">
        <li class="flex items-start gap-4">
          <img
            src="~/assets/images/migration/login_migrate_transfer_icon.png"
            alt="Migration Icon"
            class="h-[24px]"
          />
          <span v-text="$t('migration_dialog_description_1')" />
        </li>
        <li class="flex items-start gap-4">
          <img
            src="~/assets/images/migration/login_migrate_global_icon.png"
            alt="Migration Icon"
            class="h-[24px]"
          />
          <span v-text="$t('migration_dialog_description_2')" />
        </li>
        <li class="flex items-start gap-4">
          <img
            src="~/assets/images/migration/login_migrate_book_icon.png"
            alt="Migration Icon"
            class="h-[24px]"
          />
          <span v-text="$t('migration_dialog_description_3')" />
        </li>
      </ul>

      <div class="flex flex-col w-full gap-2 mt-4">
        <ButtonV2
          preset="secondary"
          :text="$t('migration_dialog_button_migrate')"
          @click="handleMigrateNow"
        />
        <ButtonV2
          preset="plain"
          :text="$t('migration_dialog_button_dismiss')"
          @click="handleDismiss"
        />
      </div>
    </div>
  </Dialog>
</template>

<script>
import { MIGRATION_URL } from '~/constant';

const MIGRATE_DISMISS_KEY = 'migrate_dialog_dismiss_at';
const MIGRATE_WAIT_MINUTES = 15;

export default {
  name: 'MigrateNoticeModalLogin',
  props: {
    isOpen: {
      type: Boolean,
    },
  },

  data() {
    return {
      shouldShowMigrateDialog: false,
    };
  },

  mounted() {
    this.shouldShowMigrateDialog = this.checkShouldShowMigrateDialog();
  },

  methods: {
    checkShouldShowMigrateDialog() {
      try {
        const lastDismissAt = localStorage.getItem(MIGRATE_DISMISS_KEY);
        if (!lastDismissAt) return true;

        return (
          (Date.now() - Number(lastDismissAt)) / 60000 > MIGRATE_WAIT_MINUTES
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error checking migration dialog visibility:', error);
        return true;
      }
    },
    onCloseMigrateDialog() {
      try {
        this.shouldShowMigrateDialog = false;
        localStorage.setItem(MIGRATE_DISMISS_KEY, String(Date.now()));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error saving migration dialog dismiss time:', error);
      }
    },
    handleMigrateNow() {
      window.open(MIGRATION_URL, '_blank', 'noopener,noreferrer');
    },
    handleDismiss() {
      this.onCloseMigrateDialog();
      this.$emit('close');
    },
  },
};
</script>
