export default function({ req, res, route, store, error }) {
  if (!store.getters.getUserId) {
    error({
      statusCode: 401,
      message: 'LOGIN_NEEDED',
      isBackButtonHidden: !!process.server,
    });
  } else if (process.server) {
    res.set('Cache-Control', 'private');
    res.set('Vary', 'Cookie');
  }
}
