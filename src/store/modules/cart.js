/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import {
  loadShoppingCartFromStorage,
  saveShoppingCartToStorage,
} from '~/util/shopping-cart';
import { BATCH_COLLECT_MAX } from '~/constant';
import * as TYPES from '../mutation-types';

const state = () => ({
  shoppingCartNFTClassByIdMap: {},
});

const mutations = {
  [TYPES.SHOPPING_CART_ADD_NFT_CLASS](state, { classId }) {
    let item = state.shoppingCartNFTClassByIdMap[classId];
    if (!item) {
      item = {
        timestamp: Date.now(),
        quantity: 1,
      };
    } else {
      item = {
        ...item,
        quantity: item.quantity + 1,
      };
    }
    Vue.set(state.shoppingCartNFTClassByIdMap, classId, item);
  },
  [TYPES.SHOPPING_CART_REMOVE_NFT_CLASS](state, { classId }) {
    Vue.delete(state.shoppingCartNFTClassByIdMap, classId);
  },
  [TYPES.SHOPPING_CART_REPLACE_ALL_NFT_CLASS](state, map) {
    state.shoppingCartNFTClassByIdMap = map;
  },
};

const getters = {
  shoppingCartNFTClassList: (state, getter) => {
    const list = [...Object.entries(state.shoppingCartNFTClassByIdMap)]
      .map(([classId, data]) => ({ classId, ...data }))
      .filter(item => {
        const purchaseInfo = getter.getNFTClassPurchaseInfoById(item.classId);
        // fetch purchase info in shopping cart component later
        return !purchaseInfo || purchaseInfo.price > 0;
      });
    list.sort((a, b) => a.timestamp - b.timestamp);
    return list;
  },
  getShoppingCartNFTClassQuantity: state => classId =>
    state.shoppingCartNFTClassByIdMap[classId]?.quantity || 0,
};

const actions = {
  addNFTClassToShoppingCart({ commit, dispatch, getters }, { classId }) {
    if (getters.shoppingCartNFTClassList.length >= BATCH_COLLECT_MAX) {
      return;
    }
    commit(TYPES.SHOPPING_CART_ADD_NFT_CLASS, { classId });
    dispatch('saveShoppingCart');
  },
  addNFTClassesToShoppingCart({ commit, dispatch }, { classIds }) {
    commit(TYPES.SHOPPING_CART_REPLACE_ALL_NFT_CLASS, {});
    classIds.slice(0, BATCH_COLLECT_MAX).forEach(classId => {
      commit(TYPES.SHOPPING_CART_ADD_NFT_CLASS, { classId });
    });
    dispatch('saveShoppingCart');
  },
  removeNFTClassFromShoppingCart({ commit, dispatch }, { classId }) {
    commit(TYPES.SHOPPING_CART_REMOVE_NFT_CLASS, { classId });
    dispatch('saveShoppingCart');
  },
  clearShoppingCart({ commit, dispatch }) {
    commit(TYPES.SHOPPING_CART_REPLACE_ALL_NFT_CLASS, {});
    dispatch('saveShoppingCart');
  },
  saveShoppingCart({ state }) {
    saveShoppingCartToStorage(state.shoppingCartNFTClassByIdMap);
  },
  loadShoppingCart({ commit }) {
    commit(
      TYPES.SHOPPING_CART_REPLACE_ALL_NFT_CLASS,
      loadShoppingCartFromStorage()
    );
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
