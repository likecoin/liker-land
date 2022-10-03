/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import { getNFTs } from '~/util/nft';
import { getUserSellNFTClasses } from '@/util/api';

const NFT_SET_USER_CREATED_CLASS_IDS_MAP = 'NFT_SET_USER_CREATED_CLASS_IDS_MAP';
const NFT_SET_USER_COLLECTED_CLASS_INFOS_MAP =
  'NFT_SET_USER_COLLECTED_CLASS_INFOS_MAP';

const state = () => ({
  userCreatedClassIdsMap: {},
  userCollectedClassInfoMap: {},
});

const mutations = {
  [NFT_SET_USER_CREATED_CLASS_IDS_MAP](state, { address, classIds }) {
    Vue.set(state.userCreatedClassIdsMap, address, classIds);
  },
  [NFT_SET_USER_COLLECTED_CLASS_INFOS_MAP](state, { address, classInfos }) {
    Vue.set(state.userCollectedClassInfoMap, address, classInfos);
  },
};

const getters = {
  getCreatedClassIdsByAddress: state => address =>
    state.userCreatedClassIdsMap[address],
  getCollectedClassInfosByAddress: state => address =>
    state.userCollectedClassInfoMap[address],
};

const actions = {
  async fetchNFTListByAddress({ commit }, address) {
    const [{ nfts }, { list: createdIds }] = await Promise.all([
      getNFTs({ owner: address }),
      this.$api.$get(getUserSellNFTClasses({ wallet: address })),
    ]);

    const classInfoMap = {};
    nfts.forEach(nft => {
      const { classId } = nft;
      if (!classInfoMap[classId]) {
        classInfoMap[classId] = { classId };
      }
    });
    const classInfos = Object.values(classInfoMap);

    commit(NFT_SET_USER_CREATED_CLASS_IDS_MAP, {
      address,
      classIds: createdIds,
    });
    commit(NFT_SET_USER_COLLECTED_CLASS_INFOS_MAP, { address, classInfos });
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
