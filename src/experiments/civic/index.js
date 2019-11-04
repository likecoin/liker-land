export default {
  name: 'civic-page',
  experimentID: 'z3qJJyoBT3uLcJFk42QESg',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'origin', weight: 5 }, { name: 'monthly', weight: 5 }],
};
