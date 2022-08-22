<template>
  <div class="page-layout page-layout--default">
    <AppHeader class="w-full text-like-green" />
    <nuxt class="page-wrapper" />
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
  },
  methods: {
    ...mapActions(['uiCloseTxModal']),
  },
};
</script>

<style lang="scss">
.page-layout--default {
  @apply bg-gray-f7;
}
</style>
