<template>
  <iframe :src="pdfIframeSrc" width="100%" height="100%" style="border:none" />
</template>

<script>
import nftMixin from '~/mixins/nft';

export default {
  name: 'PDFReaderPage',
  mixins: [nftMixin],
  props: {
    fileSrc: {
      type: String,
      default: '',
    },
  },
  computed: {
    pdfIframeSrc() {
      const download =
        this.$route.query.download === '0' || this.nftIsDownloadHidden
          ? '0'
          : '1';
      const encodedUrl = encodeURIComponent(this.fileSrc);
      const encodedCorsUrl = encodeURIComponent(
        `https://static2.like.co/pdf-cors/?url=${encodedUrl}`
      );
      // TODO: customize pdf.js instead of using default build
      return `https://likecoin.github.io/pdf.js/web/viewer.html?download=${download}&file=${encodedCorsUrl}`;
    },
  },
};
</script>
