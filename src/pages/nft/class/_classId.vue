<template>
  <div>
    <section>
      <h2>NFT Information</h2>
      <div :style="`background-color: ${NFTImageBackgroundColor}`">
        <img :src="NFTImageUrl">
      </div>
      <div>NFT Name: {{ NFTName }}</div>
      <div>
        <img :src="iscnOwnerImageUrl">
        <div>ISCN Owner: {{ iscnOwnerName }}</div>
      </div>
      <a :href="NFTExternalUrl">View Work</a>
    </section>
    <section>
      <h2>Owners</h2>
      <ul>
        <li v-for="(o, i) in ownerList" :key="o">
          {{ o }}: {{ ownedCountList[i] }}
        </li>
      </ul>
    </section>
    <section>
      <a :href="iscnURL">View Metadata</a>
    </section>
    <section v-if="userOwnedCount">
      <h2>Owning: {{ userOwnedCount }}</h2>
    </section>
    <section>
      <h2>Price</h2>
      <h3>{{ purcahseInfo.currentPrice }}</h3>
      <h3>minted {{ ownedCountTotal }}</h3>
      <h3>owner {{ ownerList.length }}</h3>
      <button @click="onPurchase">Collect Now</button>
    </section>
    <section>
      <h2>Events</h2>
      <ul>
        <li v-for="h in history" :key="h.txHash">
          {{ h.fromWallet }} {{ h.toWallet }} {{ h.price }}LIKE {{ (new Date(h.timestamp)).toString() }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { APP_LIKE_CO_VIEW, LIKECOIN_NFT_API_WALLET } from '~/constant';
import {
  getNFTPurchaseInfo,
  getNFTMetadata,
  getNFTOwners,
  getNFTHistory,
} from '~/util/api';
import { initKeplr } from '~/util/keplr';
import { getNFTCountByClassId } from '~/util/nft';

export default {
  layout: 'desktop',
  data() {
    return {
      wallet: '',
      iscnOwnerInfo: {},
      purcahseInfo: {},
      NFTClassMetadata: {},
      ownerMap: {},
      userOwnedCount: 0,
      history: [],
    };
  },
  computed: {
    classId() {
      return this.$route.params.classId;
    },
    iscnId() {
      return this.NFTClassMetadata.iscnId;
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
    // iscn owner
    iscnOwnerImageUrl() {
      return this.iscnOwnerInfo.image;
    },
    iscnOwnerName() {
      return this.iscnOwnerInfo.name || this.iscnOwnerInfo.wallet;
    },
    iscnURL() {
      return `${APP_LIKE_CO_VIEW}/${encodeURIComponent(this.iscnId)}`;
    },
    ownerList() {
      return Object.keys(this.ownerMap).filter(
        o => o !== LIKECOIN_NFT_API_WALLET
      );
    },
    ownedCountList() {
      return Object.keys(this.ownerMap)
        .filter(o => o !== LIKECOIN_NFT_API_WALLET)
        .map(o => this.ownerMap[o].length);
    },
    ownedCountTotal() {
      return this.ownedCountList.reduce((acc, cur) => acc + cur, 0);
    },
  },
  mounted() {
    this.updateNFTClassMetdata();
    this.updateNFTPurchaseInfo();
    this.updateNFTOwners();
    this.updateNFTHistory();
    try {
      setTimeout(async () => {
        const accounts = await initKeplr();
        this.setAccount(accounts[0].address);
      }, 3000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  },
  methods: {
    async updateNFTClassMetdata() {
      const { data } = await this.$api.get(
        getNFTMetadata({ classId: this.classId })
      );
      this.NFTClassMetadata = data;
      this.iscnOwnerInfo = {
        wallet: data.iscn_owner,
      };
    },
    async updateNFTPurchaseInfo() {
      const { data } = await this.$api.get(
        getNFTPurchaseInfo({ classId: this.classId })
      );
      this.purcahseInfo = data;
    },
    async updateNFTOwners() {
      const { data } = await this.$api.get(
        getNFTOwners({ classId: this.classId })
      );
      this.ownerMap = data;
    },
    async updateNFTHistory() {
      const { data } = await this.$api.get(
        getNFTHistory({ classId: this.classId })
      );
      this.history = data.list;
    },
    async setAccount(wallet) {
      this.wallet = wallet;
      this.userOwnedCount = await getNFTCountByClassId();
    },
    async onPurchase() {
      // buy nft
    },
  },
};
</script>
