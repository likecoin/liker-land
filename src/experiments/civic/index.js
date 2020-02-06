export default {
  name: 'civic-register-page',
  experimentID: 'TVNh_HB8QiK727YQNJLXOA',
  isEligible: ({ route }) => !process.server && /^civic/.test(route.name),
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
