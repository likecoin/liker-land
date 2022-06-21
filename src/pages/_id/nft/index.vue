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
        <div v-if="getNFTClassMetadataById(id)">
          <div :style="`background-color: ${getNFTClassMetadataById(id).background_color}`">
            <img :src="getNFTClassMetadataById(id).image">
          </div>
          <div>iscn owner: {{ getNFTClassMetadataById(id).iscn_owner }}</div>
          <button
            v-if="getNFTClassPurchaseInfoById(id)"
            @click="() => onDetails(id)"
          >
            Details: {{ getNFTClassPurchaseInfoById(id).price }} LIKE
          </button>
          <template v-if="getNFTClassOwnerInfoById(id)">
            <div>owned: {{ getNFTClassOwnerCount(id) }}</div>
            <div>minted: {{ getNFTClassMintedCount(id) }}</div>
          </template>
        </div>
      </div>
    </section>
    <hr></hr>
    <section>
      <h2>Selling Works</h2>
      <div v-for="id in sellingNFTClassId" :key="id">
        <div v-if="getNFTClassMetadataById(id)">
          <div :style="`background-color: ${getNFTClassMetadataById(id).background_color}`">
            <img :src="getNFTClassMetadataById(id).image">
          </div>
          <div>iscn owner: {{ getNFTClassMetadataById(id).iscn_owner }}</div>
          <button
            v-if="getNFTClassPurchaseInfoById(id)"
            @click="() => onDetails(id)"
          >
            Details: {{ getNFTClassPurchaseInfoById(id).price }} LIKE
          </button>
          <template v-if="getNFTClassOwnerInfoById(id)">
            <div>owned: {{ getNFTClassOwnerCount(id) }}</div>
            <div>minted: {{ getNFTClassMintedCount(id) }}</div>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getUserMinAPI, getUserSellNFTClasses } from '~/util/api';
import { checkUserNameValid } from '~/util/user';
import { getNFTs } from '~/util/nft';
import Identity from '~/components/Identity/Identity';

export default {
  layout: 'desktop',
  components: {
    Identity,
  },
  data() {
    return {
      userInfo: null,
      ownedNFTClassId: [],
      sellingNFTClassId: [],
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
    ...mapActions([
      'fetchNFTPurchaseInfo',
      'fetchNFTMetadata',
      'fetchNFTOwners',
    ]),
    async fetchUserOwnClasses() {
      const { nfts } = await getNFTs({ owner: this.wallet });
      const classIdSet = new Set(nfts.map(n => n.classId));
      this.ownedNFTClassId = Array.from(classIdSet);
      this.ownedNFTClassId.forEach(id => this.updateNFTClassData(id));
    },
    async fetchUserSellingClasses() {
      const { data } = await this.$api.get(
        getUserSellNFTClasses({ wallet: this.wallet })
      );
      this.sellingNFTClassId = data.list;
      this.sellingNFTClassId.forEach(id => this.updateNFTClassData(id));
    },
    updateNFTClassData(classId) {
      if (!this.getNFTClassMetadataById(classId)) {
        this.fetchNFTMetadata(classId);
      }
      if (!this.getNFTClassPurchaseInfoById(classId)) {
        this.fetchNFTPurchaseInfo(classId);
      }
      if (!this.getNFTClassOwnerInfoById(classId)) {
        this.fetchNFTOwners(classId);
      }
    },
    onDetails(classId) {
      this.$router.push({ name: 'nft-class-classId', params: { classId } });
    },
  },
};
</script>
