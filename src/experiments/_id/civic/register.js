export default {
  name: 'error-page',
  experimentID: '3LhbX2MeRN-PFF1ZspPKSg',
  isEligible: ({ route }) =>
    !process.server && route.name === 'id-civic-register',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
