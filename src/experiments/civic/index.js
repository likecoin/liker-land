export default {
  name: 'civic-page',
  experimentID: 'I5hZXx3xSc-QrG0_HZ8mPQ',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
