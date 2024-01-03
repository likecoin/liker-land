import { parseNFTMetadataURL } from '~/util/nft';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'getNFTClassMetadataById',
      'getISCNMetadataById',
      'getCanViewNFTBookBeforeClaimByClassId',
      'getNFTCollectionInfoByCollectionId',
      'getCanViewNFTBookBeforeClaimByClassId',
      'getIsHideNFTBookDownload',
    ]),
    classIds() {
      if (this.collectionId) {
        return this.getNFTCollectionInfoByCollectionId(this.collectionId)
          ?.classIds;
      }
      return [this.classId];
    },
    isCollection() {
      return !!this.collectionId;
    },
    primaryKey() {
      return this.collectionId || this.classId;
    },
    collectionLocale() {
      let { locale } = this.$i18n;
      if (locale === 'zh-Hant') {
        locale = 'zh';
      }
      return locale;
    },
    NFTMetadata() {
      if (this.isCollection) {
        return this.getNFTCollectionInfoByCollectionId(this.collectionId);
      }
      return this.getNFTClassMetadataById(this.classId);
    },
    NFTName() {
      const name = this.NFTMetadata?.name;
      if (name && name[this.collectionLocale] !== undefined) {
        return name[this.collectionLocale];
      }
      return name;
    },
    NFTDescription() {
      const description = this.NFTMetadata?.description;
      if (description && description[this.collectionLocale] !== undefined) {
        return description[this.collectionLocale];
      }
      return description;
    },
    NFTImageUrl() {
      const image = this.NFTMetadata?.image;
      return image ? parseNFTMetadataURL(image) : '';
    },
    NFTOwner() {
      let wallet;
      if (this.isCollection) {
        wallet = this.getNFTCollectionInfoByCollectionId(this.collectionId)
          ?.ownerWallet;
      } else {
        wallet = this.NFTMetadata?.iscn_owner;
      }
    },
  },
};
