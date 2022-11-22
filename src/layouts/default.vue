<template>
  <div class="flex flex-col items-stretch min-h-screen">
    <SiteHeader class="text-like-green" />
    <nuxt class="flex-grow" />
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

    <EventModalCollect
      :is-open="uiIsOpenCollectModal"
      @close="uiCloseTxModal"
    />
  </div>
</template>

<script>
import alertMixin from '~/mixins/alert';
import { mapActions, mapGetters } from 'vuex';

export default {
  mixins: [alertMixin],
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
