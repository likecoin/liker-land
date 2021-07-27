export default function({ req, res, route, store, error, redirect }) {
  if (!store.getters.getUserId) {
    let message;
    switch (route.name) {
      case 'creators-dashboard':
        redirect({ name: 'creators' });
        return;

      case 'civic-dashboard':
      case 'civic-register':
        message = 'LOGIN_NEEDED_TO_REGISTER_CIVIC_LIKER';
        break;

      default:
        message = 'LOGIN_NEEDED';
        break;
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
