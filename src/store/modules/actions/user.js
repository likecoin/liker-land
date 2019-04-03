import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

// function updateSentryUser({ user, displayName }) {
//   const opt = {
//     id: user,
//     username: displayName || user,
//   };
//   this.$sentry.configureScope(scope => {
//     scope.setUser(opt);
//   });
// }

// function updateIntercomUser({ user, intercomToken, displayName, email }) {
//   if (this.$intercom && this.$intercom.booted) {
//     const opt = {
//       user_id: user,
//       user_hash: intercomToken,
//       name: displayName || user,
//       email,
//     };
//     this.$intercom.update(opt);
//   }
// }

export async function getOAuthToken({ commit }, { authCode, state }) {
  const user = await this.$axios.$post(api.getOAuthCallbackAPI(), {
    authCode,
    state,
  });
  commit(types.USER_SET_USER_INFO, user);
  // if (this.$sentry) updateSentryUser(user);
  // if (this.$intercom) updateIntercomUser(user);
  return user;
}

export async function fetchLoginStatus({ commit }) {
  try {
    const user = await this.$axios.$get(api.getLoginStatus());
    commit(types.USER_SET_USER_INFO, user);
    // if (this.$sentry) updateSentryUser(user);
    // if (this.$intercom) updateIntercomUser(user);
    return user;
  } catch (err) {
    return false;
  }
}

export function setUserCivicLiker({ commit }) {
  commit(types.USER_UPDATE_USER_INFO, { isSubscribedCivicLiker: true });
}
