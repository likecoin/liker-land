<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center">
    <div
      v-if="isLoading"
      class="fixed inset flex flex-col justify-center items-center bg-white gap-[16px]"
    >
      <ProgressIndicator />
      <span class="text-like-green">{{ $t('reader_loading_label') }}</span>
    </div>
    <Component
      :is="isLoginRequired ? 'AuthRequiredView' : 'div'"
      v-else
      class="w-full h-full"
      :login-label="$t('dashboard_login_in')"
      :login-button-label="$t('header_button_connect_to_wallet')"
    >
      <ProgressIndicator v-if="!fileSrc" />
      <NuxtChild
        v-else-if="canRead"
        :class-id="classId"
        :file-src="fileSrc"
        :cors-url="corsUrl"
        :cache-key="cacheKey"
      />
    </Component>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import { parseNFTMetadataURL } from '~/util/nft';
import { LIKECOIN_API_BASE } from '~/constant';
import { logTrackerEvent } from '~/util/EventLogger';
import { formatDuration } from '~/util/ui';

export default {
  name: 'PDFReaderPage',
  mixins: [nftMixin, walletMixin],
  layout: 'empty',
  data() {
    return {
      isLoading: true,
      openTimestamp: null,
      hasTracked: false,
      tabId: null,
    };
  },
  head: {
    bodyAttrs: { class: 'overflow-hidden' },
  },
  computed: {
    ...mapGetters(['getHomeRoute']),
    classId() {
      return this.$route.query.classId;
    },
    nftId() {
      return this.$route.query.nftId || this.nftIdCollectedFirstByUser || '';
    },
    index() {
      return this.$route.query.index || '0';
    },
    type() {
      return this.$route.query.format || '';
    },
    fileSrc() {
      if (this.type && Array.isArray(this.iscnContentUrls)) {
        const matchingUrl =
          (this.iscnContentUrls[this.index]?.includes(this.type) &&
            this.iscnContentUrls[this.index]) ||
          this.iscnContentUrls.find(url => url.includes(this.type));
        return parseNFTMetadataURL(matchingUrl);
      }
      return undefined;
    },
    isLoginRequired() {
      return !!(this.nftIsDownloadHidden || this.nftMustClaimToView);
    },
    canRead() {
      return this.isLoginRequired ? Boolean(this.getAddress) : true;
    },
    shouldEnableCustomMessage() {
      return this.nftIsCustomMessageEnabled && this.nftId ? '1' : '0';
    },
    corsUrl() {
      return `${LIKECOIN_API_BASE}/ebook-cors/?class_id=${
        this.classId
      }&nft_id=${this.nftId}&index=${this.index}&custom_message=${
        this.shouldEnableCustomMessage
      }`;
    },
    cacheKey() {
      return `${this.type}-${this.classId}-${this.nftId}-${this.index}`;
    },
  },
  watch: {
    // TODO: use loginAddress
    async getSessionWallet(address) {
      if (address) {
        await Promise.all([
          this.fetchUserCollectedCount(),
          this.updateNFTOwners(),
        ]);
        if (
          (!this.userCollectedCount && this.isLoginRequired) ||
          (this.nftCollectorWalletAddress &&
            this.nftCollectorWalletAddress !== this.getSessionWallet)
        ) {
          this.$router.replace(
            this.localeLocation({
              name: 'nft-class-classId',
              params: { classId: this.classId },
            })
          );
        }
      }
    },
  },
  async mounted() {
    this.openTimestamp = Date.now();
    try {
      this.isLoading = true;
      if (!this.classId) {
        this.$router.replace(this.localeLocation(this.getHomeRoute));
        return;
      }
      await Promise.all([
        this.lazyFetchNFTBookInfoByClassId(this.classId).catch(),
        this.lazyFetchNFTClassMetadata(),
        this.restoreAuthSession(),
      ]);
      await this.fetchISCNMetadata();
      if (this.getSessionWallet) {
        await Promise.all([
          this.fetchUserCollectedCount(),
          this.updateNFTOwners(),
        ]);
        if (
          (!this.userCollectedCount && this.isLoginRequired) ||
          (this.nftCollectorWalletAddress &&
            this.nftCollectorWalletAddress !== this.getSessionWallet)
        ) {
          this.$router.replace(
            this.localeLocation({
              name: 'nft-class-classId',
              params: { classId: this.classId },
            })
          );
          return;
        }
        if (
          (this.isLoginRequired || this.nftIsCustomMessageEnabled) &&
          this.nftId &&
          !this.$route.query.nftId
        ) {
          this.$router.replace({
            query: { ...this.$route.query, nftId: this.nftId },
          });
        }
      } else if (this.isLoginRequired) {
        this.connectWallet();
      }
    } finally {
      this.isLoading = false;
    }
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    window.addEventListener('unload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('unload', this.handleBeforeUnload);
  },
  beforeRouteLeave(to, from, next) {
    this.trackReaderClose();
    next();
  },
  methods: {
    ...mapActions(['restoreAuthSession']),
    handleBeforeUnload() {
      this.trackReaderClose();
    },
    trackReaderClose() {
      if (this.hasTracked || !this.openTimestamp) return;
      this.hasTracked = true;

      const duration = formatDuration(Date.now() - this.openTimestamp);
      logTrackerEvent(this, 'Reader', 'ReaderClose', this.classId, duration);
    },
  },
};
</script>
