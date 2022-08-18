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
    
  </div>
</template>

<script>
import slidingMenuMixin from '~/mixins/sliding-menu';
import alertMixin from '~/mixins/alert';

export default {
  mixins: [slidingMenuMixin, alertMixin],
  computed: {
    getTimeoutSec() {
      return this.alertPreset === 'success' ? 2000 : null;
    },
  },
};
</script>

<style lang="scss">
.page-layout--default {
  @apply bg-gray-f7;
}
</style>
