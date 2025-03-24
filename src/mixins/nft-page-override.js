import { NFT_BOOK_PRODUCT_PAGE_OVERRIDE } from '~/constant';

export default {
  data: () => ({
    nftShouldHideEventBanner: false,
  }),
  computed: {
    nftPageOverride() {
      return (
        NFT_BOOK_PRODUCT_PAGE_OVERRIDE[this.classId] ||
        NFT_BOOK_PRODUCT_PAGE_OVERRIDE[this.collectionId]
      );
    },
    nftShouldShowEventBanner() {
      return !!this.nftEventBanner && !this.nftShouldHideEventBanner;
    },
    nftAuthorQueryOverride() {
      return this.nftPageOverride?.authorQuery || '';
    },
    nftIsOwnerHidden() {
      return this.nftPageOverride?.isOwnerHidden || false;
    },
  },
};
