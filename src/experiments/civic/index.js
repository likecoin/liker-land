export default {
  name: 'civic-page',
  experimentID: 'y2n013NwSdqWifllQ0kQLQ',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'old', weight: 5 }, { name: 'new', weight: 5 }],
};
