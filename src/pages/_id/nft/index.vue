<template>
  <div>
    <Identity
      v-if="userInfo"
      :avatar-url="userInfo.avatar"
      :avatar-size="88"
      :is-avatar-outlined="isCivicLiker"
    />
    <section>
      <h2>Owned Works</h2>
      <div v-for="id in ownedNFTClassId" :key="id ">
        <div v-if="NFTclassInfo[id]">
          <div :style="`background-color: ${NFTclassInfo[id].metadata.background_color}`">
            <img :src="NFTclassInfo[id].metadata.image">
          </div>
          <div>iscn owner: {{ NFTclassInfo[id].metadata.iscn_owner }}</div>
          <button @click="() => onDetails(id)">Details: {{ NFTclassInfo[id].price }} LIKE</button>
          <div>owned: {{ NFTclassInfo[id].ownedCount }}</div>
          <div>minted: {{ NFTclassInfo[id].mintedCount }}</div>
        </div>
      </div>
    </section>
    <hr></hr>
    <section>
      <h2>Selling Works</h2>
      <div v-for="id in sellingNFTClassId" :key="id">
        <div v-if="NFTclassInfo[id]">
          <div :style="`background-color: ${NFTclassInfo[id].metadata.background_color}`">
            <img :src="NFTclassInfo[id].metadata.image">
          </div>
          <div>iscn owner: {{ NFTclassInfo[id].metadata.iscn_owner }}</div>
          <button @click="() => onDetails(id)">Details: {{ NFTclassInfo[id].price }} LIKE</button>
          <div>owned: {{ NFTclassInfo[id].ownedCount }}</div>
          <div>minted: {{ NFTclassInfo[id].mintedCount }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import {
  getUserMinAPI,
  getUserOwnNFTClasses,
  getUserSellNFTClasses,
  getNFTPurchaseInfo,
  getNFTMetadata,
  getNFTOwners,
} from '~/util/api';
import { checkUserNameValid } from '~/util/user';
import Identity from '~/components/Identity/Identity';

export default {
  layout: 'desktop',
  components: {
    Identity,
  },
  data() {
    return {
      userInfo: null,
      NFTclassInfo: {},
      ownedNFTClassId: [],
      sellingNFTClassId: [],
    };
  },
  computed: {
    isCivicLiker() {
      return !!(
        this.userInfo &&
        (this.userInfo.isCivicLikerTrial ||
          this.userInfo.isSubscribedCivicLiker)
      );
    },
  },
  async asyncData({ route, $api, error }) {
    const { id } = route.params;
    if (id.startsWith('like1')) {
      return {
        wallet: id,
      };
    }
    if (id && checkUserNameValid(id)) {
      try {
        const userInfo = await $api.$get(getUserMinAPI(id));
        return {
          userInfo,
          wallet: userInfo.likeWallet,
        };
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    }
    error({ statusCode: 404, message: 'LIKER_NOT_FOUND' });
    return undefined;
  },
  mounted() {
    this.fetchUserOwnClasses();
    this.fetchUserSellingClasses();
  },
  methods: {
    async fetchUserOwnClasses() {
      const { data } = await this.$api.get(
        getUserOwnNFTClasses({ wallet: this.wallet })
      );
      this.ownedNFTClassId = data.list;
      this.ownedNFTClassId.forEach(id => this.updateNFTClassData(id));
    },
    async fetchUserSellingClasses() {
      const { data } = await this.$api.get(
        getUserSellNFTClasses({ wallet: this.wallet })
      );
      this.sellingNFTClassId = data.list;
      this.sellingNFTClassId.forEach(id => this.updateNFTClassData(id));
    },
    // TODO: refactor to store
    async updateNFTClassData(classId) {
      if (this.NFTclassInfo[classId]) return;
      const [metadata, purchaseInfo, owners] = await Promise.all([
        this.updateNFTClassMetadata(classId),
        this.updateNFTPurchaseInfo(classId),
        this.updateNFTOwners(classId),
      ]);
      Vue.set(this.NFTclassInfo, classId, {
        metadata,
        price: purchaseInfo.price,
        ownedCount: Object.keys(owners).length,
        mintedCount: Object.values(owners).reduce(
          (acc, cur) => acc + cur.length,
          0
        ),
      });
    },
    async updateNFTClassMetadata(classId) {
      const { data } = await this.$api.get(getNFTMetadata({ classId }));
      return data;
    },
    async updateNFTPurchaseInfo(classId) {
      const { data } = await this.$api.get(getNFTPurchaseInfo({ classId }));
      return data;
    },
    async updateNFTOwners(classId) {
      const { data } = await this.$api.get(getNFTOwners({ classId }));
      return data;
    },
    onDetails(classId) {
      this.$router.push({ name: 'nft-class-classId', params: { classId } });
    },
  },
};
</script>
