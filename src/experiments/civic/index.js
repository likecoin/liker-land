export default {
  name: 'civic-page',
  experimentID: 'vzP3bwz3S9GP9NH-JjMiFQ',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
