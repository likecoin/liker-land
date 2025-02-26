import { formatNumberWithUSD } from '~/util/ui';
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
      return this.isCollection ? this.collection : this.contentMetadata;
    },
    productName() {
      const name = this.nftName || this.productMetadata?.name;
      const hasLocalizedName = name?.[this.collectionLocale] !== undefined;
      return hasLocalizedName ? name[this.collectionLocale] : name;
    },
    productDescription() {
      const description = this.productMetadata?.description;
      if (description && description[this.collectionLocale] !== undefined) {
        return description[this.collectionLocale];
      }
      return description;
    },
    productImageUrl() {
      return this.isCollection ? this.collectionImageUrl : this.nftImageUrl;
    },
    productOwner() {
      return this.isCollection
        ? this.productMetadata?.ownerWallet
        : this.classOwner;
    },
    productAvailablePriceLabel() {
      return this.isCollection
        ? this.collectionAvailablePriceLabel
        : this.nftBookAvailablePriceLabel;
    },
    productCreator() {
      return this.isCollection ? this.collectionCreator : this.creator;
    },
    productCreatorAvatar() {
      return this.isCollection
        ? this.collectionCreatorAvatar
        : this.creatorAvatar;
    },
    productCreatorDisplayName() {
      return this.isCollection
        ? this.collectionCreatorDisplayName
        : this.creatorDisplayName;
    },
    productPrice() {
      return this.isCollection ? this.collectionPrice : this.NFTPrice;
    },
    productPriceWithFormat() {
      return formatNumberWithUSD(this.productPrice);
    },
    viewInfoLocation() {
      return this.isCollection
        ? this.localeLocation({
            name: 'nft-collection-collectionId',
            params: {
              collectionId: this.collectionId,
            },
            query: {
              ll_medium: this.mixinLinkMedium,
            },
          })
        : this.localeLocation({
            name: 'nft-class-classId',
            params: {
              classId: this.classId,
            },
            query: {
              ll_medium: this.mixinLinkMedium,
            },
          });
    },
  },
  methods: {
    async lazyFetchProductInfo() {
      if (this.isCollection) {
        await this.lazyFetchNFTCollectionInfo();
      } else {
        await this.lazyFetchNFTClassAggregatedData();
      }
    },
  },
};
