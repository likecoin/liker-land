export default function({ req, res, route, store, error }) {
  if (!store.getters.getUserId) {
    let message;
    if (route.name === 'civic-register') {
      message = 'LOGIN_NEEDED_TO_REGISTER_CIVIC_LIKER';
    } else {
      message = 'LOGIN_NEEDED';
    }

    error({
      statusCode: 401,
      message,
      isBackButtonHidden: !!process.server,
    });
  } else if (process.server) {
    res.set('Cache-Control', 'private');
    res.set('Vary', 'Cookie');
  }
}
