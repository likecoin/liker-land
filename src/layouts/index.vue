<template>
  <div class="flex flex-col items-stretch min-h-screen">
    <AlertBanner v-if="uiIsChainUpgrading">{{
      $t('notice_chain_upgrading')
    }}</AlertBanner>

    <nuxt
      :class="[
        'flex-grow',
        {
          'pt-[32px]': isInInAppBrowser,
        },
      ]"
    />
    <Footer v-if="!isInInAppBrowser" />
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

import { EXTERNAL_HOST } from '~/constant';

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
    isHomePage() {
      return this.getRouteBaseName(this.$route) === 'index';
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
