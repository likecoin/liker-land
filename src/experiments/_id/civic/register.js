export default {
  name: 'error-page',
  experimentID: 'C87ExNSlToertq9pakD1nw',
  isEligible: ({ route }) => !process.server && /^id-civic/.test(route.name),
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
