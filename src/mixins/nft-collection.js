import { parseNFTMetadataURL } from '~/util/nft';
import { mapActions, mapGetters } from 'vuex';
import { formatNumberWithUSD } from '~/util/ui';
import { catchAxiosError } from '~/util/misc';
import walletMixin from '~/mixins/wallet';
import { createUserInfoMixin } from '~/mixins/user-info';

const creatorInfoMixin = createUserInfoMixin({
  propKey: 'collectionCreator',
  walletKey: 'collectionOwner',
});

export default {
  mixins: [creatorInfoMixin, walletMixin],
  computed: {
    ...mapGetters([
      'getLikerId',
      'getUserInfoByAddress',
      'getNFTClassMetadataById',
      'getISCNMetadataById',
      'getCanViewNFTBookBeforeClaimByClassId',
      'getNFTCollectionInfoByCollectionId',
      'getIsHideNFTBookDownload',
    ]),
    classIds() {
      return this.collection?.classIds || [];
    },
    collection() {
      return this.getNFTCollectionInfoByCollectionId(this.collectionId);
    },
    formattedCollection() {
      if (!this.collection) {
        return {};
      }
      let { name, description, image } = this.collection;
      const { id, priceInDecimal, stock, ownerWallet } = this.collection;
      const price = priceInDecimal / 100;

      if (typeof name === 'object') {
        name = name[this.collectionLocale] || '';
      }
      if (typeof description === 'object') {
        description = description[this.collectionLocale] || '';
      }
      const priceLabel = formatNumberWithUSD(price);
      image = parseNFTMetadataURL(image);
      return {
        id,
        name,
        image,
        description,
        defaultPrice: this.collectionDefaultPrice,
        priceLabel,
        price,
        value: 0,
        stock,
        ownerWallet,
      };
    },
    collectionType() {
      return this.collection?.type;
    },
    collectionIsBook() {
      return this.collectionType === 'book';
    },
    collectionLocale() {
      let { locale } = this.$i18n;
      if (locale === 'zh-Hant') {
        locale = 'zh';
      }
      return locale;
    },
    collectionName() {
      const name = this.collection?.name;
      if (name?.[this.collectionLocale] !== undefined) {
        return name[this.collectionLocale];
      }
      return name;
    },
    collectionDescription() {
      const description = this.collection?.description;
      if (description?.[this.collectionLocale] !== undefined) {
        return description[this.collectionLocale];
      }
      return description;
    },
    collectionImageUrl() {
      const image = this.collection?.image;
      return image ? parseNFTMetadataURL(image) : '';
    },
    collectionOwner() {
      return this.collection?.ownerWallet;
    },
    collectionPrice() {
      const priceInDecimal = this.collection?.priceInDecimal || 0;
      const price = priceInDecimal / 100;
      return price;
    },
    collectionDefaultPrice() {
      return this.collectionPrice;
    },
    collectionAvailablePriceLabel() {
      return formatNumberWithUSD(this.collectionPrice);
    },
    collectionRoute() {
      return this.localeLocation({
        name: 'nft-collection-collectionId',
        params: { collectionId: this.collectionId },
      });
    },
    formattedNFTPriceInUSD() {
      return this.collectionPrice !== undefined
        ? formatNumberWithUSD(this.collectionPrice)
        : '-';
    },
    nftCollectionDetailsPageSharePath() {
      let from = this.getAddress || '';
      if (this.getLikerId) {
        from = `@${this.getLikerId}`;
      }
      return `/nft/collection/${
        this.collectionId
      }?from=${from}&utm_source=share&utm_medium=share_button`;
    },
  },
  methods: {
    ...mapActions([
      'lazyGetUserInfoByAddress',
      'lazyFetchNFTCollectionInfoByCollectionId',
    ]),
    async lazyFetchNFTCollectionInfo() {
      await catchAxiosError(
        this.lazyFetchNFTCollectionInfoByCollectionId({
          collectionId: this.collectionId,
        })
      );
    },
  },
};
