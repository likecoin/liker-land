<template>
  <div class="page-layout page-layout--default">
    <SiteHeader class="w-full text-like-green" />
    <nuxt class="page-wrapper" />
    <Footer />
    <PortalTarget
      name="dialog"
      multiple
    />
    <PortalTarget
      name="snackbar"
      multiple
    />

    <Snackbar
      :open="uiIsOpenSnackbar"
      :preset="alertPreset"
      :timeout="getTimeoutSec"
      @close="alertClose"
    >
      {{ alertMessage }}
      <LinkV2
        v-if="alertMessage.toString().includes('INSUFFICIENT_BALANCE')"
        :class="['text-white','ml-[5px]']"
        href="https://docs.like.co/general-guides/trade"
      >
        {{ $t('snackbar_error_buyLIKE') }}
      </LinkV2>
    </Snackbar>

    <TxModal
      :is-open="uiIsOpenCollectModal"
      :has-close-button="false"
      :header-text="$t('nft_details_page_title_collect')"
      :complete-text="$t('tx_modal_status_complete_text_collect')"
      @close="uiCloseTxModal"
    >
      <template #header-prepend>
        <IconPrice />
      </template>
      <NFTPageOwning />
    </TxModal>
  </div>
</template>

<script>
import slidingMenuMixin from '~/mixins/sliding-menu';
import alertMixin from '~/mixins/alert';
import { mapActions, mapGetters } from 'vuex';

export default {
  mixins: [slidingMenuMixin, alertMixin],
  computed: {
    ...mapGetters(['uiIsOpenCollectModal']),
    getTimeoutSec() {
      return this.alertPreset === 'success' ? 2000 : null;
    },
  },
  methods: {
    ...mapActions(['uiCloseTxModal']),
  },
  head() {
    return {
      bodyAttrs: {
        class: ['bg-gray-f7'],
      },
    };
  },
};
</script>
