/* eslint no-param-reassign: "off" */
import Vuex from 'vuex'; // eslint-disable-line import/no-extraneous-dependencies
import reader from './modules/reader';
import user from './modules/user';

const createStore = () =>
  new Vuex.Store({
    modules: {
      reader,
      user,
    },
  });

export default createStore;
