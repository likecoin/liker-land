import * as cookie from 'tiny-cookie';

import { EXPERIMENT_COOKIE_NAME } from '~/constant';

export default ({ store }) => {
  try {
    if (process.client) {
      if (!document.cookie || !cookie.enabled()) return;
      const { expCookie } = store.state.user;
      if (expCookie) cookie.set(EXPERIMENT_COOKIE_NAME, expCookie, Date.now());
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
};
