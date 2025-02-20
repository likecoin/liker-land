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
  subscribedWallet,
  language = 'en',
}) => () =>
  `${EXTERNAL_URL}/settings/following?language=${language}&creator=${subscribedWallet}&action=unfollow`;
