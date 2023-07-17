<template>
  <div class="flex flex-col items-stretch min-h-screen">
    <!-- <AlertBanner
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
    </AlertBanner> -->

    <AlertBanner v-if="uiIsChainUpgrading">{{ $t('notice_chain_upgrading') }}</AlertBanner>

    <NFTBookHero
      v-if="isHomePage && shouldShowNFTBookHero"
      :class="{ 'pb-[84px]': isNFTBookHeroAnimationComplete }"
      @animate-complete="handleNFTBookHeroAnimateComplete"
    >
      <template #prepend>
        <SiteHeader
          v-if="!isInInAppBrowser"
          class="text-like-green"
          :is-plain="true"
        />
      </template>
    </NFTBookHero>
    <SiteHeader
      v-else-if="!isInInAppBrowser"
      class="text-like-green"
    />
    <nuxt
      :class="[
        'flex-grow',
        {
          'pt-[32px]': isInInAppBrowser,
          'fixed opacity-0': isNFTBookHeroAnimating,
        }
      ]"
    />
    <Footer
      v-if="!isInInAppBrowser"
      :class="{ 'fixed opacity-0': isNFTBookHeroAnimating }"
    />
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
import { checkIsLikeCoinAppInAppBrowser } from '~/util/client';
import inAppMixin from '~/mixins/in-app';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  mixins: [alertMixin, inAppMixin],
  data() {
    return {
      isNFTBookHeroAnimationComplete: false,
    };
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
  computed: {
    ...mapGetters(['uiIsOpenCollectModal', 'uiIsChainUpgrading']),
    getTimeoutSec() {
      return this.alertPreset === 'success' ? 2000 : null;
    },
    alertBannerNFTClassId() {
      return 'likenft19symzw3xmh42gukzts858wf6rsdkn6e4jtc9wp8jh4kphfmffy5s6acyxg';
    },
    isHomePage() {
      return this.getRouteBaseName(this.$route) === 'index';
    },
    isNFTBookHeroAnimating() {
      return this.isHomePage && !this.isNFTBookHeroAnimationComplete;
    },
    shouldShowNFTBookHero() {
      return !checkIsLikeCoinAppInAppBrowser(this.$route);
    },
  },
  methods: {
    ...mapActions(['uiCloseTxModal']),
    handleNFTBookHeroAnimateComplete() {
      this.isNFTBookHeroAnimationComplete = true;
    },
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
};
</script>
