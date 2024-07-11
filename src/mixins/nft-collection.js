import { parseNFTMetadataURL } from '~/util/nft';
import { mapActions, mapGetters } from 'vuex';
import { formatNumberWithUSD, formatNumberWithUnit } from '~/util/ui';
import { catchAxiosError } from '~/util/misc';
import { USD_TO_HKD_RATIO } from '~/constant';
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
      'getUserInfoByAddress',
      'getNFTClassMetadataById',
      'getISCNMetadataById',
      'getCanViewNFTBookBeforeClaimByClassId',
      'getNFTCollectionInfoByCollectionId',
      'getIsHideNFTBookDownload',
      'getNFTClassPaymentPriceById',
      'getNFTCollectionDefaultPaymentCurrency',
    ]),
    classIds() {
      return this.collection?.classIds || [];
    },
    collection() {
      return this.getNFTCollectionInfoByCollectionId(this.collectionId);
    },
    formattedCollection() {
      let { name, description } = this.collection;
      const { id, stock } = this.collection;
      const price = this.collectionPrice;

      if (typeof name === 'object') {
        name = name[this.collectionLocale] || '';
      }
      if (typeof description === 'object') {
        description = description[this.collectionLocale] || '';
      }
      const currency = this.getNFTCollectionDefaultPaymentCurrency(
        this.collectionId
      );
      const priceLabel =
        currency === 'HKD'
          ? formatNumberWithUnit(
              Number((price * USD_TO_HKD_RATIO).toFixed(1)),
              'HKD'
            )
          : formatNumberWithUSD(price);
      return {
        id,
        name,
        description,
        defaultPrice: this.collectionDefaultPrice,
        priceLabel,
        price,
        value: 0,
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
      const priceInDecimal = this.collection?.priceInDecimal || 0;
      const price =
        this.getNFTClassPaymentPriceById(this.collectionId)?.fiatPrice ||
        priceInDecimal / 100;
      return price;
    },
    collectionDefaultPrice() {
      return this.getNFTClassPaymentPriceById(this.collectionId)
        ?.fiatPricePrediscount;
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
  },
  methods: {
    ...mapActions([
      'lazyGetUserInfoByAddress',
      'lazyFetchNFTCollectionInfoByCollectionId',
      'lazyFetchNFTCollectionPaymentPriceInfoByCollectionId',
    ]),
    async lazyFetchNFTCollectionInfo() {
      await catchAxiosError(
        this.lazyFetchNFTCollectionInfoByCollectionId({
          collectionId: this.collectionId,
        })
      );
    },
    async lazyFetchNFTCollectionPaymentPriceInfo() {
      await catchAxiosError(
        this.lazyFetchNFTCollectionPaymentPriceInfoByCollectionId({
          collectionId: this.collectionId,
          coupon: this.$route.query.coupon,
        })
      );
    },
  },
};
