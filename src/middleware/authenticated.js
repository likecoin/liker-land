import { TEST_MODE } from '@/constant';

export default function({ req, route, store, error }) {
  if (!store.getters.getUserId) {
    let targetUrl;
    if (process.client) {
      if (window.sessionStorage) {
        window.sessionStorage.setItem(
          'USER_POST_AUTH_ROUTE',
          JSON.stringify(route)
        );
      }
    } else if (process.server) {
      targetUrl = encodeURIComponent(
        `${TEST_MODE ? 'http' : 'https'}://${req.headers.host}${route.fullPath}`
      );
    }
    error({ statusCode: 401, message: 'LOGIN_NEEDED', payload: { targetUrl } });
  }
}
