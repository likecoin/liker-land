<template>
  <div class="flex flex-col justify-center items-center">
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
        class="fixed inset-0"
        :src="pdfIframeSrc"
        width="100%"
        height="100%"
        style="border:none"
      />
      <template v-else-if="format === 'epub'">
        <a
          id="prev"
          class="left-0 laptop:left-10 fixed top-1/2 text-[64px] text-like-green font-bold cursor-pointer select-none no-underline"
          @click="onClickPrev"
          >‹</a
        >
        <div
          id="viewer"
          class="mx-auto my-[40px] w-[1200px] h-[700px] shadow-md rounded-md p-0 relative"
        />
        <a
          id="next"
          class="right-0 laptop:right-10 fixed top-1/2 text-[64px] text-like-green font-bold cursor-pointer select-none no-underline"
          @click="onClickNext"
          >›</a
        >
      </template>
      <div v-else>
        Not implemented
      </div>
    </Component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Epub from 'epubjs';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'ReaderPage',
  mixins: [nftMixin, walletMixin],
  layout: 'empty',
  data() {
    return {
      isLoading: true,
      rendition: null,
    };
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

      if (this.format === 'epub') {
        const book = Epub(this.fileSrc);
        this.rendition = book.renderTo('viewer', {
          width: '100%',
          height: '100%',
          spread: 'always',
        });
        this.rendition.display();
      }
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    onClickPrev() {
      this.rendition.prev();
    },
    onClickNext() {
      this.rendition.next();
    },
  },
};
</script>
