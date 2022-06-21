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
        <li v-for="o in Object.keys(ownerList)" :key="o">
          {{ o }}: {{ ownerList[o].length }}
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
      <h3>minted {{ mintedCount }}</h3>
      <h3>owner {{ ownerCount }}</h3>
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
// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { APP_LIKE_CO_VIEW } from '~/constant';
import { getNFTHistory } from '~/util/api';
import { initKeplr } from '~/util/keplr';
import { getNFTCountByClassId } from '~/util/nft';

export default {
  layout: 'desktop',
  data() {
    return {
      wallet: '',
      userOwnedCount: 0,
      iscnOwnerInfo: {},
      history: [],
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassPurchaseInfoById',
      'getNFTClassMetadataById',
      'getNFTClassOwnerInfoById',
      'getNFTClassOwnerCount',
      'getNFTClassMintedCount',
    ]),
    classId() {
      return this.$route.params.classId;
    },
    NFTClassMetadata() {
      return this.getNFTClassMetadataById(this.classId) || {};
    },
    purcahseInfo() {
      return this.getNFTClassPurchaseInfoById(this.classId) || {};
    },
    ownerInfo() {
      return this.getNFTClassOwnerInfoById(this.classId) || {};
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
      return this.getNFTClassOwnerInfoById(this.classId) || {};
    },
    ownerCount() {
      return this.getNFTClassOwnerCount(this.classId);
    },
    mintedCount() {
      return this.getNFTClassMintedCount(this.classId);
    },
  },
  watch: {
    NFTClassMetadata(data) {
      Vue.set(this.iscnOwnerInfo, 'wallet', data.iscn_owner);
    },
  },
  mounted() {
    if (!this.getNFTClassMetadataById(this.classId)) {
      this.updateNFTClassMetdata();
    }
    if (!this.getNFTClassPurchaseInfoById(this.classId)) {
      this.updateNFTPurchaseInfo();
    }
    if (!this.getNFTClassOwnerInfoById(this.classId)) this.updateNFTOwners();
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
    ...mapActions([
      'fetchNFTPurchaseInfo',
      'fetchNFTMetadata',
      'fetchNFTOwners',
    ]),
    async updateNFTClassMetdata() {
      await this.fetchNFTMetadata(this.classId);
    },
    async updateNFTPurchaseInfo() {
      await this.fetchNFTPurchaseInfo(this.classId);
    },
    async updateNFTOwners() {
      await this.fetchNFTOwners(this.classId);
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
