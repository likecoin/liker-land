import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { APP_LIKE_CO_VIEW, APP_LIKE_CO_URL_BASE, TX_STATUS } from '~/constant';

import {
  getNFTHistory,
  postNFTPurchase,
  postNFTTransfer,
  getAddressLikerIdMinApi,
  getNFTEvents,
  postNewStripeFiatPayment,
  getStripeFiatPrice,
} from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';
import {
  getAccountBalance,
  signTransferNFT,
  signGrant,
  broadcastTx,
  getNFTCountByClassId,
  getISCNRecord,
  isWritingNFT,
  formatNFTEventsToHistory,
} from '~/util/nft';

import walletMixin from '~/mixins/wallet';

const NFT_INDEXER_LIMIT_MAX = 100;

export default {
  mixins: [walletMixin],
  head() {
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
          async: true,
        },
      ],
    };
  },
  data() {
    return {
      iscnOwnerInfo: {},
      NFTHistory: [],
      displayNameList: {},
      avatarList: {},
      civicLikerList: {},

      userCollectedCount: undefined,

      isOwnerInfoLoading: false,
      isHistoryInfoLoading: false,

      nftISCNContentFingerprints: [],

      nftPriceInLIKE: undefined,
      nftPriceInUSD: undefined,

      // TODO: Move to VueX store
      userAccountBalanceFetch: undefined,
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassPurchaseInfoById',
      'getNFTClassMetadataById',
      'getNFTClassOwnerInfoById',
      'getNFTClassOwnerCount',
      'getNFTClassMintedCount',
      'uiIsOpenCollectModal',
      'uiTxTargetClassId',
      'uiTxNFTStatus',
    ]),
    isCivicLiker() {
      return !!(
        this.iscnOwnerInfo &&
        (this.iscnOwnerInfo.isCivicLikerTrial ||
          this.iscnOwnerInfo.isSubscribedCivicLiker)
      );
    },
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
      return this.NFTClassMetadata.iscn_owner;
    },
    iscnOwnerAvatar() {
      return (
        this.avatarList[this.iscnOwner] ||
        `https://avatars.dicebear.com/api/identicon/${this.iscnOwner}.svg`
      );
    },
    iscnOwnerDisplayName() {
      return this.displayNameList[this.iscnOwner];
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
      return this.NFTClassMetadata.image;
    },
    NFTImageBackgroundColor() {
      return this.NFTClassMetadata.background_color;
    },
    NFTExternalUrl() {
      return this.NFTClassMetadata.external_url;
    },
    NFTPrice() {
      return this.purchaseInfo.price && this.purchaseInfo.price;
    },
    formattedNFTPriceInLIKE() {
      return this.nftPriceInLIKE !== undefined
        ? `${this.nftPriceInLIKE.toLocaleString('en')} LIKE`
        : '-';
    },
    formattedNFTPriceInUSD() {
      return this.nftPriceInUSD !== undefined
        ? `${this.nftPriceInUSD.toLocaleString('en')} USD`
        : '-';
    },
    ownerList() {
      return this.getNFTClassOwnerInfoById(this.classId) || {};
    },
    ownerCount() {
      return this.getNFTClassOwnerCount(this.classId);
    },
    sortedOwnerListId() {
      const { ownerList } = this;
      return Object.keys(ownerList).sort(
        (a, b) => ownerList[b].length - ownerList[a].length
      );
    },
    mintedCount() {
      return this.getNFTClassMintedCount(this.classId);
    },
    purchaseURL() {
      return `${APP_LIKE_CO_URL_BASE}/nft/purchase/${encodeURIComponent(
        this.iscnId
      )}%2F1`;
    },
    populatedEvents() {
      return this.NFTHistory.map(event => ({
        ...event,
        toDisplayName: this.displayNameList[event.toWallet] || event.toWallet,
        fromDisplayName:
          this.displayNameList[event.fromWallet] || event.fromWallet,
      }));
    },
    populatedCollectors() {
      return this.sortedOwnerListId.map(id => ({
        id,
        displayName: this.displayNameList[id] || id,
        collectedCount: this.ownerList[id].length,
      }));
    },
    firstOwnedNFTId() {
      const ownNFT = this.ownerList[this.getAddress];
      return ownNFT[0];
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
  },
  methods: {
    ...mapActions([
      'fetchNFTPurchaseInfo',
      'fetchNFTMetadata',
      'fetchNFTOwners',
      'initIfNecessary',
      'uiToggleCollectModal',
      'uiSetCollectedCount',
      'uiSetTxStatus',
      'uiSetTxError',
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
      await this.fetchNFTMetadata(this.classId);
      this.updateDisplayNameList(
        this.getNFTClassMetadataById(this.classId)?.iscn_owner
      );
    },
    async updateNFTPurchaseInfo() {
      await this.fetchNFTPurchaseInfo(this.classId);
    },
    async fetchNFTPrices(classId) {
      try {
        const { LIKEPrice, fiatPrice } = await this.$axios.$get(
          getStripeFiatPrice({ classId })
        );
        this.nftPriceInLIKE = LIKEPrice;
        this.nftPriceInUSD = fiatPrice;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async updateNFTOwners() {
      await this.fetchNFTOwners(this.classId);
      this.updateDisplayNameList(
        Object.keys(this.getNFTClassOwnerInfoById(this.classId))
      );
    },
    async updateNFTHistory() {
      this.isHistoryInfoLoading = true;
      let hasHistoryInDatabase = false;
      if (this.isWritingNFT) {
        try {
          const { data } = await this.$api.get(
            getNFTHistory({ classId: this.classId })
          );
          this.NFTHistory = data.list;
          hasHistoryInDatabase = true;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
      if (!hasHistoryInDatabase) {
        let data;
        let nextKey;
        let count;
        let events = [];
        do {
          // eslint-disable-next-line no-await-in-loop
          ({ data } = await this.$api.get(
            getNFTEvents({
              classId: this.classId,
              key: nextKey,
              limit: NFT_INDEXER_LIMIT_MAX,
            })
          ));
          nextKey = data.pagination.next_key;
          ({ count } = data.pagination);
          events = events.concat(data.events);
        } while (count === NFT_INDEXER_LIMIT_MAX);
        this.NFTHistory = formatNFTEventsToHistory(events);
      }
      const array = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const list of this.NFTHistory) {
        array.push(list.fromWallet, list.toWallet);
      }
      this.updateDisplayNameList([...new Set(array)]);
      this.isHistoryInfoLoading = false;
    },
    updateDisplayNameList(addresses) {
      if (!addresses) return null;
      if (typeof addresses === 'string') {
        return this.getAddressLikerId(addresses);
      }
      return Promise.all(addresses.map(this.getAddressLikerId));
    },
    async getAddressLikerId(addr) {
      try {
        const { data } = await this.$api.get(getAddressLikerIdMinApi(addr));
        Vue.set(this.displayNameList, addr, data.displayName);
        Vue.set(
          this.avatarList,
          addr,
          data.avatar ||
            `https://avatars.dicebear.com/api/identicon/${addr}.svg`
        );
        Vue.set(this.civicLikerList, addr, data.isSubscribedCivicLiker);
      } catch (error) {
        Vue.set(this.displayNameList, addr, addr);
        Vue.set(
          this.avatarList,
          addr,
          `https://avatars.dicebear.com/api/identicon/${addr}.svg`
        );
      }
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
        await this.initIfNecessary();
        this.fetchUserCollectedCount();
        this.userAccountBalanceFetch = getAccountBalance(this.getAddress);
        this.uiToggleCollectModal({ classId: this.classId });
      } catch (error) {
        this.uiSetTxError(error.response?.data || error.toString());
        this.uiSetTxStatus(TX_STATUS.FAILED);
      }
    },
    async collectNFTWithLIKE() {
      const balance = await this.userAccountBalanceFetch;
      try {
        if (balance === '0' || Number(balance) < this.purchaseInfo.totalPrice) {
          logTrackerEvent(
            this,
            'NFT',
            'NFTCollectErrorNoBalance',
            this.getAddress,
            1
          );
          this.uiSetTxError('INSUFFICIENT_BALANCE');
          this.uiSetTxStatus(TX_STATUS.INSUFFICIENT);
          return;
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
          await this.$api.post(
            postNFTPurchase({ txHash, classId: this.classId })
          );
          logTrackerEvent(
            this,
            'NFT',
            'NFTCollectPurchaseCompleted',
            this.classId,
            1
          );
          await this.fetchUserCollectedCount();
          this.uiSetTxStatus(TX_STATUS.COMPLETED);
        }
      } catch (error) {
        this.uiSetTxError(error.response?.data || error.toString());
        this.uiSetTxStatus(TX_STATUS.FAILED);
      } finally {
        this.updateNFTOwners();
        this.updateNFTPurchaseInfo();
        this.updateNFTHistory();
      }
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
    async transferNFT() {
      try {
        await this.initIfNecessary();
        const balance = await getAccountBalance(this.getAddress);
        if (balance === '0') {
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
          toAddress: this.toAddress,
          classId: this.classId,
          nftId: this.firstOwnedNFTId,
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
          'NFTCollectBroadcastTxComplete',
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
        await this.$api.post(
          postNFTTransfer({ txHash, nftId: this.firstOwnedNFTId })
        );
        logTrackerEvent(
          this,
          'NFT',
          'NFTTransferPostTransferCompleted',
          this.classId,
          1
        );
        await this.fetchUserCollectedCount();
        this.uiSetTxStatus(TX_STATUS.COMPLETED);
      } catch (error) {
        this.uiSetTxError(error.response?.data || error.toString());
        this.uiSetTxStatus(TX_STATUS.FAILED);
      } finally {
        this.updateNFTPurchaseInfo();
        this.updateNFTOwners();
        this.updateNFTHistory();
      }
    },
    nftDetailsPageURL() {
      return `/nft/class/${this.classId}?referrer=${this.getAddress}`;
    },
    goNFTDetails() {
      this.$router.push({
        name: 'nft-class-classId',
        params: { classId: this.classId },
      });
    },
  },
};
