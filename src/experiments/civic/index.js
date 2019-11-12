export default {
  name: 'civic-page',
  experimentID: 'H-pXLBStSAG-H1YxGYBVHw',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
