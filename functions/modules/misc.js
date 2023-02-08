const { EXTERNAL_URL } = process.env;

exports.convertLanguageCodeForEmailTemplate = (languageCode = 'en') => {
  switch (languageCode) {
    case 'zh-Hant':
      return 'zh';
    default:
      return 'en';
  }
};

exports.createSubscriptionConfirmURLFactory = ({
  subscriptionId,
  subscribedWallet,
  subscriberEmail,
  language = 'en',
}) => {
  if (!subscriptionId) {
    return () =>
      `${EXTERNAL_URL}/settings/following?language=${language}&creator=${subscribedWallet}&action=unfollow`;
  }
  return (action = 'subscribe') =>
    `${EXTERNAL_URL}/${subscribedWallet}/${action}/${subscriptionId}?language=${language}&email=${encodeURIComponent(
      subscriberEmail
    )}`;
};
