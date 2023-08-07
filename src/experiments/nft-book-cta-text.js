export default {
  name: 'nft-book-cta-text',
  experimentID: 'jC3pV20PSuCkVGUNaATp3g',
  isEligible: ({ route }) => !process.server && route.name,
  variants: [{ name: 'origin', weight: 1 }, { name: 'variant', weight: 1 }],
};
