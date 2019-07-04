export default {
  name: 'direct-signin',
  experimentID: 'zwkC3oVJRNKo6ZLt2Ol5Lw',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'indirect', weight: 5 }, { name: 'direct', weight: 5 }],
};
