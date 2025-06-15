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
        src="~/assets/images/migration/claim_alert.png"
        alt="Migration Icon"
        class="h-[80px]"
      />

      <div class="space-y-4 text-[15px] text-center text-gray-700">
        <p v-text="$t('migration_dialog_claim_description_1')" />
      </div>

      <div class="flex flex-col w-full gap-2 mt-4">
        <ButtonV2
          preset="secondary"
          :text="$t('migration_dialog_claim_button')"
          @click="handleClickGetSupport"
        />
      </div>
    </div>
  </Dialog>
</template>

<script>
export default {
  name: 'MigrateNoticeModalClaim',
  props: {
    isOpen: {
      type: Boolean,
    },
    paymentId: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      crispWebsiteId: '',
    };
  },

  mounted() {
    // populate crisp on mount to avoid ssr issues
    if (window.CRISP_WEBSITE_ID) this.crispWebsiteId = window.CRISP_WEBSITE_ID;
  },

  methods: {
    handleClickGetSupport() {
      const res = this.openCrisp(
        this.$t('migration_dialog_claim_help_text', {
          paymentId: this.paymentId,
        })
      );
      if (!res) {
        if (this.crispWebsiteId) {
          window.open(
            `https://go.crisp.chat/chat/embed/?website_id=${
              this.crispWebsiteId
            }`
          );
        } else {
          window.open(
            'https://discord.com/channels/763001015712350231/814761730349596712'
          );
        }
      }
    },
    handleDismiss() {
      this.$emit('close');
    },
  },
};
</script>
