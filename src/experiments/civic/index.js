export default {
  name: 'civic-page',
  experimentID: 'pQH_J0o1QVyOyCi5mhG-Qg',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
