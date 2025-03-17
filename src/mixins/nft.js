import { mapActions, mapGetters } from 'vuex';

import {
  LIKECOIN_CHAIN_API,
  TX_STATUS,
  LIKECOIN_NFT_API_WALLET,
  NFT_DISPLAY_STATE,
  NFT_BATCH_COLLECT_MESSSAGE,
  NFT_LEGACY_DEFAULT_MESSSAGE,
  NFT_AUTO_DELIVER_DEFAULT_MESSAGE,
  NFT_BOOK_WITH_SIGN_IMAGE_SET,
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
} from '~/util/api';
import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';
import { sleep, catchAxiosError } from '~/util/misc';
import {
  NFT_INDEXER_LIMIT_MAX,
  signTransferNFT,
  signGrant,
  broadcastTx,
  getNFTClassCollectionType,
  getFormattedNFTEvents,
  parseNFTMetadataURL,
  getNFTHistoryDataMap,
  populateGrantEvent,
  getUniqueAddressesFromEvent,
} from '~/util/nft';
import { getDynamicCovers } from '~/util/nft-book';
import { formatNumberWithLIKE, formatNumberWithUSD } from '~/util/ui';

import walletMixin from '~/mixins/wallet';
import iscnMixin from '~/mixins/iscn';
import alertMixin from '~/mixins/alert';
import utmMixin from '~/mixins/utm';
import nftEventBannerMixin from '~/mixins/nft-event-banner';
import nftPageOverrideMixin from '~/mixins/nft-page-override';
import { createUserInfoMixin } from '~/mixins/user-info';
import { createNFTClassCollectionMixin } from '~/mixins/nft-class-collection';

const creatorInfoMixin = createUserInfoMixin({
  propKey: 'Creator',
  walletKey: 'classOwner',
});

const nftClassCollectionMixin = createNFTClassCollectionMixin({
  propKey: 'nft',
  typeKey: 'nftClassCollectionType',
});

const defaultThemeColor = ['#D1D1D1', '#FFC123', '#ECBDF3'];

