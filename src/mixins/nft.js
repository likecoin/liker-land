import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { APP_LIKE_CO_VIEW, APP_LIKE_CO_URL_BASE } from '~/constant';
import {
  getNFTHistory,
  postNFTPurchase,
  postNFTTransfer,
  getAddressLikerIdMinApi,
  getNFTEvents,
} from '~/util/api';
import {
  getAccountBalance,
  transferNFT,
  sendGrant,
  getNFTCountByClassId,
  getISCNRecord,
  isWritingNFT,
  formatNFTEventsToHistory,
} from '~/util/nft';
import { logTrackerEvent } from '~/util/EventLogger';

const TX_STATUS = {
  SIGN: 'sign',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  INSUFFICIENT: 'insufficient',
  FAILED: 'failed',
};

const NFT_INDEXER_LIMIT_MAX = 100;

export default {
  data() {
    return {
      iscnOwnerInfo: {},
      NFTHistory: [],
      displayNameList: {},
      avatarList: {},
      civicLikerList: {},

      userOwnedCount: -1,

      isOwnerInfoLoading: false,
      isHistoryInfoLoading: false,

      nftISCNContentFingerprints: [],
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassPurchaseInfoById',
      'getNFTClassMetadataById',
      'getNFTClassOwnerInfoById',
      'getNFTClassOwnerCount',
      'getNFTClassMintedCount',
      'getAddress',
      'uiIsOpenCollectModal',
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
    async updateNFTOwners() {
      await this.fetchNFTOwners(this.classId);
      this.updateDisplayNameList(
        Object.keys(this.getNFTClassOwnerInfoById(this.classId))
      );
    },
    async updateNFTHistory() {
      this.isHistoryInfoLoading = true;
      if (this.isWritingNFT) {
        try {
          const { data } = await this.$api.get(
            getNFTHistory({ classId: this.classId })
          );
          this.NFTHistory = data.list;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
      if (!this.NFTHistory?.length) {
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
      if (!address) {
        this.userOwnedCount = null;
        return;
      }
      this.isOwnerInfoLoading = true;
      const { amount } = await getNFTCountByClassId(classId, address);
      this.userOwnedCount = amount.low;
      this.uiSetCollectedCount(this.userOwnedCount);
      this.isOwnerInfoLoading = false;
    },
    async collectNFT() {
      try {
        await this.initIfNecessary();
        const balance = await getAccountBalance(this.getAddress);
        this.uiToggleCollectModal({
          classId: this.classId,
          collectedCount: this.userOwnedCount,
        });
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
          'NFTCollectSendGrantRequested',
          this.classId,
          1
        );
        const txHash = await sendGrant({
          senderAddress: this.getAddress,
          amountInLIKE: this.purchaseInfo.totalPrice,
          signer: this.getSigner,
        });
        logTrackerEvent(
          this,
          'NFT',
          'NFTCollectSendGrantApproved',
          this.classId,
          1
        );
        if (txHash && this.uiIsOpenCollectModal) {
          logTrackerEvent(this, 'NFT', 'NFTCollectPurchase', this.classId, 1);
          this.uiSetTxStatus(TX_STATUS.PROCESSING);
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
          await this.updateUserCollectedCount(this.classId, this.getAddress);
          this.uiSetTxStatus(TX_STATUS.COMPLETED);
        }
      } catch (error) {
        this.uiSetTxError(error.response?.data || error.toString());
        this.uiSetTxStatus(TX_STATUS.FAILED);
      } finally {
        this.uiSetCollectedCount(this.userOwnedCount);
        this.updateNFTOwners();
        this.updateNFTPurchaseInfo();
        this.updateNFTHistory();
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
          'NFTTransferSendRequested',
          this.classId,
          1
        );
        const txHash = await transferNFT({
          fromAddress: this.getAddress,
          toAddress: this.toAddress,
          classId: this.classId,
          nftId: this.firstOwnedNFTId,
          signer: this.getSigner,
        });
        logTrackerEvent(
          this,
          'NFT',
          'NFTTransferSendApproved',
          this.classId,
          1
        );
        this.uiSetTxStatus(TX_STATUS.PROCESSING);
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
        await this.updateUserCollectedCount(this.classId, this.getAddress);
        this.uiSetTxStatus(TX_STATUS.COMPLETED);
      } catch (error) {
        this.uiSetTxError(error.response?.data || error.toString());
        this.uiSetTxStatus(TX_STATUS.FAILED);
      } finally {
        this.uiSetCollectedCount(this.userOwnedCount);
        this.updateNFTOwners();
        this.updateNFTHistory();
        this.updateUserCollectedCount(this.classId, this.getAddress);
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
