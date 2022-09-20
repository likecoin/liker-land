/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import { getNFTs } from '~/util/nft';
import { getUserSellNFTClasses } from '@/util/api';

const axios = require('axios');

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
  NFTClassIdsByAddress: state => address => state.userClassIdList[address],
};

const actions = {
  updateUserNFTList: async ({ commit }, address) => {
    const { nfts } = await getNFTs({ owner: address });
    const collectedIds = nfts?.map(n => n?.classId);
    const { data } = await axios.get(
      getUserSellNFTClasses({ wallet: address })
    );
    const createdIds = data?.list;
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