export default {
  mixins: [
    walletMixin,
    iscnMixin,
    alertMixin,
    creatorInfoMixin,
    nftClassCollectionMixin,
    nftEventBannerMixin,
    nftPageOverrideMixin,
    utmMixin,
  ],
  data() {
    return {
      NFTHistory: [],

      userCollectedCount: undefined,

      isOwnerInfoLoading: false,
      isHistoryInfoLoading: false,
    };
  },
  computed: {
    ...mapGetters([
      'getGaClientId',
      'getGaSessionId',
      'getUserInfoByAddress',
      'getISCNMetadataById',
      'getAccessToken',
      'getNFTClassFeaturedSetByAddress',
      'getNFTClassHiddenSetByAddress',
      'getNFTClassPurchaseInfoById',
      'getNFTClassMetadataById',
      'getNFTClassOwnerInfoById',
      'getNFTClassPaymentPriceById',
      'getNFTClassOwnerCount',
      'getNFTClassCollectedCount',
      'getNFTMetadataByNFTClassAndNFTId',
      'getCollectedNFTClassesByAddress',
      'getCreatedNFTClassesByAddress',
      'getNFTBookStorePricesByClassId',
      'getNFTBookStorePriceByClassIdAndIndex',
      'getNFTCollectionInfoByClassId',
      'getCanViewNFTBookBeforeClaimByClassId',
      'getIsHideNFTBookDownload',
      'getNFTBookStoreInfoByClassId',
      'uiIsOpenCollectModal',
      'uiTxErrorMessage',
      'uiTxTargetClassId',
      'uiTxNFTStatus',
    ]),
    NFTClassMetadata() {
      if (!this.classId) return {};
      return this.getNFTClassMetadataById(this.classId) || {};
    },
    nftMetadata() {
      if (!this.classId || !this.nftId) return {};
      return (
        this.getNFTMetadataByNFTClassAndNFTId(this.classId, this.nftId) || {}
      );
    },
    contentMetadata() {
      const {
        contentMetadata: iscnContentMetadata,
        contentFingerprints,
        recordTimestamp,
      } = this.iscnData || {};
      return {
        ...this.NFTClassMetadata,
        ...iscnContentMetadata,
        contentFingerprints,
        recordTimestamp,
        ...this.nftMetadata,
      };
    },
    nftClassCollectionType() {
      return getNFTClassCollectionType(this.contentMetadata);
    },
    nftClassCollectionName() {
      return this.contentMetadata.nft_meta_collection_name || '';
    },
    nftClassCreatorMessage() {
      return this.contentMetadata.message || '';
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
    ownerInfo() {
      return this.getNFTClassOwnerInfoById(this.classId) || {};
    },
    classOwner() {
      return (
        // TODO: refactor iscn owner data location
        this.iscnData?.owner ||
        this.NFTClassMetadata?.iscn_owner ||
        this.NFTClassMetadata.account_owner
      );
    },
    classAuthor() {
      return this.contentMetadata.author;
    },
    classAuthorName() {
      if (typeof this.classAuthor === 'string') {
        return this.classAuthor.trim();
      }
      return this.classAuthor?.name?.trim();
    },
    classAuthorDescription() {
      return this.classAuthor?.description?.trim();
    },
    classPublisher() {
      return this.contentMetadata.publisher?.trim();
    },
    nftName() {
      return this.contentMetadata.name;
    },
    nftDescription() {
      const overrideKey = `nft_override_${this.classId}_description`;
      const hasOverride = this.$te(overrideKey);
      if (hasOverride) return this.$t(overrideKey);
      return this.contentMetadata.description || '';
    },
    nftImageUrl() {
      const { image = '', thumbnailUrl } = this.contentMetadata;
      let url = image;
      // HACK: some thumbnail url is just ar:// which is wrong
      if (thumbnailUrl && thumbnailUrl !== 'ar://') {
        url = thumbnailUrl;
      }
      return parseNFTMetadataURL(url);
    },
    nftAnimationUrl() {
      const { animation_url: video = '' } = this.contentMetadata;
      return parseNFTMetadataURL(video);
    },
    nftModelURL() {
      return this.nftIsWritingNFT || this.nftIsNFTBook
        ? getNFTModel({ classId: this.classId })
        : undefined;
    },
    nftImageBackgroundColor() {
      return this.contentMetadata.background_color;
    },
    externalUrl() {
      return this.contentMetadata.url || this.contentMetadata.external_url;
    },
    classContentUrls() {
      return this.contentMetadata.sameAs || [];
    },
    classContentFingerprints() {
      return this.contentMetadata.contentFingerprints || [];
    },
    classPublishedDate() {
      return this.contentMetadata.datePublished;
    },
    classReleasedDate() {
      return this.classPublishedDate || this.contentMetadata.recordTimestamp;
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
      if (this.nftIsNFTBook) {
        return null;
      }
      const result = this.getNFTClassPaymentPriceById(this.classId);
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
      if (this.nftIsNFTBook) {
        if (this.priceIndex !== undefined) {
          const edition = this.getNFTBookStorePriceByClassIdAndIndex(
            this.classId,
            this.priceIndex
          );
          if (edition) return edition.price;
        }
        const result = this.getNFTBookStorePricesByClassId(this.classId);
        if (!result || !result.length) return undefined;
        const [price, ...prices] = result;
        return prices.reduce((acc, p) => Math.min(acc, p.price), price.price);
      }

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
      const defaultEdition = {
        name: '',
        description: '',
        price: 0,
        priceLabel: this.formattedNFTPriceInUSD,
        value: 0,
        isPhysicalOnly: false,
        isAllowCustomPrice: false,
        hasShipping: false,
        stock: 0,
        defaultPrice: 0,
      };
      return prices
        ? prices.map((edition, i) => {
            const index = edition.index ?? i;
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
            const priceLabel = formatNumberWithUSD(price);
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
              description,
              priceLabel,
              price,
              value: index,
              index,
              stock,
              style,
              isAllowCustomPrice,
              isPhysicalOnly,
              hasShipping,
              dynamicCovers: getDynamicCovers(this.classId, index),
              defaultPrice: edition.price,
            };
          })
        : [defaultEdition];
    },
    nftEdition() {
      let edition;
      if (this.editionPriceIndex !== undefined) {
        edition = this.nftEditions.find(
          e => e.index === this.editionPriceIndex
        );
      }
      if (!edition) {
        edition = this.nftEditions.find(item => item.stock > 0);
      }
      return edition;
    },
    editionPriceIndex() {
      if (this.priceIndex !== undefined) return Number(this.priceIndex);
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
      const edition = this.nftEdition;
      const purchasePrice = edition?.priceLabel;
      return purchasePrice;
    },
    nftMustClaimToView() {
      return !this.getCanViewNFTBookBeforeClaimByClassId(this.classId);
    },
    nftIsDownloadHidden() {
      return this.getIsHideNFTBookDownload(this.classId);
    },
    nftIsCustomMessageEnabled() {
      return this.getNFTBookStoreInfoByClassId(this.classId)
        ?.enableCustomMessagePage;
    },
    nftTableContent() {
      return this.getNFTBookStoreInfoByClassId(this.classId)?.tableOfContents;
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
    nftCreatorMessage() {
      return this.contentMetadata?.message || '';
    },
    nftCreatorMessageWithParsing() {
      const collector =
        this.getAddress || this.$t('nft_message_replacer_collector');
      return this.nftCreatorMessage.replaceAll('{collector}', collector);
    },
    isNFTHidden() {
      return (
        this.getNFTBookStoreInfoByClassId(this.classId)?.isHidden ||
        this.getNFTClassHiddenSetByAddress(this.classOwner)?.has(this.classId)
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
          collectedNftIds: this.collectorMap[id],
          collectedFirstNFTId: this.collectorMap[id][0],
          avatar: owner?.avatar || getIdenticonAvatar(id),
          isCivicLiker:
            owner?.isCivicLikerTrial || owner?.isSubscribedCivicLiker,
        };
      });
    },
    ownCount() {
      const collector = this.populatedCollectors.find(
        ({ id }) => id === this.loginAddress
      );
      return collector?.collectedCount || 0;
    },
    isOwningNFT() {
      if (!this.nftId) return this.ownCount > 0;
      const collector = this.populatedCollectors.find(
        ({ id }) => id === this.loginAddress
      );
      return (collector?.collectedNftIds || []).includes(this.nftId);
    },
    nftClassDetailsPageSharePath() {
      let from = this.getAddress || '';
      if (this.getLikerId) {
        from = `@${this.getLikerId}`;
      }
      return `/nft/class/${
        this.classId
      }?from=${from}&utm_source=share&utm_medium=share_button`;
    },
    nftIdCollectedFirstByUser() {
      const ownNFT = this.collectorMap[this.loginAddress];
      return ownNFT?.[0];
    },
    nftIdCollectNext() {
      return this.purchaseInfo?.nftId;
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
    getWalletIdentityType() {
      return wallet => (wallet === this.classOwner ? 'creator' : 'collector');
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
              fromWallet: this.classOwner,
            };
          }
          return e;
        })
        .map(m => ({
          ...m,
          messageType:
            m.fromWallet === this.classOwner ? 'creator' : 'collector',
          fromType: this.getWalletIdentityType(m.fromWallet),
          toType: this.getWalletIdentityType(m.toWallet),
          message: this.normalizeNFTMessage(m),
        }));
    },
    nftTxErrorIsAlreadyCollected() {
      return this.uiTxErrorMessage === 'ALREADY_MINTED';
    },
    nftHasSignImage() {
      return NFT_BOOK_WITH_SIGN_IMAGE_SET.has(this.classId);
    },
    nftSignImageAuthor() {
      const customAuthor = NFT_BOOK_WITH_SIGN_IMAGE_SET.get(this.classId);
      return (
        customAuthor || this.classAuthorName || this.creatorDisplayNameFull
      );
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
      'lazyFetchNFTClassAggregatedInfo',
      'lazyGetNFTClassMetadata',
      'lazyGetNFTOwners',
      'fetchNFTPurchaseInfo',
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
      'fetchNFTCollectionInfoByClassId',
    ]),
    async lazyFetchNFTClassMetadata() {
      await catchAxiosError(this.lazyGetNFTClassMetadata(this.classId));
      if (this.classOwner) {
        this.lazyGetUserInfoByAddresses(this.classOwner);
      }
    },
    async lazyFetchNFTClassAggregatedData({ excludeOptions = [] } = {}) {
      await catchAxiosError(
        this.lazyFetchNFTClassAggregatedInfo({
          classId: this.classId,
          excludeOptions,
        })
      );
    },
    async updateNFTPurchaseInfo() {
      await catchAxiosError(this.fetchNFTPurchaseInfo(this.classId));
    },
    async fetchNFTPrices() {
      await catchAxiosError(
        this.fetchNFTPaymentPriceInfoByClassId(this.classId)
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
    updateNFTOwners({ nocache = true } = {}) {
      return this.fetchNFTOwners({ classId: this.classId, nocache });
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
                toWallet: this.classOwner || fromWallet,
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
      await this.fetchNFTDisplayStateListByAddress(this.classOwner);
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
              priceIndex: this.editionPriceIndex,
              price: this.NFTPriceUSD,
              name: this.nftName,
            },
          ],
          isNFTBook: this.nftIsNFTBook,
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

        this.uiSetTxStatus(TX_STATUS.SIGN);
        logTrackerEvent(
          this,
          'NFT',
          'NFTCollectSignGrantRequested',
          classId,
          1
        );
        const signData = await signGrant({
          senderAddress: this.getAddress,
          amountInLIKE: this.nftPriceInLIKE,
          signer: this.getSigner,
          memo,
        });
        this.uiSetTxStatus(TX_STATUS.PROCESSING);
        logTrackerEvent(this, 'NFT', 'NFTCollectSignGrantApproved', classId, 1);
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
          this.uiSetTxStatus(TX_STATUS.PROCESSING_NON_BLOCKING);
          const result = await this.$api.post(
            postNFTPurchase({
              txHash,
              classId,
              ts: Date.now(),
            })
          );
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
                name: this.nftName,
                price: this.NFTPriceUSD,
                priceIndex: this.editionPriceIndex,
                classId,
              },
            ],
            price: this.NFTPriceUSD,
            currency: 'USD',
            isNFTBook: this.nftIsNFTBook,
          });
          if (this.uiTxTargetClassId === classId) {
            this.uiSetTxStatus(TX_STATUS.COMPLETED);
          } else {
            this.alertPromptSuccess(
              this.$t('nft_collect_modal_alert_success', {
                name: this.nftName,
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
              name: this.nftName,
              error: errMsg,
            })
          );
        }
      } finally {
        this.fetchCollectedNFTClassesByAddress({
          address: this.getAddress,
          nocache: true,
        });
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
        const { url } = await this.$axios.$post(
          link,
          {
            gaClientId,
            gaSessionId,
            coupon: this.$route.query.coupon,
            utmCampaign: this.utmCampaign,
            utmSource: this.utmSource,
            utmMedium: this.utmMedium,
            referrer: this.documentReferrer,
            email: this.walletEmail,
            gadClickId: this.gadClickId,
            gadSource: this.gadSource,
            fbClickId: this.fbClickId,
          },
          {
            headers: {
              Authorization: this.getAccessToken
                ? `Bearer ${this.getAccessToken}`
                : undefined,
            },
          }
        );
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
            referrer: this.documentReferrer,
            gadClickId: this.gadClickId,
            gadSource: this.gadSource,
            fbClickId: this.fbClickId,
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
              name: this.nftName,
              error: errMsg,
            })
          );
        }
      } finally {
        this.fetchCollectedNFTClassesByAddress({
          address: this.getAddress,
          nocache: true,
        });
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
    getEditionByIndex(index) {
      return this.getNFTBookStorePriceByClassIdAndIndex(this.classId, index);
    },
  },
};
