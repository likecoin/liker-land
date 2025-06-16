<template>
  <Dialog
    :open="isOpen"
    preset="custom"
    panel-container-class="max-w-[390px] w-full"
    panel-class="overflow-x-auto shadow-lg p-[24px]"
    panel-component="CardV2"
    @close="handleDismiss"
  >
    <div class="flex flex-col items-center gap-[24px] p-6 text-center">
      <img
        src="~/assets/images/migration/purchase_alert.png"
        alt="Migration Icon"
        class="h-[80px]"
      />

      <div class="space-y-4 text-[15px] text-left text-gray-700">
        <p v-text="$t('migration_dialog_purchase_description_1')" />
      </div>

      <div class="flex flex-col w-full gap-2 mt-4">
        <ButtonV2
          preset="secondary"
          :text="$t('migration_alert_banner_button')"
          @click="handleClickOpen3ook"
        />
      </div>
    </div>
  </Dialog>
</template>

<script>
import { BOOK_COM_DOMAIN } from '~/constant';

export default {
  name: 'MigrateNoticeModalPurchase',
  props: {
    isOpen: {
      type: Boolean,
    },
  },

  methods: {
    handleClickOpen3ook() {
      window.open(BOOK_COM_DOMAIN, '_blank', 'noopener,noreferrer');
    },
    handleDismiss() {
      this.$emit('close');
    },
  },
};
</script>
