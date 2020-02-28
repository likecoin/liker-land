export default {
  name: 'civic-page',
  experimentID: 'mQGuIgsxQ-WhjlyYxQHcPg',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
