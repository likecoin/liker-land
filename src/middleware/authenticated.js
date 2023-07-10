export default function({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  req,
  res,
  route,
  store,
  error,
  redirect,
  localeLocation,
}) {
  if (!store.getters.getUserId) {
    let message;
    switch (route.name) {
      case 'creators-dashboard':
        redirect(localeLocation({ name: 'creators' }));
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
