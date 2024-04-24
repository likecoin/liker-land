import { mapActions, mapGetters } from 'vuex';

import { CrispMixinFactory } from '~/mixins/crisp';

import {
  APP_LIKE_CO_VIEW,
  LIKECOIN_CHAIN_API,
  LIKECOIN_BUTTON_BASE,
  TX_STATUS,
  LIKECOIN_NFT_API_WALLET,
  LIKECOIN_NFT_CLASS_FREE_MINT,
  NFT_DISPLAY_STATE,
  NFT_BATCH_COLLECT_MESSSAGE,
  NFT_LEGACY_DEFAULT_MESSSAGE,
  NFT_AUTO_DELIVER_DEFAULT_MESSAGE,
  USD_TO_HKD_RATIO,
} from '~/constant';

import {
  postNFTPurchase,
  postNFTTransfer,
  getNFTModel,
  postNewStripeFiatPayment,
  getIdenticonAvatar,
  getNFTCountByClassId,
  getNftBookBuyerMessage,
  getNFTBookPurchaseLink,
  postNFTBookLIKEPurchaseEndpoint,
} from '~/util/api';
import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';
import { sleep, catchAxiosError } from '~/util/misc';
import {
  NFT_INDEXER_LIMIT_MAX,
  signTransferNFT,
  signGrant,
  signBuyNFT,
  broadcastTx,
  getNFTClassCollectionType,
  getFormattedNFTEvents,
  parseNFTMetadataURL,
  getNFTHistoryDataMap,
  populateGrantEvent,
  getUniqueAddressesFromEvent,
  nftClassCollectionType,
} from '~/util/nft';
import { getDynamicCovers } from '~/util/nft-book';
import {
  formatNumberWithLIKE,
  formatNumberWithUSD,
  formatNumberWithUnit,
} from '~/util/ui';

import walletMixin from '~/mixins/wallet';
import alertMixin from '~/mixins/alert';
import utmMixin from '~/mixins/utm';
import { createUserInfoMixin } from '~/mixins/user-info';
import { createNFTClassCollectionMixin } from '~/mixins/nft-class-collection';

const creatorInfoMixin = createUserInfoMixin({
  propKey: 'Creator',
  walletKey: 'iscnOwner',
});

const nftClassCollectionMixin = createNFTClassCollectionMixin({
  propKey: 'nft',
  typeKey: 'nftClassCollectionType',
});

const defaultThemeColor = ['#D1D1D1', '#FFC123', '#ECBDF3'];

