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

    <SiteTopBanner
      v-if="siteTopBannerMessage"
      :banner-key="classId"
      :messages="[siteTopBannerMessage]"
    />

    <AlertBanner v-if="uiIsChainUpgrading">{{
      $t('notice_chain_upgrading')
    }}</AlertBanner>

    <SiteHeader
      v-if="!isInInAppBrowser"
      :key="$route.name"
      :class="[
        'text-like-green',
        {
          [[
            'bg-opacity-75',
            'bg-gray-f7',
            'backdrop-blur-sm',
            'fixed',
            'inset-x-0',
            'top-0',
            'z-1',
          ].join(' ')]: isFixedSiteHeader,
        },
        {
          [[
            'phoneLg:bg-gray-f7',
            'phoneLg:sticky',
            'phoneLg:inset-x-0',
            'phoneLg:top-0',
            'phoneLg:z-50',
          ].join(' ')]: isClaimPage,
        },
      ]"
    />
    <nuxt
      :class="[
        'flex-grow',
        {
          'pt-[32px]': isInInAppBrowser,
        },
      ]"
    />
    <Footer
      v-if="!isInInAppBrowser"
      :class="[{ 'phoneLg:hidden': isClaimPage }]"
    />
    <PortalTarget name="dialog" multiple @change="handleDialogChange" />
    <PortalTarget name="snackbar" multiple />

    <Snackbar
      :open="uiIsOpenSnackbar"
      :preset="alertPreset"
      :timeout="getTimeoutSec"
      @close="alertClose"
    >
      {{ alertMessage }}
      <LinkV2
        v-if="alertMessage.toString().includes('INSUFFICIENT_BALANCE')"
        :class="['text-white', 'ml-[5px]']"
        href="https://docs.like.co/general-guides/trade"
      >
        {{ $t('snackbar_error_getLIKE') }}
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

import {
  EXTERNAL_HOST,
  NFT_BOOK_WITH_TOP_BANNER_MESSAGE_MAP,
} from '~/constant';

import alertMixin from '~/mixins/alert';
import inAppMixin from '~/mixins/in-app';
import walletLoginMixin from '~/mixins/wallet-login';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  mixins: [alertMixin, inAppMixin, walletLoginMixin],
  data() {
    return {
      hasAnyDialogOpened: false,
      isWalletAutoLoggingIn: false,
    };
  },
  head() {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
    const bodyClass = ['bg-gray-f7'];
    if (this.hasAnyDialogOpened) {
      bodyClass.push('overflow-hidden');
    }
    return {
      htmlAttrs: {
        ...i18nHead.htmlAttrs,
      },
      bodyAttrs: {
        class: bodyClass,
      },
      meta: [
        ...i18nHead.meta,
        {
          hid: 'description',
          name: 'description',
          content: this.$t('og_description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('og_description'),
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${EXTERNAL_HOST}/images/og/${
            this.$i18n.locale === 'zh-Hant' ? 'default-zh.jpg' : 'default.jpg'
          }`,
        },
      ],
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
    isFixedSiteHeader() {
      return this.getRouteBaseName(this.$route) === 'about-nft-book';
    },
    isClaimPage() {
      return this.getRouteBaseName(this.$route).includes('nft-claim');
    },
    isNFTClassPage() {
      return this.getRouteBaseName(this.$route) === 'nft-class-classId';
    },
    classId() {
      return this.$route.params.classId;
    },
    siteTopBannerMessage() {
      return (
        (this.isNFTClassPage &&
          NFT_BOOK_WITH_TOP_BANNER_MESSAGE_MAP[this.classId]) ||
        ''
      );
    },
  },
  watch: {
    isInInAppBrowser: {
      immediate: true,
      async handler(isInInAppBrowser) {
        if (
          process.server ||
          !isInInAppBrowser ||
          this.walletHasLoggedIn ||
          this.isWalletAutoLoggingIn
        ) {
          return;
        }
        try {
          this.isWalletAutoLoggingIn = true;
          await this.connectWallet();
        } finally {
          this.isWalletAutoLoggingIn = false;
        }
      },
    },
  },
  async mounted() {
    // Remove these if we use PWA again
    // Deregister service workers, delete all cache
    try {
      if (window.navigator && window.navigator.serviceWorker) {
        const registrations = await window.navigator.serviceWorker.getRegistrations();
        if (registrations?.length) {
          registrations.forEach(registration => {
            registration.unregister();
          });
        }
      }
      if (window.caches) {
        const keyList = await window.caches.keys();
        if (keyList?.length) {
          await Promise.all(
            keyList
              .filter(key => !key.startsWith('reader'))
              .map(key => caches.delete(key))
          );
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
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
    handleDialogChange(hasAnyDialogOpened) {
      this.hasAnyDialogOpened = hasAnyDialogOpened;
    },
  },
};
</script>
