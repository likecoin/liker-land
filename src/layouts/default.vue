<template>
  <div class="flex flex-col items-stretch min-h-screen">
    <AlertBanner
      v-if="getRouteBaseName($route) !== 'nft-class-classId' && $route.params.classId !== alertBannerNFTClassId"
      :primary-button-text="$t('alert_banner_actions_purchase')"
      :primary-button-to="
        localeLocation({
          name: 'nft-class-classId',
          params: { classId: alertBannerNFTClassId },
        })"
      :secondary-button-text="$t('alert_banner_actions_about')"
      secondary-button-href="https://nowherebookstore.io/"
      @click-primary-button="onClickAlertBanner('primary')"
      @click-secondary-button="onClickAlertBanner('secondary')"
    >
      <i18n path="alert_banner_content_heavenly_creations_life_like">
        <span
          class="text-like-green font-[600]"
          place="creator"
        >{{ $t('alert_banner_content_heavenly_creations_life_like_creator') }}</span>
        <span
          class="text-like-green font-[600]"
          place="book"
        >{{ $t('alert_banner_content_heavenly_creations_life_like_name') }}</span>
      </i18n>
    </AlertBanner>

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
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  mixins: [alertMixin, inAppMixin],
  computed: {
    ...mapGetters(['uiIsOpenCollectModal']),
    getTimeoutSec() {
      return this.alertPreset === 'success' ? 2000 : null;
    },
    alertBannerNFTClassId() {
      return 'likenft19symzw3xmh42gukzts858wf6rsdkn6e4jtc9wp8jh4kphfmffy5s6acyxg';
    },
  },
  methods: {
    ...mapActions(['uiCloseTxModal']),
    onClickAlertBanner(type = 'primary') {
      logTrackerEvent(
        this,
        'alert_banner',
        `alert_banner_click_${type}`,
        '',
        1
      );
    },
  },
  head() {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
    return {
      htmlAttrs: {
        ...i18nHead.htmlAttrs,
      },
      bodyAttrs: {
        class: ['bg-gray-f7'],
      },
      meta: [...i18nHead.meta],
      link: [...i18nHead.link],
    };
  },
};
</script>
