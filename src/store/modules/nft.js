/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import { getNFTs } from '~/util/nft';
import { getUserSellNFTClasses } from '@/util/api';

const NFT_SET_USER_CLASSID_LIST_MAP = 'NFT_SET_USER_CLASSID_LIST_MAP';

const state = () => ({
  userClassIdListMap: {},
});

const mutations = {
  [NFT_SET_USER_CLASSID_LIST_MAP](state, { address, nfts }) {
    Vue.set(state.userClassIdListMap, address, nfts);
  },
};

const getters = {
  NFTClassIdList: state => state.userClassIdListMap,
  getNFTClassIdListByAddress: state => address =>
    state.userClassIdListMap[address],
};

const actions = {
  async fetchNFTListByAddress({ commit }, address) {
    const [{ nfts }, { list: createdIds }] = await Promise.all([
      getNFTs({ owner: address }),
      this.$api.$get(getUserSellNFTClasses({ wallet: address })),
    ]);
    const collectedIds = nfts?.map(n => n?.classId);

    commit(NFT_SET_USER_CLASSID_LIST_MAP, {
      address,
      nfts: {
        created: createdIds,
        collected: collectedIds,
      },
    });
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
