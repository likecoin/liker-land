export default {
  name: 'id-civic-page',
  experimentID: 'fkK4Gw7vTwCXWUsdrhXxnw',
  isEligible: ({ route }) => !process.server && route.name === 'id-civic',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
