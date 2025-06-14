<template>
  <div class="flex flex-col items-stretch min-h-screen">
    <AlertBanner
      :secondary-button-text="$t('migration_alert_banner_button')"
      @click-secondary-button="onClickAlertBanner"
    >
      <div class="flex items-center justify-center gap-[8px]">
        <img
          class="h-[48px]"
          src="~/assets/images/migration/index_alert.png"
          alt=""
        />
        <p class="text-sm" v-html="migrationBannerText" />
      </div>
    </AlertBanner>

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
  BOOK_COM_DOMAIN,
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
    migrationBannerText() {
      return this.$t('migration_alert_banner', {
        link: `<a href="${BOOK_COM_DOMAIN}" target="_blank" rel="noopener noreferrer" class="font-semibold text-like-green">
          ${this.$t('migration_target_site_name')}</a>`,
      });
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
    onClickAlertBanner() {
      logTrackerEvent(this, 'alert_banner', 'alert_banner_click_', '', 1);
      window.open(BOOK_COM_DOMAIN, '_blank');
    },
    handleDialogChange(hasAnyDialogOpened) {
      this.hasAnyDialogOpened = hasAnyDialogOpened;
    },
  },
};
</script>
