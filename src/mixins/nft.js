import { mapActions, mapGetters } from 'vuex';

import { CrispMixinFactory } from '~/mixins/crisp';

import {
  APP_LIKE_CO_VIEW,
  APP_LIKE_CO_URL_BASE,
  ARWEAVE_ENDPOINT,
  IPFS_VIEW_GATEWAY_URL,
  TX_STATUS,
  LIKECOIN_NFT_API_WALLET,
  LIKECOIN_NFT_COLLECT_WITHOUT_WALLET_ITEMS_BY_CREATORS,
} from '~/constant';

import {
  getNFTHistory,
  postNFTPurchase,
  postNFTTransfer,
  getNFTEvents,
  postNewStripeFiatPayment,
  getStripeFiatPrice,
  getIdenticonAvatar,
} from '~/util/api';
import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';
import { sleep } from '~/util/misc';
import {
  NFT_INDEXER_LIMIT_MAX,
  signTransferNFT,
  signGrant,
  broadcastTx,
  getNFTCountByClassId,
  getISCNRecord,
  isWritingNFT,
  formatNFTEventsToHistory,
} from '~/util/nft';
import { formatNumberWithUnit, formatNumberWithLIKE } from '~/util/ui';

import walletMixin from '~/mixins/wallet';
import { createUserInfoMixin } from '~/mixins/user-info';

const creatorInfoMixin = createUserInfoMixin({
  propKey: 'Creator',
  walletKey: 'iscnOwner',
});