export default {
  mixins: [
    walletMixin,
    alertMixin,
    creatorInfoMixin,
    nftClassCollectionMixin,
    utmMixin,
    CrispMixinFactory({ isBootAtMounted: true }),
  ],
  head() {
    // Only load stripe if a wallet is connected
    if (!this.getAddress) return {};
    return {
      link: [
        {
          hid: 'stripe-js-link',
          rel: 'preload',
          href: 'https://js.stripe.com/v3',
          as: 'script',
        },
      ],
      script: [
        {
          hid: 'stripe-js-script',
          src: 'https://js.stripe.com/v3',
          defer: true,
        },
      ],
    };
  },
  data() {
    return {
      NFTHistory: [],

      userCollectedCount: undefined,

      isOwnerInfoLoading: false,
      isHistoryInfoLoading: false,
      isRecommendationLoading: false,
    };
  },
  computed: {
    ...mapGetters([
      'getGaClientId',
      'getGaSessionId',
      'getUserInfoByAddress',
      'getISCNMetadataById',
      'getNFTClassFeaturedSetByAddress',
      'getNFTClassHiddenSetByAddress',
      'getNFTClassPurchaseInfoById',
      'getNFTClassListingInfoById',
      'getNFTClassMetadataById',
      'getNFTClassOwnerInfoById',
      'getNFTClassPaymentPriceById',
      'getNFTClassOwnerCount',
      'getNFTClassCollectedCount',
      'getNFTMetadataByNFTClassAndNFTId',
      'getCollectedNFTClassesByAddress',
      'getCreatedNFTClassesByAddress',
      'getNFTBookStorePricesByClassId',
      'getNFTCollectionInfoByClassId',
      'getNFTBookStoreBookDefaultPaymentCurrency',
      'getCanViewNFTBookBeforeClaimByClassId',
      'getIsHideNFTBookDownload',
      'uiIsOpenCollectModal',
      'uiTxErrorMessage',
      'uiTxTargetClassId',
      'uiTxNFTStatus',
    ]),
    NFTClassMetadata() {
      return this.getNFTClassMetadataById(this.classId) || {};
    },
    nftMetadata() {
      return (
        this.getNFTMetadataByNFTClassAndNFTId(this.classId, this.nftId) || {}
      );
    },
    nftClassCollectionType() {
      return getNFTClassCollectionType(this.NFTClassMetadata);
    },
    nftClassCollectionName() {
      return this.NFTClassMetadata.nft_meta_collection_name || '';
    },
    nftClassCreatorMessage() {
      return this.NFTClassMetadata.message || '';
    },
    purchaseInfo() {
      const info = this.getNFTClassPurchaseInfoById(this.classId) || {};
      const {
        price,
        collectExpiryAt,
        metadata: { nextNewNFTId, soldCount, basePrice } = {},
      } = info;
      return {
        price,
        collectExpiryAt,
        soldCount,
        basePrice,
        classId: this.classId,
        nftId: nextNewNFTId,
        seller: LIKECOIN_NFT_API_WALLET,
      };
    },
    listingInfo() {
      const list = this.getNFTClassListingInfoById(this.classId) || [];
      if (list.length) {
        const { price, nftId, seller } = list[0];
        return {
          price,
          classId: this.classId,
          nftId,
          seller,
        };
      }
      return {};
    },
    ownerInfo() {
      return this.getNFTClassOwnerInfoById(this.classId) || {};
    },
    iscnId() {
      return (
        this.NFTClassMetadata.parent?.iscnIdPrefix ||
        this.NFTClassMetadata.parent?.iscn_id_prefix
      );
    },
    iscnOwner() {
      return (
        // TODO: refactor iscn owner data location
        this.iscnData?.owner ||
        this.NFTClassMetadata?.iscn_owner ||
        this.NFTClassMetadata.account_owner
      );
    },
    iscnWorkAuthor() {
      return this.iscnData?.contentMetadata?.author?.trim();
    },
    iscnURL() {
      return `${APP_LIKE_CO_VIEW}/${encodeURIComponent(this.iscnId)}`;
    },
    // nft info
    NFTName() {
      return this.NFTClassMetadata.name;
    },
    nftName() {
      return this.nftMetadata.name || this.NFTName;
    },
    NFTDescription() {
      const overrideKey = `nft_override_${this.classId}_description`;
      const hasOverride = this.$te(overrideKey);
      if (hasOverride) return this.$t(overrideKey);
      return this.NFTClassMetadata.description;
    },
    nftDescription() {
      const overrideKey = `nft_override_${this.classId}_description`;
      const hasOverride = this.$te(overrideKey);
      if (hasOverride) return this.$t(overrideKey);
      return this.nftMetadata.description || this.NFTDescription;
    },
    NFTImageUrl() {
      const { image = '' } = this.NFTClassMetadata;
      return parseNFTMetadataURL(image);
    },
    nftImageURL() {
      const image = this.nftMetadata.image || this.NFTImageUrl;
      return parseNFTMetadataURL(image);
    },
    NFTAnimationUrl() {
      const { animation_url: video = '' } = this.NFTClassMetadata;
      return parseNFTMetadataURL(video);
    },
    nftAnimationURL() {
      const video = this.nftMetadata.animation_url || this.NFTAnimationUrl;
      return parseNFTMetadataURL(video);
    },
    nftModelURL() {
      return this.nftIsWritingNFT
        ? getNFTModel({ classId: this.classId })
        : undefined;
    },
    NFTImageBackgroundColor() {
      return this.NFTClassMetadata.background_color;
    },
    nftImageBackgroundColor() {
      return this.nftMetadata.background_color || this.NFTImageBackgroundColor;
    },
    NFTExternalUrl() {
      return this.NFTClassMetadata.external_url;
    },
    nftExternalURL() {
      return this.nftMetadata.external_url || this.NFTExternalUrl;
    },
    externalUrl() {
      // Prioritize iscn url for nft book since book info might be in iscn
      return this.nftIsNFTBook
        ? this.iscnUrl || this.nftExternalURL
        : this.nftExternalURL;
    },
    iscnData() {
      const data = this.getISCNMetadataById(this.iscnId);
      if (data instanceof Promise) return undefined;
      return data;
    },
    iscnDescription() {
      return this.iscnData?.contentMetadata?.description;
    },
    iscnUrl() {
      return this.iscnData?.contentMetadata?.url;
    },
    iscnContentUrls() {
      return this.iscnData?.contentMetadata?.sameAs || [];
    },
    nftISCNContentFingerprints() {
      return this.iscnData?.contentFingerprints || [];
    },
    nftIsUseListingPrice() {
      return (
        this.listingInfo &&
        this.listingInfo.price &&
        (!this.purchaseInfo ||
          !this.purchaseInfo.price ||
          this.listingInfo.price < this.purchaseInfo.price)
      );
    },
    NFTPrice() {
      return this.nftIsNFTBook
        ? this.nftPaymentPriceInUSD
        : this.purchaseInfo.price;
    },
    collectExpiryTime() {
      return this.purchaseInfo.collectExpiryAt;
    },
    nftIsCollectable() {
      return this.NFTPrice !== undefined && this.NFTPrice !== -1;
    },
    paymentInfo() {
      const result =
        this.getNFTClassPaymentPriceById(
          this.classId,
          this.editionPriceIndex
        ) || {};
      return result;
    },
    nftPriceInLIKE() {
      return this.paymentInfo?.LIKEPrice;
    },
    nftPrediscountedLIKE() {
      return this.paymentInfo?.LIKEPricePrediscount;
    },
    nftIsFree() {
      return this.NFTPrice !== undefined && this.NFTPrice === 0;
    },
    formattedNFTPriceInLIKE() {
      return this.NFTPrice ? formatNumberWithLIKE(this.nftPriceInLIKE) : '-';
    },
    formattedNFTPrediscountedLIKE() {
      return this.NFTPrice
        ? formatNumberWithLIKE(this.nftPrediscountedLIKE)
        : '-';
    },
    nftPaymentPriceInUSD() {
      return this.paymentInfo?.fiatPrice || undefined;
    },
    // alias of NFTPrice
    NFTPriceUSD() {
      return this.NFTPrice;
    },
    formattedNFTPriceInUSD() {
      return this.nftPaymentPriceInUSD !== undefined
        ? formatNumberWithUSD(this.nftPaymentPriceInUSD)
        : '-';
    },
    controlBarPriceLabel() {
      if (this.nftIsNFTBook) {
        return this.nftBookAvailablePriceLabel;
      }
      return this.NFTPrice && formatNumberWithUSD(this.NFTPrice);
    },
    collectorMap() {
      return this.getNFTClassOwnerInfoById(this.classId) || {};
    },
    ownerCount() {
      return this.getNFTClassOwnerCount(this.classId);
    },
    sortedOwnerListId() {
      const { collectorMap } = this;
      return Object.keys(collectorMap).sort(
        (a, b) => collectorMap[b].length - collectorMap[a].length
      );
    },
    collectedCount() {
      return this.getNFTClassCollectedCount(this.classId);
    },
    nftSoldCount() {
      return this.purchaseInfo.soldCount || 0;
    },
    // For W.NFT
    nftBasePrice() {
      return this.purchaseInfo.basePrice;
    },

    nftEditions() {
      let { locale } = this.$i18n;
      if (locale === 'zh-Hant') {
        locale = 'zh';
      }
      const defaultLocale = 'en';
      const prices = this.getNFTBookStorePricesByClassId(this.classId);
      const currency = this.getNFTBookStoreBookDefaultPaymentCurrency(
        this.classId
      );
      const defaultEdition = {
        name: '',
        description: '',
        price: 0,
        priceLabel: this.formattedNFTPriceInUSD,
        value: 0,
        isPhysicalOnly: false,
        isAllowCustomPrice: false,
        hasShipping: false,
        stock: this.nftIsCollectable
          ? this.getNFTClassListingInfoById(this.classId)?.length
          : 0,
        defaultPrice: 0,
        currency,
      };
      return prices
        ? prices.map((edition, index) => {
            let { name, description } = edition;

            if (typeof name === 'object') {
              name = name[locale] || name[defaultLocale] || '';
            }
            if (typeof description === 'object') {
              description =
                description[locale] || description[defaultLocale] || '';
            }
            const price =
              this.getNFTClassPaymentPriceById(this.classId, index)
                ?.fiatPrice || edition.price;
            let priceLabel = formatNumberWithUSD(price);
            // TODO: support more currency
            if (currency === 'HKD') {
              priceLabel = formatNumberWithUnit(
                Number((price * USD_TO_HKD_RATIO).toFixed(1)),
                'HKD'
              );
            }
            const {
              stock,
              isPhysicalOnly,
              isAllowCustomPrice,
              hasShipping,
            } = edition;
            const style = {
              spineColor1: edition.spineColor1 || '#EBEBEB',
              spineColor2: edition.spineColor2 || '#9B9B9B',
              themeColor:
                edition.themeColor ||
                defaultThemeColor[index % defaultThemeColor.length],
            };

            return {
              name,
              currency,
              description,
              priceLabel,
              price,
              value: index,
              stock,
              style,
              isAllowCustomPrice,
              isPhysicalOnly,
              hasShipping,
              dynamicCovers: getDynamicCovers(this.classId, edition.index),
              defaultPrice: edition.price,
            };
          })
        : [defaultEdition];
    },
    editionPriceIndex() {
      if (!this.nftIsNFTBook) return undefined;
      return Number(this.$route.query.price_index) || 0;
    },
    nftCollections() {
      const collections = this.getNFTCollectionInfoByClassId(this.classId);
      let { locale } = this.$i18n;
      if (locale === 'zh-Hant') {
        locale = 'zh';
      }
      const defaultLocale = 'en';
      return collections.map(collection => {
        let { name, description } = collection;
        const { id, priceInDecimal, stock, image } = collection;
        const price = priceInDecimal / 100;

        if (typeof name === 'object') {
          name = name[locale] || name[defaultLocale] || '';
        }
        if (typeof description === 'object') {
          description = description[locale] || description[defaultLocale] || '';
        }
        const priceLabel = formatNumberWithUSD(price);
        return {
          id,
          name,
          image,
          description,
          priceLabel,
          price,
          value: -1,
          stock,
        };
      });
    },
    nftBookAvailablePriceLabel() {
      const purchasePrice = this.nftEditions.find(item => item.stock > 0)
        ?.priceLabel;
      return purchasePrice;
    },
    nftMustClaimToView() {
      return !this.getCanViewNFTBookBeforeClaimByClassId(this.classId);
    },
    nftIsDownloadHidden() {
      return this.getIsHideNFTBookDownload(this.classId);
    },
    userCollectedNFTList() {
      const collectedList = this.collectorMap[this.getAddress];
      return collectedList ? Object.values(collectedList) : [];
    },

    // Collector Info
    nftCollectorWalletAddress() {
      if (!this.nftId) return '';
      return Object.keys(this.collectorMap).find(collector => {
        const nftIdList = this.collectorMap[collector];
        return nftIdList.find(nftId => this.nftId === nftId);
      });
    },
    nftCollectorCollectedNFTList() {
      return [
        ...(this.collectorMap[this.nftCollectorWalletAddress] || []),
      ].sort();
    },
    nftCollectorCollectedCount() {
      return this.nftCollectorCollectedNFTList.length || 0;
    },
    nftIsNew() {
      return !Object.values(this.collectorMap)
        .flat()
        .includes(this.nftId);
    },
    nftCreatorMessage() {
      return this.NFTClassMetadata?.message || '';
    },
    nftCreatorMessageWithParsing() {
      const collector =
        this.getAddress || this.$t('nft_message_replacer_collector');
      return this.nftCreatorMessage.replaceAll('{collector}', collector);
    },
    isNFTHidden() {
      return this.getNFTClassHiddenSetByAddress(this.iscnOwner)?.has(
        this.classId
      );
    },

    populatedEvents() {
      return this.NFTHistory.map(event => ({
        ...event,
        toDisplayName:
          this.getUserInfoByAddress(event.toWallet)?.displayName ||
          event.toWallet,
        fromDisplayName:
          this.getUserInfoByAddress(event.fromWallet)?.displayName ||
          event.fromWallet,
      }));
    },
    populatedDisplayEvents() {
      return this.populatedEvents.filter(e => e.event !== 'grant');
    },
    populatedCollectors() {
      return this.sortedOwnerListId.map(id => {
        const owner = this.getUserInfoByAddress(id);
        return {
          id,
          displayName: owner?.displayName || id,
          collectedCount: this.collectorMap[id].length,
          collectedFirstNFTId: this.collectorMap[id][0],
          avatar: owner?.avatar || getIdenticonAvatar(id),
          isCivicLiker:
            owner?.isCivicLikerTrial || owner?.isSubscribedCivicLiker,
        };
      });
    },
    ownCount() {
      const collector = this.populatedCollectors.find(
        ({ id }) => id === this.getAddress
      );
      return collector?.collectedCount || 0;
    },
    nftClassDetailsPageURL() {
      return `/nft/class/${this.classId}?referrer=${this.getAddress}`;
    },
    nftIdCollectedFirstByUser() {
      const ownNFT = this.collectorMap[this.getAddress];
      return ownNFT?.[0];
    },
    nftIdCollectNext() {
      return this.nftIsUseListingPrice
        ? this.listingInfo.nftId
        : this.purchaseInfo?.nftId;
    },
    nftCollectRoute() {
      return this.localeLocation({
        name: 'nft-class-classId',
        params: { classId: this.classId },
      });
    },
    rawDataURL() {
      return `${LIKECOIN_CHAIN_API}/cosmos/nft/v1beta1/classes/${this.classId}`;
    },
    nftWidgetURL() {
      return `${LIKECOIN_BUTTON_BASE}/in/like/iscn/?iscn_id=${encodeURIComponent(
        this.iscnId
      )}`;
    },
    nftWidgetImageURL() {
      return `${LIKECOIN_BUTTON_BASE}/in/embed/nft/image?class_id=${encodeURIComponent(
        this.classId
      )}`;
    },

    getWalletIdentityType() {
      return wallet => (wallet === this.iscnOwner ? 'creator' : 'collector');
    },
    nftDisplayState() {
      // should use the address in URL as the subject address when browsing other's profile
      const subjectAddress =
        this.getRouteBaseName(this.$route) === 'id'
          ? this.$route.params.id
          : this.getAddress;
      if (
        this.getNFTClassFeaturedSetByAddress(subjectAddress)?.has(this.classId)
      ) {
        return NFT_DISPLAY_STATE.FEATURED;
      }
      if (
        this.getNFTClassHiddenSetByAddress(subjectAddress)?.has(this.classId)
      ) {
        return NFT_DISPLAY_STATE.HIDDEN;
      }
      return NFT_DISPLAY_STATE.DEFAULT;
    },
    messageList() {
      return [...this.populatedEvents]
        .filter(e => e.event !== 'new_class')
        .map(e => {
          if (e.event === 'purchase') {
            return {
              ...e,
              fromWallet: this.iscnOwner,
            };
          }
          return e;
        })
        .map(m => ({
          ...m,
          messageType:
            m.fromWallet === this.iscnOwner ? 'creator' : 'collector',
          fromType: this.getWalletIdentityType(m.fromWallet),
          toType: this.getWalletIdentityType(m.toWallet),
          message: this.normalizeNFTMessage(m),
        }));
    },
    recommendedList() {
      const featuredSet = this.getNFTClassFeaturedSetByAddress(this.iscnOwner);
      const hiddenSet = this.getNFTClassHiddenSetByAddress(this.iscnOwner);

      let recommendedList =
        this.getCreatedNFTClassesByAddress(this.iscnOwner) || [];
      const userCollected =
        this.getCollectedNFTClassesByAddress(this.getAddress) || [];

      recommendedList = recommendedList.filter(
        item =>
          !userCollected.some(
            collectedItem => collectedItem.classId === item.classId
          ) && item.classId !== this.classId
      );
      if (hiddenSet) {
        recommendedList = recommendedList.filter(
          item => !hiddenSet.has(item.classId)
        );
      }

      if (featuredSet) {
        const featuredItems = recommendedList.filter(item =>
          featuredSet.has(item.classId)
        );
        recommendedList = featuredItems.concat(
          recommendedList.filter(item => !featuredSet.has(item.classId))
        );
      }

      if (this.nftIsNFTBook) {
        const sortedList = [...recommendedList];
        sortedList.sort((a, b) => {
          if (
            a.type === nftClassCollectionType.NFTBook &&
            b.type !== nftClassCollectionType.NFTBook
          ) {
            return -1;
          }
          if (
            a.type !== nftClassCollectionType.NFTBook &&
            b.type === nftClassCollectionType.NFTBook
          ) {
            return 1;
          }
          return 0;
        });
        return sortedList.slice(0, 5);
      }

      return recommendedList.slice(0, 5);
    },
    nftTxErrorIsAlreadyCollected() {
      return this.uiTxErrorMessage === 'ALREADY_MINTED';
    },
  },
  watch: {
    getAddress(newAddress) {
      if (newAddress) {
        this.fetchUserCollectedCount();
      }
    },
    uiTxNFTStatus(status) {
      if (
        this.classId === this.uiTxTargetClassId &&
        status === TX_STATUS.COMPLETED
      ) {
        this.fetchUserCollectedCount();
      }
    },
    userCollectedCount(newCount, oldCount) {
      if (
        newCount === 1 &&
        oldCount === 0 &&
        !this.nftIdCollectedFirstByUser &&
        !this.nftCollectorsSync
      ) {
        const syncFunction = async () => {
          // `fetchNFTOwners` might take longer to return the most updated collectors
          // causing `nftIdCollectedFirstByUser` to be undefined or collectors list out-sync
          // Should keep fetching if the user just collected the NFT but not found in the collectors list
          let tries = 0;
          while (!this.nftIdCollectedFirstByUser && tries < 10) {
            // eslint-disable-next-line no-await-in-loop
            await this.updateNFTOwners();
            // eslint-disable-next-line no-await-in-loop
            await sleep(3000);
            tries += 1;
          }
          this.nftCollectorsSync = undefined;
        };
        this.nftCollectorsSync = syncFunction();
      }
    },
  },
  methods: {
    ...mapActions([
      'lazyGetUserInfoByAddress',
      'lazyGetISCNMetadataById',
      'lazyFetchNFTClassAggregatedInfo',
      'lazyGetNFTClassMetadata',
      'lazyGetNFTPurchaseAndListingInfo',
      'lazyGetNFTOwners',
      'fetchNFTPurchaseInfo',
      'fetchNFTListingInfo',
      'fetchNFTClassMetadata',
      'fetchNFTOwners',
      'fetchNFTPaymentPriceInfoByClassId',
      'initIfNecessary',
      'uiToggleCollectModal',
      'uiSetCollectedCount',
      'uiSetTxStatus',
      'uiSetTxError',
      'uiCloseTxModal',
      'walletFetchLIKEBalance',
      'lazyGetUserInfoByAddresses',
      'fetchCreatedNFTClassesByAddress',
      'fetchCollectedNFTClassesByAddress',
      'fetchNFTDisplayStateListByAddress',
      'fetchNFTBookInfoByClassId',
      'lazyFetchNFTBookInfoByClassId',
      'fetchNFTBookPaymentPriceInfoByClassIdAndPriceIndex',
      'lazyFetchNFTBookPaymentPriceInfoByClassIdAndPriceIndex',
      'fetchNFTCollectionInfoByClassId',
    ]),
    async fetchISCNMetadata() {
      await this.lazyGetISCNMetadataById(this.iscnId);
    },
    async lazyFetchNFTClassMetadata() {
      await catchAxiosError(this.lazyGetNFTClassMetadata(this.classId));
      if (this.iscnOwner) {
        this.lazyGetUserInfoByAddresses(this.iscnOwner);
      }
    },
    async lazyFetchNFTClassAggregatedData() {
      await catchAxiosError(this.lazyFetchNFTClassAggregatedInfo(this.classId));
    },
    async updateNFTPurchaseInfo() {
      await catchAxiosError(this.fetchNFTPurchaseInfo(this.classId));
      catchAxiosError(this.fetchNFTListingInfo(this.classId));
    },
    async fetchNFTPrices() {
      await catchAxiosError(
        this.nftIsNFTBook
          ? this.fetchNFTBookPaymentPriceInfoByClassIdAndPriceIndex({
              classId: this.classId,
              priceIndex: this.editionPriceIndex,
            })
          : this.fetchNFTPaymentPriceInfoByClassId(this.classId)
      );
    },
    async fetchNFTBookPaymentPriceInfo() {
      await catchAxiosError(
        this.fetchNFTBookPaymentPriceInfoByClassIdAndPriceIndex({
          classId: this.classId,
          priceIndex: this.editionPriceIndex,
          coupon: this.$route.query.coupon,
        })
      );
    },
    async lazyFetchNFTBookPaymentPriceInfo() {
      await catchAxiosError(
        this.lazyFetchNFTBookPaymentPriceInfoByClassIdAndPriceIndex({
          classId: this.classId,
          priceIndex: this.editionPriceIndex,
          coupon: this.$route.query.coupon,
        })
      );
    },
    async lazyFetchNFTBookPaymentPriceInfoForAllEditions() {
      const prices = this.getNFTBookStorePricesByClassId(this.classId);
      await Promise.all(
        prices.map((_, index) =>
          catchAxiosError(
            this.lazyFetchNFTBookPaymentPriceInfoByClassIdAndPriceIndex({
              classId: this.classId,
              priceIndex: index,
              coupon: this.$route.query.coupon,
            })
          )
        )
      );
    },
    async fetchRelatedNFTCollection({ type } = {}) {
      const res = await catchAxiosError(
        this.fetchNFTCollectionInfoByClassId({
          classId: this.classId,
          type,
        })
      );
      return res;
    },
    lazyFetchNFTOwners() {
      return this.lazyGetNFTOwners(this.classId);
    },
    updateNFTOwners() {
      return this.fetchNFTOwners(this.classId);
    },
    async updateNFTHistory({ getAllUserInfo = false, trimmedCount = 10 }) {
      this.isHistoryInfoLoading = true;
      const actionType = [
        '/cosmos.nft.v1beta1.MsgSend',
        'buy_nft',
        'sell_nft',
        'new_class',
      ];
      if (!this.nftIsWritingNFT && !this.nftIsNFTBook) {
        actionType.push('mint_nft');
      }

      const ignoreToList =
        this.nftIsWritingNFT || this.nftIsNFTBook
          ? LIKECOIN_NFT_API_WALLET
          : '';
      let dbEventMap = null;
      if (this.nftIsWritingNFT) {
        dbEventMap = await getNFTHistoryDataMap({
          axios: this.$api,
          classId: this.classId,
          nftId: this.nftId,
        });
      }
      const {
        nextKey,
        events: latestBatchEvents,
      } = await getFormattedNFTEvents({
        axios: this.$api,
        classId: this.classId,
        nftId: this.nftId,
        actionType,
        ignoreToList,
      });

      const nftBookLatestBatchEvents = [];
      try {
        if (this.nftIsNFTBook) {
          const { messages: nftBookBuyerMessages } = await this.$api.$get(
            getNftBookBuyerMessage(this.classId)
          );
          if (nftBookBuyerMessages && nftBookBuyerMessages.length) {
            for (let i = 0; i < nftBookBuyerMessages.length; i += 1) {
              const buyerMessage = nftBookBuyerMessages[i].message;
              const { txHash } = nftBookBuyerMessages[i];

              const matchingEvent = latestBatchEvents.find(
                event => event.txHash === txHash
              );

              if (matchingEvent) {
                matchingEvent.buyerMessage = buyerMessage;
              }
            }
          }
          latestBatchEvents.forEach(event => {
            const {
              classId,
              nftId,
              fromWallet,
              toWallet,
              buyerMessage,
              txHash,
              timestamp,
            } = event;
            nftBookLatestBatchEvents.push(event);
            if (buyerMessage) {
              nftBookLatestBatchEvents.push({
                event: 'grant',
                classId,
                nftId,
                fromWallet: toWallet,
                toWallet: this.iscnOwner || fromWallet,
                memo: buyerMessage,
                txHash,
                timestamp: timestamp - 1,
              });
            }
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }

      if (this.nftIsWritingNFT) {
        this.NFTHistory = populateGrantEvent(latestBatchEvents, dbEventMap);
      } else {
        this.NFTHistory = nftBookLatestBatchEvents;
      }

      const uniqueAddresses = getUniqueAddressesFromEvent(this.NFTHistory);
      this.lazyGetUserInfoByAddresses(
        getAllUserInfo
          ? uniqueAddresses
          : uniqueAddresses.slice(0, trimmedCount)
      );
      this.isHistoryInfoLoading = false;

      if (latestBatchEvents.length === NFT_INDEXER_LIMIT_MAX) {
        let { events: remainEvents } = await getFormattedNFTEvents({
          axios: this.$api,
          classId: this.classId,
          nftId: this.nftId,
          key: nextKey,
          actionType,
          ignoreToList,
          getAll: true,
        });
        if (this.nftIsWritingNFT) {
          remainEvents = populateGrantEvent(remainEvents, dbEventMap);
        }
        const uniqueAddresses = getUniqueAddressesFromEvent(this.NFTHistory);
        this.lazyGetUserInfoByAddresses(
          getAllUserInfo
            ? uniqueAddresses
            : uniqueAddresses.slice(0, trimmedCount)
        );
        this.NFTHistory.push(...remainEvents);
      }
    },
    async updateUserCollectedCount(classId, address) {
      if (!address || !classId) {
        this.userCollectedCount = undefined;
        return;
      }
      this.isOwnerInfoLoading = true;
      /* HACK: Use restful API instead of cosmjs to avoid loading libsodium,
        which is huge and affects index page performance */
      // const { amount } = await getNFTCountByClassId(classId, address);
      const { amount } = await this.$api.$get(
        getNFTCountByClassId(classId, address)
      );
      this.userCollectedCount = Number(amount);
      this.isOwnerInfoLoading = false;
    },
    async fetchUserCollectedCount() {
      await this.updateUserCollectedCount(this.classId, this.getAddress);
    },
    async fetchIscnOwnerNFTDisplayStateList() {
      await this.fetchNFTDisplayStateListByAddress(this.iscnOwner);
    },
    async fetchUserNFTDisplayStateList() {
      await this.fetchNFTDisplayStateListByAddress(this.getAddress);
    },
    async collectNFT() {
      if (!this.nftIsCollectable) {
        return;
      }
      this.$router.push({ query: { ...this.$route.query, action: 'collect' } });
      try {
        const purchaseEventParams = {
          price: this.NFTPriceUSD,
          currency: 'USD',
          items: [
            {
              classId: this.classId,
              price: this.NFTPriceUSD,
              name: this.NFTName,
            },
          ],
        };
        logPurchaseFlowEvent(this, 'add_to_cart', purchaseEventParams);
        logPurchaseFlowEvent(this, 'begin_checkout', purchaseEventParams);
        await this.initIfNecessary();
        if (this.hasConnectedWallet) {
          logPurchaseFlowEvent(this, 'add_shipping_info', purchaseEventParams);
          this.fetchUserCollectedCount();
          this.walletFetchLIKEBalance();
        }
        this.uiToggleCollectModal({ classId: this.classId });
      } catch (error) {
        this.uiSetTxError(error.response?.data || error.toString());
        this.uiSetTxStatus(TX_STATUS.FAILED);
      } finally {
        this.$router.push({
          query: { ...this.$route.query, action: undefined },
        });
      }
    },
    async collectNFTWithLIKE(classId, { memo = '', email = '' }) {
      logTrackerEvent(
        this,
        'NFT',
        `NFTCollectNFTWithLIKE(${this.walletMethodType})`,
        classId,
        1
      );
      try {
        await this.walletFetchLIKEBalance();
        if (
          this.walletLIKEBalance === 0 ||
          this.walletLIKEBalance < this.nftPriceInLIKE
        ) {
          logTrackerEvent(
            this,
            'NFT',
            'NFTCollectErrorNoBalance',
            this.getAddress,
            1
          );
          this.uiSetTxError('INSUFFICIENT_BALANCE');
          this.uiSetTxStatus(TX_STATUS.INSUFFICIENT);
          return undefined;
        }

        const { nftIsUseListingPrice } = this;
        this.uiSetTxStatus(TX_STATUS.SIGN);
        logTrackerEvent(
          this,
          'NFT',
          nftIsUseListingPrice
            ? 'NFTCollectSignBuyRequested'
            : 'NFTCollectSignGrantRequested',
          classId,
          1
        );
        let signData;
        if (nftIsUseListingPrice) {
          const { price, nftId, seller } = this.listingInfo;
          signData = await signBuyNFT({
            senderAddress: this.getAddress,
            classId,
            nftId,
            seller,
            memo,
            priceInLIKE: price,
            signer: this.getSigner,
          });
        } else {
          signData = await signGrant({
            senderAddress: this.getAddress,
            amountInLIKE: this.nftPriceInLIKE,
            signer: this.getSigner,
            memo,
          });
        }
        this.uiSetTxStatus(TX_STATUS.PROCESSING);
        logTrackerEvent(
          this,
          'NFT',
          nftIsUseListingPrice
            ? 'NFTCollectSignBuyApproved'
            : 'NFTCollectSignGrantApproved',
          classId,
          1
        );
        const { txHash, code } = await broadcastTx(signData, this.getSigner);
        logTrackerEvent(
          this,
          'NFT',
          'NFTCollectBroadcastTxComplete',
          classId,
          1
        );
        if (code !== 0) {
          const errorHandler = this.getErrorHandlerByCode(code);
          if (errorHandler) {
            this.handleError(errorHandler);
            return undefined;
          }
          throw new Error(`TX_FAILED_WITH_CODE_${code}`);
        }
        if (txHash && this.uiIsOpenCollectModal) {
          logTrackerEvent(this, 'NFT', 'NFTCollectPurchase', classId, 1);
          let result;
          if (nftIsUseListingPrice) {
            result = { data: { nftId: this.listingInfo.nftId } };
          } else {
            this.uiSetTxStatus(TX_STATUS.PROCESSING_NON_BLOCKING);
            if (this.nftIsNFTBook) {
              result = await this.$api.post(
                postNFTBookLIKEPurchaseEndpoint({
                  classId,
                  priceIndex: this.editionPriceIndex,
                }),
                { txHash, email }
              );
            } else {
              result = await this.$api.post(
                postNFTPurchase({
                  txHash,
                  classId,
                  ts: Date.now(),
                })
              );
            }
          }
          logTrackerEvent(
            this,
            'NFT',
            'NFTCollectPurchaseCompleted',
            classId,
            1
          );
          logPurchaseFlowEvent(this, 'purchase', {
            txHash,
            items: [
              {
                name: this.NFTName,
                price: this.NFTPriceUSD,
                classId,
              },
            ],
            price: this.NFTPriceUSD,
            currency: 'USD',
          });
          if (this.uiTxTargetClassId === classId) {
            this.uiSetTxStatus(TX_STATUS.COMPLETED);
          } else {
            this.alertPromptSuccess(
              this.$t('nft_collect_modal_alert_success', {
                name: this.NFTName,
              })
            );
          }
          return result.data;
        }
      } catch (error) {
        if (error.toString().includes('code 32')) {
          const errorHandler = this.getErrorHandlerByCode(32);
          this.handleError(errorHandler);
          return undefined;
        }
        const errMsg = error.response?.data || error.toString();
        this.uiSetTxError(errMsg);
        if (this.uiTxTargetClassId === classId) {
          this.uiSetTxStatus(TX_STATUS.FAILED);
        } else {
          this.alertPromptError(
            this.$t('nft_collect_modal_alert_fail', {
              name: this.NFTName,
              error: errMsg,
            })
          );
        }
      } finally {
        this.fetchCollectedNFTClassesByAddress(this.getAddress);
        this.lazyFetchNFTClassAggregatedData();
        this.updateNFTHistory({ getAllUserInfo: false });
        this.walletFetchLIKEBalance();
      }
      return undefined;
    },
    handleError(error) {
      this.uiSetTxError(error.message);
      this.uiSetTxStatus(TX_STATUS.FAILED);
      if (typeof error?.runAction === 'function') {
        error.runAction();
      }
    },
    getErrorHandlerByCode(code) {
      switch (code) {
        case 38:
          return {
            message: 'NFT_IS_ALREADY_BOUGHT',
            runAction: () => this.updateNFTPurchaseInfo(),
          };

        case 13:
          return {
            message: 'INSUFFICIENT_GAS_FEE',
          };

        case 32:
          return {
            message: 'SEQ_MISMATCH',
          };

        default:
          return {};
      }
    },
    async collectNFTWithStripe(classId, { memo = '' } = {}) {
      if (this.nftIsNFTBook) {
        const gaClientId = this.getGaClientId;
        const gaSessionId = this.getGaSessionId;
        const link = getNFTBookPurchaseLink({
          classId: this.classId,
          priceIndex: this.editionPriceIndex,
          platform: this.platform,
        });
        const { url } = await this.$axios.$post(link, {
          gaClientId,
          gaSessionId,
          coupon: this.$route.query.coupon,
          utmCampaign: this.utmCampaign,
          utmSource: this.utmSource,
          utmMedium: this.utmMedium,
          email: this.walletEmail,
        });
        if (url) {
          window.location.href = url;
        } else {
          throw new Error('Failed to get purchase link');
        }
      } else {
        try {
          const gaClientId = this.getGaClientId;
          const gaSessionId = this.getGaSessionId;
          const body = {
            memo,
            gaClientId,
            gaSessionId,
            coupon: this.$route.query.coupon,
            utmCampaign: this.utmCampaign,
            utmSource: this.utmSource,
            utmMedium: this.utmMedium,
          };
          if (this.walletEmail) {
            body.email = this.walletEmail;
          }
          const { url } = await this.$api.$post(
            postNewStripeFiatPayment({
              classId,
              wallet: this.getAddress,
            }),
            body
          );
          if (url) window.location.href = url;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    },
    async collectFreeNFT(classId, { memo = '' }) {
      logTrackerEvent(this, 'NFT', 'NFTCollectFreeNFT', classId, 1);
      try {
        this.uiSetTxStatus(TX_STATUS.PROCESSING);
        const result = await this.$api.post(
          postNFTPurchase({
            wallet: this.getAddress,
            classId,
            ts: Date.now(),
          }),
          { memo }
        );
        logTrackerEvent(this, 'NFT', 'NFTCollectFreeNFTCompleted', classId, 1);
        this.uiSetTxStatus(TX_STATUS.COMPLETED);
        return result.data;
      } catch (error) {
        if (error.toString().includes('code 32')) {
          const errorHandler = this.getErrorHandlerByCode(32);
          this.handleError(errorHandler);
          return undefined;
        }
        const errMsg = error.response?.data || error.toString();
        this.uiSetTxError(errMsg);
        if (this.uiTxTargetClassId === classId) {
          this.uiSetTxStatus(TX_STATUS.FAILED);
        } else {
          this.alertPromptError(
            this.$t('nft_collect_modal_alert_fail', {
              name: this.NFTName,
              error: errMsg,
            })
          );
        }
      } finally {
        this.fetchCollectedNFTClassesByAddress(this.getAddress);
        this.lazyFetchNFTClassAggregatedData();
        this.updateNFTHistory({ getAllUserInfo: false });
        this.walletFetchLIKEBalance();
      }
      return undefined;
    },
    async transferNFT({
      toWallet,
      nftId = this.nftIdCollectedFirstByUser,
      memo = '',
    } = {}) {
      try {
        await this.initIfNecessary();
        await this.walletFetchLIKEBalance();
        if (this.walletLIKEBalance === 0) {
          logTrackerEvent(
            this,
            'NFT',
            'NFTTransferErrorNoBalance',
            this.getAddress,
            1
          );
          this.uiSetTxError('INSUFFICIENT_BALANCE');
          this.uiSetTxStatus(TX_STATUS.INSUFFICIENT);
          return;
        }

        // Wait for collectors sync for getting `nftIdCollectedFirstByUser`
        if (this.nftCollectorsSync) {
          this.uiSetTxStatus(TX_STATUS.PROCESSING);
          await this.nftCollectorsSync;
        }

        this.uiSetTxStatus(TX_STATUS.SIGN);
        logTrackerEvent(
          this,
          'NFT',
          'NFTTransferSignRequested',
          this.classId,
          1
        );
        const signData = await signTransferNFT({
          fromAddress: this.getAddress,
          toAddress: toWallet,
          classId: this.classId,
          nftId,
          memo,
          signer: this.getSigner,
        });
        logTrackerEvent(
          this,
          'NFT',
          'NFTTransferSignApproved',
          this.classId,
          1
        );
        this.uiSetTxStatus(TX_STATUS.PROCESSING);
        const { txHash, code } = await broadcastTx(signData, this.getSigner);
        logTrackerEvent(
          this,
          'NFT',
          'NFTTransferBroadcastTxComplete',
          this.classId,
          1
        );
        if (code !== 0) throw new Error(`TX_FAILED_WITH_CODE_${code}`);

        logTrackerEvent(
          this,
          'NFT',
          'NFTTransferPostTransfer',
          this.classId,
          1
        );
        if (this.nftIsWritingNFT) {
          try {
            await this.$api.post(
              postNFTTransfer({
                txHash,
                classId: this.classId,
                nftId,
              })
            );
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        }
        logTrackerEvent(
          this,
          'NFT',
          'NFTTransferPostTransferCompleted',
          this.classId,
          1
        );
        await Promise.all([
          this.updateNFTOwners(), // blocking update nftIdCollectedFirstByUser,
          this.fetchUserCollectedCount(),
        ]);
        this.uiSetTxStatus(TX_STATUS.COMPLETED);
      } catch (error) {
        this.uiSetTxError(error.response?.data || error.toString());
        this.uiSetTxStatus(TX_STATUS.FAILED);
      } finally {
        this.updateNFTPurchaseInfo();
        this.updateNFTHistory({ getAllUserInfo: false });
        this.walletFetchLIKEBalance();
      }
    },
    goNFTDetails() {
      this.$router.push(
        this.localeLocation({
          name: 'nft-class-classId',
          params: { classId: this.classId },
        })
      );
    },
    normalizeNFTMessage(m) {
      if (
        m.memo === NFT_LEGACY_DEFAULT_MESSSAGE ||
        m.memo === NFT_AUTO_DELIVER_DEFAULT_MESSAGE
      ) {
        return '';
      }
      if (m.event === 'mint_nft' || m.memo === NFT_BATCH_COLLECT_MESSSAGE) {
        return this.nftClassCreatorMessage;
      }
      return m.memo;
    },
    async fetchRecommendInfo() {
      if (this.isRecommendationLoading) return;
      this.isRecommendationLoading = true;
      try {
        const promises = [];
        if (this.iscnOwner) {
          promises.push(this.fetchCreatedNFTClassesByAddress(this.iscnOwner));
          promises.push(this.fetchNFTDisplayStateListByAddress(this.iscnOwner));
        }
        if (this.getAddress) {
          promises.push(
            this.fetchCollectedNFTClassesByAddress(this.getAddress)
          );
        }
        await Promise.all(promises);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      this.isRecommendationLoading = false;
    },
  },
};
