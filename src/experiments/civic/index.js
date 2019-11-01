export default {
  name: 'civic-page',
  experimentID: '7_gHqKdrRu6QC3YsBvjJdw',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'origin', weight: 5 }, { name: 'monthly', weight: 5 }],
};
