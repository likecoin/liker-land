export default {
  name: 'id-civic-page',
  experimentID: '3LhbX2MeRN-PFF1ZspPKSg',
  isEligible: ({ route }) => !process.server && route.name === 'id-civic',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
