/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import { getNFTs } from '~/util/nft';
import { getUserSellNFTClasses } from '@/util/api';

const NFT_SET_USER_CREATED_CLASS_IDS_MAP = 'NFT_SET_USER_CREATED_CLASS_IDS_MAP';
const NFT_SET_USER_COLLECTED_NFTS_MAP = 'NFT_SET_USER_COLLECTED_NFTS_MAP';

const state = () => ({
  userCreatedClassIdsMap: {},
  userCollectedNFTsMap: {},
});

const mutations = {
  [NFT_SET_USER_CREATED_CLASS_IDS_MAP](state, { address, classIds }) {
    Vue.set(state.userCreatedClassIdsMap, address, classIds);
  },
  [NFT_SET_USER_COLLECTED_NFTS_MAP](state, { address, nfts }) {
    Vue.set(state.userCollectedNFTsMap, address, nfts);
  },
};

const getters = {
  getCreatedClassIdsByAddress: state => address =>
    state.userCreatedClassIdsMap[address],
  getCollectedNFTsByAddress: state => address =>
    state.userCollectedNFTsMap[address],
};

const actions = {
  async fetchNFTListByAddress({ commit }, address) {
    const [{ nfts }, { list: createdIds }] = await Promise.all([
      getNFTs({ owner: address }),
      this.$api.$get(getUserSellNFTClasses({ wallet: address })),
    ]);

    commit(NFT_SET_USER_CREATED_CLASS_IDS_MAP, {
      address,
      classIds: createdIds,
    });
    commit(NFT_SET_USER_COLLECTED_NFTS_MAP, { address, nfts });
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
