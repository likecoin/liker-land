import { parseNFTMetadataURL } from '~/util/nft';
import nftMixin from './nft';
import collectionMixin from './nft-collection';

export default {
  mixins: [nftMixin, collectionMixin],
  computed: {
    classIds() {
      return this.collectionId ? this.classIds : [this.classId];
    },
    isCollection() {
      return !!this.collectionId;
    },
    productId() {
      return this.collectionId || this.classId;
    },
    NFTMetadata() {
      return this.isCollection ? this.collection : this.NFTMetadata;
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
      return this.isCollection
        ? this.NFTMetadata?.ownerWallet
        : this.NFTMetadata?.iscn_owner;
    },
    viewInfoLocation() {
      return this.isCollection
        ? this.localeLocation({
            name: 'nft-collection-collectionId',
            params: {
              collectionId: this.collectionId,
            },
          })
        : this.localeLocation({
            name: 'nft-class-classId',
            params: {
              classId: this.classId,
            },
          });
    },
  },
};
