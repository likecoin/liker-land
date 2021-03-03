export default {
  name: 'error-page',
  experimentID: 'C87ExNSlToertq9pakD1nw',
  isEligible: ({ route }) =>
    !process.server && route.name === 'id-civic-register',
  variants: [{ name: 'origin', weight: 5 }, { name: 'variant', weight: 5 }],
};
