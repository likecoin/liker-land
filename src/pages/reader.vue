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
      :class="[
        'w-full h-full',
        {
          'flex items-center justify-center': !isLoginRequired,
        },
      ]"
      :login-label="$t('dashboard_login_in')"
      :login-button-label="$t('header_button_connect_to_wallet')"
    >
      <ProgressIndicator v-if="!fileName" />
      <NuxtChild
        v-else-if="canRead"
        :class-id="classId"
        :nft-id="nftId"
        :file-index="index"
        :file-name="fileName"
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
import { getFilenameFromURL } from '~/util/nft-book';
import { LIKECOIN_API_BASE } from '~/constant';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'ReaderPage',
  mixins: [nftMixin, walletMixin],
  beforeRouteLeave(to, from, next) {
    this.trackReaderClose();
    next();
  },
  layout: 'empty',
  data() {
    return {
      isLoading: true,
      hasTrackedReaderClose: false,
      activeTime: 0,
      lastActiveTimestamp: null,
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
    fileName() {
      if (Array.isArray(this.normalizedClassContentURLs)) {
        const matchingUrl = this.normalizedClassContentURLs[this.index];
        if (this.type && matchingUrl.type !== this.type) {
          return undefined;
        }
        return matchingUrl.name;
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
          this.lazyFetchNFTOwners(),
        ]);
        if (
          this.isLoginRequired &&
          (!this.userCollectedCount ||
            (this.nftCollectorWalletAddress &&
              this.nftCollectorWalletAddress !== this.getSessionWallet))
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
    this.lastActiveTimestamp = Date.now();
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
          this.lazyFetchNFTOwners(),
        ]);
        if (
          this.isLoginRequired &&
          (!this.userCollectedCount ||
            (this.nftCollectorWalletAddress &&
              this.nftCollectorWalletAddress !== this.getSessionWallet))
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
    this.addEventListeners();
  },
  beforeDestroy() {
    this.trackReaderClose();
    this.removeEventListeners();
  },

  methods: {
    ...mapActions(['restoreAuthSession']),
    addEventListeners() {
      window.addEventListener('beforeunload', this.trackReaderClose);
      window.addEventListener('unload', this.trackReaderClose);
      document.addEventListener('visibilitychange', this.updateActiveTime);
    },
    removeEventListeners() {
      window.removeEventListener('beforeunload', this.trackReaderClose);
      window.removeEventListener('unload', this.trackReaderClose);
      document.removeEventListener('visibilitychange', this.updateActiveTime);
    },
    trackReaderClose() {
      if (this.hasTrackedReaderClose) return;
      this.hasTrackedReaderClose = true;

      this.updateActiveTime();

      const durationInSeconds = Math.round(this.activeTime / 1000);
      logTrackerEvent(
        this,
        'Reader',
        'ReaderClose',
        this.classId,
        durationInSeconds
      );
    },
    updateActiveTime() {
      const now = Date.now();
      if (document.hidden && this.lastActiveTimestamp) {
        const addedTime = Math.max(0, now - this.lastActiveTimestamp);
        this.activeTime += addedTime;
        this.lastActiveTimestamp = null;
      } else if (!document.hidden) {
        this.lastActiveTimestamp = now;
      }
    },
  },
};
</script>
