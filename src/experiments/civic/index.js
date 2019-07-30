export default {
  name: 'civic-page',
  experimentID: '',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'old', weight: 5 }, { name: 'new', weight: 5 }],
};
