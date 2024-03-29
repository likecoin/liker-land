<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center">
    <ProgressIndicator v-if="isLoading" />
    <Component
      :is="isLoginRequired ? 'AuthRequiredView' : 'div'"
      v-else
      class="w-full h-full"
      :login-label="$t('dashboard_login_in')"
      :login-button-label="$t('header_button_connect_to_wallet')"
    >
      <ProgressIndicator v-if="!fileSrc" />
      <NuxtChild v-else-if="canRead" :file-src="fileSrc" />
    </Component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import { parseNFTMetadataURL } from '~/util/nft';

export default {
  name: 'PDFReaderPage',
  mixins: [nftMixin, walletMixin],
  layout: 'empty',
  data() {
    return {
      isLoading: true,
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
    fileSrc() {
      const { format: type, index: fileIndex } = this.$route.query;
      if (type && Array.isArray(this.iscnContentUrls)) {
        const matchingUrl =
          (this.iscnContentUrls[fileIndex]?.includes(type) &&
            this.iscnContentUrls[fileIndex]) ||
          this.iscnContentUrls.find(url => url.includes(type));
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
  },
  watch: {
    // TODO: use loginAddress
    async getAddress(address) {
      if (address) {
        await this.fetchUserCollectedCount();
        if (!this.userCollectedCount && this.isLoginRequired) {
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
    try {
      this.isLoading = true;
      if (!this.classId) {
        this.$router.replace(this.localeLocation(this.getHomeRoute));
        return;
      }
      this.lazyFetchNFTBookInfoByClassId(this.classId).catch();
      await this.lazyFetchNFTClassMetadata();
      await this.fetchISCNMetadata();
      await this.restoreSession();
      // TODO: use loginAddress
      if (this.getAddress) {
        await this.fetchUserCollectedCount();
        if (!this.userCollectedCount && this.isLoginRequired) {
          this.$router.replace(
            this.localeLocation({
              name: 'nft-class-classId',
              params: { classId: this.classId },
            })
          );
          return;
        }
      } else {
        this.connectWallet();
      }
    } finally {
      this.isLoading = false;
    }
  },
};
</script>
