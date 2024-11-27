/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import {
  loadShoppingCartFromStorage,
  saveShoppingCartToStorage,
} from '~/util/shopping-cart';
import { BATCH_COLLECT_MAX } from '~/constant';
import { postShoppingCart, deleteShoppingCart } from '~/util/api';
import * as TYPES from '../mutation-types';

const state = () => ({
  shoppingCartNFTClassByIdMap: {},
  shoppingCartBookProductByIdMap: {},
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
  [TYPES.SHOPPING_CART_ADD_BOOK_PRODUCT](
    state,
    { item: newItem, overwrite = false }
  ) {
    const {
      collectionId,
      classId,
      priceIndex,
      coupon,
      customPriceInDecimal,
      from,
    } = newItem;
    const productId = collectionId || classId;
    let item = state.shoppingCartBookProductByIdMap[productId];
    if (!item || item.priceIndex !== priceIndex) {
      item = {
        productId,
        collectionId,
        classId,
        coupon,
        customPriceInDecimal,
        from,
        timestamp: Date.now(),
        quantity: 1,
        priceIndex: priceIndex ?? (classId ? 0 : undefined),
      };
    } else if (!overwrite) {
      item = {
        ...item,
        quantity: item.quantity + 1,
      };
    }
    Vue.set(state.shoppingCartBookProductByIdMap, productId, item);
  },
  [TYPES.SHOPPING_CART_REMOVE_BOOK_PRODUCT](state, { productId }) {
    Vue.delete(state.shoppingCartBookProductByIdMap, productId);
  },
  [TYPES.SHOPPING_CART_REPLACE_ALL_BOOK_PRODUCT](state, map) {
    state.shoppingCartBookProductByIdMap = map;
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
  shoppingCartBookProductList: (state, getter) => {
    const list = Object.values(state.shoppingCartBookProductByIdMap).filter(
      item => {
        let itemPrice = 0;
        if (item.collectionId) {
          const price = getter.getNFTCollectionPriceByCollectionId(
            item.collectionId
          );
          itemPrice = price;
        } else {
          const edition = getter.getNFTBookStorePriceByClassIdAndIndex(
            item.classId,
            item.priceIndex || 0
          );
          itemPrice = edition?.price;
        }
        return itemPrice || item.customPriceInDecimal > 0;
      }
    );
    list.sort((a, b) => a.timestamp - b.timestamp);
    return list;
  },
  shoppingCartBookItems: state =>
    Object.values(state.shoppingCartBookProductByIdMap),
  getShoppingCartBookProductQuantity: state => productId =>
    state.shoppingCartBookProductByIdMap[productId]?.quantity || 0,
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
  addBookProductToShoppingCart({ commit, dispatch, getters }, item) {
    if (getters.shoppingCartBookProductList.length >= BATCH_COLLECT_MAX) {
      return;
    }
    commit(TYPES.SHOPPING_CART_ADD_BOOK_PRODUCT, { item });
    dispatch('saveBookProductShoppingCart');
  },
  addBookProductsToShoppingCart({ commit, dispatch }, items) {
    items.slice(0, BATCH_COLLECT_MAX).forEach(item => {
      commit(TYPES.SHOPPING_CART_ADD_BOOK_PRODUCT, { item, overwrite: true });
    });
    dispatch('saveBookProductShoppingCart');
  },
  removeBookProductFromShoppingCart({ commit, dispatch }, { productId }) {
    commit(TYPES.SHOPPING_CART_REMOVE_BOOK_PRODUCT, { productId });
    dispatch('saveBookProductShoppingCart');
  },
  clearBookProductShoppingCart({ commit, dispatch }) {
    commit(TYPES.SHOPPING_CART_REPLACE_ALL_BOOK_PRODUCT, {});
    dispatch('saveBookProductShoppingCart');
  },
  async saveBookProductShoppingCart({ state, getters }) {
    saveShoppingCartToStorage(state.shoppingCartBookProductByIdMap, 'book');
    if (getters.loginAddress) {
      const cart = Object.values(state.shoppingCartBookProductByIdMap);
      try {
        if (cart.length) {
          await this.$api.$post(postShoppingCart(), { cart });
        } else {
          await this.$api.$post(postShoppingCart(), { cart });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  },
  loadBookProductShoppingCart({ commit, getters }) {
    if (!getters.shoppingCartBookItems.length) {
      commit(
        TYPES.SHOPPING_CART_REPLACE_ALL_BOOK_PRODUCT,
        loadShoppingCartFromStorage('book')
      );
    }
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
