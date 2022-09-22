/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import { getNFTs } from '~/util/nft';
import { getUserSellNFTClasses } from '@/util/api';

const NFT_SET_USER_CLASSID_LIST = 'NFT_SET_USER_CLASSID_LIST';

const state = () => ({
  userClassIdList: {},
});

const mutations = {
  [NFT_SET_USER_CLASSID_LIST](state, { address, nfts }) {
    Vue.set(state.userClassIdList, address, nfts);
  },
};

const getters = {
  NFTClassIdList: state => state.userClassIdList,
  getNFTClassIdListByAddress: state => address =>
    state.userClassIdList[address],
};

const actions = {
  async updateUserNFTList({ commit }, address) {
    const [{ nfts }, { list: createdIds }] = await Promise.all([
      getNFTs({ owner: address }),
      this.$api.$get(getUserSellNFTClasses({ wallet: address })),
    ]);
    const collectedIds = nfts?.map(n => n?.classId);

    commit(NFT_SET_USER_CLASSID_LIST, {
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
