import { parseNFTMetadataURL } from '~/util/nft';
import { mapActions, mapGetters } from 'vuex';
import { formatNumberWithUSD } from '~/util/ui';
import { catchAxiosError } from '~/util/misc';

import { createUserInfoMixin } from '~/mixins/user-info';

const creatorInfoMixin = createUserInfoMixin({
  propKey: 'Creator',
  walletKey: 'collectionOwner',
});

export default {
  mixins: [creatorInfoMixin],
  computed: {
    ...mapGetters([
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
      let { name, description } = this.collection;
      const { id, priceInDecimal, stock } = this.collection;
      const price = priceInDecimal / 100;

      if (typeof name === 'object') {
        name = name[this.collectionLocale] || '';
      }
      if (typeof description === 'object') {
        description = description[this.collectionLocale] || '';
      }
      const priceLabel = formatNumberWithUSD(price);
      return {
        id,
        name,
        description,
        priceLabel,
        price,
        value: -1,
        stock,
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
      if (name[this.collectionLocale] !== undefined) {
        return name[this.collectionLocale];
      }
      return name;
    },
    collectionDescription() {
      const description = this.collection?.description;
      if (description[this.collectionLocale] !== undefined) {
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
      const { priceInDecimal } = this.collection;
      const price = priceInDecimal / 100;
      return price;
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
  },
  methods: {
    ...mapActions(['lazyFetchNFTCollectionInfoByCollectionId']),
    async lazyFetchNFTCollectionInfo() {
      await catchAxiosError(
        this.lazyFetchNFTCollectionInfoByCollectionId(this.classId)
      );
    },
  },
};
