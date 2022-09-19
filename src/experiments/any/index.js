export default {
  name: 'any',
  experimentID: 'fK3CzlLmRnKaK2uCY3-35A',
  isEligible: ({ route }) => !process.server && !!route.name,
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
