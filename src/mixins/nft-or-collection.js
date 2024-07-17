import { parseNFTMetadataURL } from '~/util/nft';
import nftMixin from './nft';
import collectionMixin from './nft-collection';

export default {
  mixins: [nftMixin, collectionMixin],
  computed: {
    classIds() {
      return this.collectionId ? this.collection?.classIds : [this.classId];
    },
    isCollection() {
      return !!this.collectionId;
    },
    productId() {
      return this.collectionId || this.classId;
    },
    productMetadata() {
      return this.isCollection ? this.collection : this.NFTClassMetadata;
    },
    productName() {
      const name = this.productMetadata?.name;
      if (name && name[this.collectionLocale] !== undefined) {
        return name[this.collectionLocale];
      }
      return name;
    },
    productDescription() {
      const description = this.productMetadata?.description;
      if (description && description[this.collectionLocale] !== undefined) {
        return description[this.collectionLocale];
      }
      return description;
    },
    productImageUrl() {
      const image = this.productMetadata?.image;
      return image ? parseNFTMetadataURL(image) : '';
    },
    productOwner() {
      return this.isCollection
        ? this.productMetadata?.ownerWallet
        : this.productMetadata?.iscn_owner;
    },
    productAvailablePriceLabel() {
      return this.isCollection
        ? this.collectionAvailablePriceLabel
        : this.nftBookAvailablePriceLabel;
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
