<template>
  <div class="flex flex-col items-stretch min-h-screen">
    <SiteHeader
      v-if="!isInInAppBrowser"
      class="text-like-green"
    />
    <nuxt class="flex-grow" />
    <Footer v-if="!isInInAppBrowser" />
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
import { mapActions, mapGetters } from 'vuex';

import alertMixin from '~/mixins/alert';
import inAppMixin from '~/mixins/in-app';

export default {
  mixins: [alertMixin, inAppMixin],
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
