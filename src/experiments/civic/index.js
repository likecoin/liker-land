export default {
  name: 'new-layout',
  experimentID: 'YL2hMTYRQTKTBFKEdL9oQA',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'old', weight: 5 }, { name: 'new', weight: 5 }],
};