export default {
  mixins: [
    walletMixin,
    creatorInfoMixin,
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

      nftISCNContentFingerprints: [],

      nftPriceInUSD: undefined,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfoByAddress',
      'getNFTClassPurchaseInfoById',
      'getNFTClassMetadataById',
      'getNFTClassOwnerInfoById',
      'getNFTClassOwnerCount',
      'getNFTClassCollectedCount',
      'LIKEPriceInUSD',
      'uiIsOpenCollectModal',
      'uiTxTargetClassId',
      'uiTxNFTStatus',
    ]),
    NFTClassMetadata() {
      return this.getNFTClassMetadataById(this.classId) || {};
    },
    isWritingNFT() {
      return isWritingNFT(this.NFTClassMetadata);
    },
    purchaseInfo() {
      return this.getNFTClassPurchaseInfoById(this.classId) || {};
    },
    ownerInfo() {
      return this.getNFTClassOwnerInfoById(this.classId) || {};
    },
    iscnId() {
      return this.NFTClassMetadata.iscn_id;
    },
    iscnOwner() {
      return (
        this.NFTClassMetadata.iscn_owner || this.NFTClassMetadata.account_owner
      );
    },
    iscnURL() {
      return `${APP_LIKE_CO_VIEW}/${encodeURIComponent(this.iscnId)}`;
    },
    // nft info
    NFTName() {
      return this.NFTClassMetadata.name;
    },
    NFTDescription() {
      return this.NFTClassMetadata.description;
    },
    NFTImageUrl() {
      const { image = '' } = this.NFTClassMetadata;
      const [schema, path] = image.split('://');
      if (schema === 'ar') return `${ARWEAVE_ENDPOINT}/${path}`;
      if (schema === 'ipfs') return `${IPFS_VIEW_GATEWAY_URL}/${path}`;
      return this.NFTClassMetadata.image;
    },
    NFTImageBackgroundColor() {
      return this.NFTClassMetadata.background_color;
    },
    NFTExternalUrl() {
      return this.NFTClassMetadata.external_url;
    },
    NFTPrice() {
      return this.purchaseInfo.price;
    },
    formattedNFTPriceInLIKE() {
      return this.NFTPrice ? formatNumberWithLIKE(this.NFTPrice) : '-';
    },
    NFTPriceUSD() {
      return this.LIKEPriceInUSD * this.NFTPrice;
    },
    formattedNFTPriceUSD() {
      return formatNumberWithUnit(this.NFTPriceUSD, 'USD');
    },
    formattedNFTPriceInUSD() {
      return this.nftPriceInUSD !== undefined
        ? formatNumberWithUnit(this.nftPriceInUSD, 'USD')
        : '-';
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

    userCollectedNFTList() {
      const collectedList = this.collectorMap[this.getAddress];
      return collectedList ? Object.values(collectedList) : [];
    },

    // Collector Info
    nftCollectorWalletAddress() {
      if (!this.nftId) return undefined;
      return Object.keys(this.collectorMap).find(collector => {
        const nftIdList = this.collectorMap[collector];
        return nftIdList.find(nftId => this.nftId === nftId);
      });
    },
    nftCollectorCollectedNFTList() {
      return this.collectorMap[this.nftCollectorWalletAddress] || [];
    },
    nftCollectorCollectedCount() {
      return this.nftCollectorCollectedNFTList.length || 0;
    },

    purchaseURL() {
      return `${APP_LIKE_CO_URL_BASE}/nft/purchase/${encodeURIComponent(
        this.iscnId
      )}%2F1`;
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
    firstCollectedNFTId() {
      const ownNFT = this.collectorMap[this.getAddress];
      return ownNFT?.[0];
    },
    nftClassDetailsPageURL() {
      return `/nft/class/${this.classId}?referrer=${this.getAddress}`;
    },
    canCollectWithoutWallet() {
      return (
        !LIKECOIN_NFT_COLLECT_WITHOUT_WALLET_ITEMS_BY_CREATORS.length ||
        LIKECOIN_NFT_COLLECT_WITHOUT_WALLET_ITEMS_BY_CREATORS.includes(
          this.iscnOwner
        )
      );
    },

    getWalletIdentityType() {
      return wallet => (wallet === this.iscnOwner ? 'creator' : 'collector');
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
        !this.firstCollectedNFTId &&
        !this.nftCollectorsSync
      ) {
        this.nftCollectorsSync = new Promise(async resolve => {
          // `fetchNFTOwners` might take longer to return the most updated collectors
          // causing `firstCollectedNFTId` to be undefined or collectors list out-sync
          // Should keep fetching if the user just collected the NFT but not found in the collectors list
          let tries = 0;
          while (!this.firstCollectedNFTId && tries < 10) {
            // eslint-disable-next-line no-await-in-loop
            await this.updateNFTOwners();
            // eslint-disable-next-line no-await-in-loop
            await sleep(3000);
            tries += 1;
          }
          this.nftCollectorsSync = undefined;
          resolve();
        });
      }
    },
  },
  methods: {
    ...mapActions([
      'lazyGetUserInfoByAddress',
      'fetchNFTPurchaseInfo',
      'fetchNFTMetadata',
      'fetchNFTOwners',
      'initIfNecessary',
      'uiToggleCollectModal',
      'uiSetCollectedCount',
      'uiSetTxStatus',
      'uiSetTxError',
      'walletFetchLIKEBalance',
      'fetchNFTListByAddress',
    ]),
    async fetchISCNMetadata() {
      if (!this.iscnId) return;
      try {
        const res = await getISCNRecord(this.iscnId);
        const [{ data: { contentFingerprints } = {} } = {}] = res?.records;
        this.nftISCNContentFingerprints = contentFingerprints;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async updateNFTClassMetadata() {
      try {
        await this.fetchNFTMetadata(this.classId);
      } catch (error) {
        if (error.response?.status !== 404) {
          // eslint-disable-next-line no-console
          console.error(JSON.stringify(error));
        }
      }
      this.updateDisplayNameList(this.iscnOwner);
    },
    async updateNFTPurchaseInfo() {
      try {
        await this.fetchNFTPurchaseInfo(this.classId);
      } catch (error) {
        if (error.response?.status !== 404) {
          // eslint-disable-next-line no-console
          console.error(JSON.stringify(error));
        }
      }
    },
    async fetchNFTPrices(classId) {
      try {
        const { fiatPrice } = await this.$axios.$get(
          getStripeFiatPrice({ classId })
        );
        this.nftPriceInUSD = fiatPrice;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    updateNFTOwners() {
      return this.fetchNFTOwners(this.classId);
    },
    async updateNFTHistory() {
      this.isHistoryInfoLoading = true;
      const actionType = this.isWritingNFT
        ? ['/cosmos.nft.v1beta1.MsgSend', 'new_class']
        : ['/cosmos.nft.v1beta1.MsgSend', 'mint_nft', 'new_class'];
      const ignoreToList = this.isWritingNFT ? LIKECOIN_NFT_API_WALLET : '';
      const historyOnChain = await this.getNFTEventsAll({
        actionType,
        ignoreToList,
      });
      let history = historyOnChain;

      if (this.isWritingNFT) {
        try {
          const { data } = await this.$api.get(
            getNFTHistory({
              classId: this.classId,
              nftId: this.nftId,
            })
          );
          const historyInDB = data.list;
          const eventMap = new Map();
          historyOnChain.forEach(e => {
            eventMap.set(`${e.txHash}-${e.nftId}`, e);
          });
          historyInDB.forEach(e => {
            const key = `${e.txHash}-${e.nftId}`;
            if (eventMap.has(key)) {
              eventMap.get(key).price = e.price;
            }
          });
          history = [...eventMap.values()];
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
      this.NFTHistory = history;

      const addresses = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const list of this.NFTHistory) {
        addresses.push(list.fromWallet, list.toWallet);
      }
      this.updateDisplayNameList([...new Set(addresses)]);
      this.isHistoryInfoLoading = false;
    },
    async getNFTEventsAll({ actionType, ignoreToList }) {
      let data;
      let nextKey;
      let count;
      const events = [];
      do {
        // eslint-disable-next-line no-await-in-loop
        ({ data } = await this.$api.get(
          getNFTEvents({
            classId: this.classId,
            nftId: this.nftId,
            key: nextKey,
            limit: NFT_INDEXER_LIMIT_MAX,
            actionType,
            ignoreToList,
          })
        ));
        nextKey = data.pagination.next_key;
        ({ count } = data.pagination);
        events.push(...data.events);
      } while (count === NFT_INDEXER_LIMIT_MAX);
      return formatNFTEventsToHistory(events);
    },
    updateDisplayNameList(addresses) {
      if (!addresses) return null;
      if (typeof addresses === 'string') {
        return this.lazyGetUserInfoByAddress(addresses);
      }
      return Promise.all(
        addresses.filter(a => !!a).map(a => this.lazyGetUserInfoByAddress(a))
      );
    },
    async updateUserCollectedCount(classId, address) {
      if (!address || !classId) {
        this.userCollectedCount = undefined;
        return;
      }
      this.isOwnerInfoLoading = true;
      const { amount } = await getNFTCountByClassId(classId, address);
      this.userCollectedCount = amount.low;
      this.isOwnerInfoLoading = false;
    },
    async fetchUserCollectedCount() {
      await this.updateUserCollectedCount(this.classId, this.getAddress);
    },
    async collectNFT() {
      try {
        const purchaseEventParams = {
          name: this.NFTName,
          price: this.NFTPriceUSD,
          currency: 'USD',
          classId: this.classId,
        };
        logPurchaseFlowEvent(this, 'add_to_cart', purchaseEventParams);
        logPurchaseFlowEvent(this, 'begin_checkout', purchaseEventParams);
        if (!this.canCollectWithoutWallet && !this.getAddress) {
          const isConnected = await this.connectWallet();
          if (!isConnected) return;
        } else {
          await this.initIfNecessary();
        }
        if (this.hasConnectedWallet) {
          logPurchaseFlowEvent(this, 'add_shipping_info', purchaseEventParams);
          this.fetchUserCollectedCount();
          this.walletFetchLIKEBalance();
        }
        this.uiToggleCollectModal({ classId: this.classId });
      } catch (error) {
        this.uiSetTxError(error.response?.data || error.toString());
        this.uiSetTxStatus(TX_STATUS.FAILED);
      }
    },
    async collectNFTWithLIKE() {
      logTrackerEvent(
        this,
        'NFT',
        `NFTCollectNFTWithLIKE(${this.walletMethodType})`,
        this.classId,
        1
      );
      try {
        await this.walletFetchLIKEBalance();
        if (
          this.walletLIKEBalance === 0 ||
          this.walletLIKEBalance < this.purchaseInfo.totalPrice
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
          this.classId,
          1
        );
        const signData = await signGrant({
          senderAddress: this.getAddress,
          amountInLIKE: this.purchaseInfo.totalPrice,
          signer: this.getSigner,
        });
        this.uiSetTxStatus(TX_STATUS.PROCESSING);
        logTrackerEvent(
          this,
          'NFT',
          'NFTCollectSignGrantApproved',
          this.classId,
          1
        );
        const txHash = await broadcastTx(signData, this.getSigner);
        logTrackerEvent(
          this,
          'NFT',
          'NFTCollectBroadcastTxComplete',
          this.classId,
          1
        );
        if (txHash && this.uiIsOpenCollectModal) {
          logTrackerEvent(this, 'NFT', 'NFTCollectPurchase', this.classId, 1);
          const result = await this.$api.post(
            postNFTPurchase({ txHash, classId: this.classId })
          );
          logTrackerEvent(
            this,
            'NFT',
            'NFTCollectPurchaseCompleted',
            this.classId,
            1
          );
          logPurchaseFlowEvent(this, 'purchase', {
            txHash,
            name: this.NFTName,
            price: this.NFTPriceUSD,
            currency: 'USD',
            classId: this.classId,
          });
          this.uiSetTxStatus(TX_STATUS.COMPLETED);
          return result.data;
        }
      } catch (error) {
        this.uiSetTxError(error.response?.data || error.toString());
        this.uiSetTxStatus(TX_STATUS.FAILED);
      } finally {
        this.fetchNFTListByAddress(this.getAddress);
        this.updateNFTOwners();
        this.updateNFTPurchaseInfo();
        this.updateNFTHistory();
        this.walletFetchLIKEBalance();
      }
      return undefined;
    },
    async collectNFTWithStripe() {
      try {
        const { url } = await this.$api.$post(
          postNewStripeFiatPayment({
            classId: this.classId,
            wallet: this.getAddress,
          })
        );
        if (url) window.location.href = url;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async transferNFT({
      toWallet,
      nftId = this.firstCollectedNFTId,
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

        // Wait for collectors sync for getting `firstCollectedNFTId`
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
        const txHash = await broadcastTx(signData, this.getSigner);
        logTrackerEvent(
          this,
          'NFT',
          'NFTTransferBroadcastTxComplete',
          this.classId,
          1
        );

        logTrackerEvent(
          this,
          'NFT',
          'NFTTransferPostTransfer',
          this.classId,
          1
        );
        if (this.isWritingNFT) {
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
          this.updateNFTOwners(), // blocking update firstCollectedNFTId,
          this.fetchUserCollectedCount(),
        ]);
        this.uiSetTxStatus(TX_STATUS.COMPLETED);
      } catch (error) {
        this.uiSetTxError(error.response?.data || error.toString());
        this.uiSetTxStatus(TX_STATUS.FAILED);
      } finally {
        if (this.isWritingNFT) this.updateNFTPurchaseInfo();
        this.updateNFTHistory();
        this.walletFetchLIKEBalance();
      }
    },
    goNFTDetails() {
      this.$router.push({
        name: 'nft-class-classId',
        params: { classId: this.classId },
      });
    },
  },
};
