export default function({ req, route, store, error }) {
  if (!store.getters.getUserId) {
    let targetPath;
    if (process.client) {
      if (window.sessionStorage) {
        window.sessionStorage.setItem(
          'USER_POST_AUTH_ROUTE',
          JSON.stringify(route)
        );
      }
    } else if (process.server) {
      targetPath = route.fullPath;
    }
    error({
      statusCode: 401,
      message: 'LOGIN_NEEDED',
      payload: { targetPath },
    });
  }
}
