<template>
  <div class="fixed inset-0 flex flex-col justify-center items-center">
    <ProgressIndicator v-if="isLoading" />
    <Component
      :is="isLoginRequired ? 'AuthRequiredView' : 'div'"
      v-else
      class="w-full h-full"
      :login-label="$t('dashboard_login_in')"
      :login-button-label="$t('header_button_connect_to_wallet')"
    >
      <ProgressIndicator v-if="!fileSrc" />
      <iframe
        v-else-if="format === 'pdf'"
        :src="pdfIframeSrc"
        width="100%"
        height="100%"
        style="border:none"
      />
      <div v-else>
        Not implemented
      </div>
    </Component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'ReaderPage',
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
    format() {
      return this.$route.query.format || 'pdf';
    },
    fileSrc() {
      const { src } = this.$route.query;
      // TODO: check src exists in ISCN
      // if (src && this.iscnContentUrls.find(url => url === src)) {
      if (src) {
        return src;
      }
      return this.iscnContentUrls.find(url => url.includes(this.format));
    },
    isLoginRequired() {
      return !!(this.nftIsDownloadHidden || this.nftMustClaimToView);
    },
    pdfIframeSrc() {
      const download =
        this.$route.query.download === '0' || this.nftIsDownloadHidden
          ? '0'
          : '1';
      const encodedUrl = encodeURIComponent(this.fileSrc);
      const encodedCorsUrl = encodeURIComponent(
        `https://pdf-cors-ufdrogmd2q-uw.a.run.app/pdf-cors?url=${encodedUrl}`
      );
      // TODO: customize pdf.js instead of using default build
      return `https://likecoin.github.io/pdf.js/web/viewer.html?download=${download}&file=${encodedCorsUrl}`;
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
      this.fetchNFTBookInfoByClassId(this.classId).catch();
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
