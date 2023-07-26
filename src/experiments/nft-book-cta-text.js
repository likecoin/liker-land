export default {
  name: 'nft-book-cta-text',
  experimentID: 'jVyrPVSrRguBh7QF_AC8Gg',
  isEligible: ({ route }) => !process.server && route.name,
  variants: [{ name: 'origin', weight: 1 }, { name: 'variant', weight: 1 }],
};
