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
  return (action = 'subscribe') =>
    `${EXTERNAL_URL}/${subscribedWallet}/${action}/${subscriptionId}?language=${language}&email=${encodeURIComponent(
      subscriberEmail
    )}`;
};
