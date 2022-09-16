import * as types from '@/store/mutation-types';
import * as api from '@/util/api';
import { getNFTQueryClient, amountToLIKE } from '~/util/nft';
import {
  updateSentryUser,
  updateCrispUser,
  setTrackerUser,
} from '@/util/EventLogger';
import { normalizeLocaleForLikeCo } from '@/locales';
import { LIKECOIN_CHAIN_MIN_DENOM } from '~/constant';

export async function postLoginToken(
  { commit, dispatch },
  { authCode, state }
) {
  const user = await this.$api.$post(api.getOAuthCallbackAPI(), {
    authCode,
    state,
  });
  commit(types.USER_SET_USER_INFO, user);
  if (user && user.locale) {
    dispatch('setLocale', user.locale);
  }
  if (this.$sentry) updateSentryUser(this, user);
  if (this.$crisp) updateCrispUser(this, user);
  await setTrackerUser(this, user);
  return user;
}

export async function fetchLoginStatus({ commit, dispatch }) {
  try {
    const user = await this.$api.$get(api.getLoginStatus());
    commit(types.USER_SET_USER_INFO, user);
    if (user && user.locale) {
      dispatch('setLocale', user.locale);
    }

    if (this.$sentry) updateSentryUser(this, user);
    if (this.$crisp) updateCrispUser(this, user);
    return user;
  } catch (err) {
    return false;
  }
}

export async function userLogout({ commit }) {
  await this.$api.$post(api.getLogoutAPI());
  commit(types.USER_SET_USER_INFO, {});
  commit(types.READER_CLEAR_FOR_LOGOUT);
  if (this.$sentry) updateSentryUser(this, { user: null });
  if (this.$crisp) {
    this.$crisp.push(['do', 'session:reset']);
  }
}

export function setUserCivicLiker({ commit }, { civicLikerVersion = 1 } = {}) {
  commit(types.USER_UPDATE_USER_INFO, {
    isSubscribedCivicLiker: true,
    civicLikerVersion,
    subscriptionInfo: {},
  });
}

export async function updatePreferences(
  { dispatch, commit, getters },
  { locale, creatorPitch } = {}
) {
  const preferences = {};
  if (locale) {
    dispatch('setLocale', locale);
    preferences.locale = normalizeLocaleForLikeCo(locale);
  }
  if (creatorPitch !== undefined && typeof creatorPitch === 'string') {
    preferences.creatorPitch = creatorPitch;
    commit(types.USER_UPDATE_USER_INFO, { creatorPitch });
  }
  if (Object.keys(preferences).length) {
    if (getters.getUserId)
      await this.$api.$post(api.userPreferences(), preferences);
  }
}

export async function userFetchAccountBalance({ commit }, address) {
  const c = await getNFTQueryClient();
  const client = await c.getQueryClient();
  const balance = amountToLIKE(
    await client.bank.balance(address, LIKECOIN_CHAIN_MIN_DENOM)
  );
  commit(types.USER_ACCOUNT_BALANCE, balance);
}
