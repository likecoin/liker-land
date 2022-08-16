import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { APP_LIKE_CO_VIEW, APP_LIKE_CO_URL_BASE } from '~/constant';
import {
  getNFTHistory,
  postNFTPurchase,
  postNFTTransfer,
  getAddressLikerIdMinApi,
} from '~/util/api';
import { getAccountBalance, transferNFT, sendGrant } from '~/util/nft';

export default {
  props: {
    classId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      iscnOwnerInfo: {},
      NFTHistory: [],
      displayNameList: {},
      avatarList: {},
      civicLikerList: {},

      isOwnerInfoLoading: false,
      isHistoryInfoLoading: false,
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
          this.displayNameList[event.fromWallet] || event.toWafromWalletllet,
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
    ]),
    async updateNFTClassMetdata() {
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
      const { data } = await this.$api.get(
        getNFTHistory({ classId: this.classId })
      );
      this.NFTHistory = data.list;
      const array = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const list of data.list) {
        array.push(list.fromWallet, list.toWallet);
      }
      this.updateDisplayNameList([...new Set(array)]);
      this.isHistoryInfoLoading = false;
    },
    updateDisplayNameList(addresses) {
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
    async collectNFT() {
      try {
        await this.initIfNecessary();
        const balance = await getAccountBalance(this.getAddress);
        if (balance === '0') throw new Error('INSUFFICIENT_BALANCE');
        const txHash = await sendGrant({
          senderAddress: this.getAddress,
          amountInLIKE: this.purchaseInfo.totalPrice,
          signer: this.getSigner,
        });
        await this.$api.post(
          postNFTPurchase({ txHash, classId: this.classId })
        );
      } catch (error) {
        throw error;
      } finally {
        this.updateNFTOwners();
        this.updateNFTPurchaseInfo();
      }
    },
    async transferNFT() {
      try {
        await this.initIfNecessary();
        const balance = await getAccountBalance(this.getAddress);
        if (balance === '0') throw new Error('INSUFFICIENT_BALANCE');
        const txHash = await transferNFT({
          fromAddress: this.getAddress,
          toAddress: this.toAddress,
          classId: this.classId,
          nftId: this.firstOwnedNFTId,
          signer: this.getSigner,
        });
        await this.$api.post(
          postNFTTransfer({ txHash, nftId: this.firstOwnedNFTId })
        );
      } catch (error) {
        throw error;
      } finally {
        this.updateNFTOwners();
        this.updateNFTHistory();
      }
    },
  },
};
