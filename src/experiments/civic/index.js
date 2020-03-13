export default {
  name: 'civic-page',
  experimentID: 'HZ8Run-3Qo2CnkzwkACnEw',
  isEligible: ({ route }) => !process.server && route.name === 'civic',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
